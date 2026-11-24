<?php
namespace Ce\Telemetry\Crawler;

/**
 * Descarga (cada 24 h, trabajo aparte) de los feeds oficiales de rangos IP. Lista blanca de URLs HTTPS, tiempo de espera
 * de 5 s, tope de 1 MiB, redirecciones solo hacia hosts permitidos, validación de JSON y CIDR, snapshot atómico.
 * Se conserva el último snapshot válido; TTL de 72 h: después la verificación pasa a «no disponible».
 */
class FeedUpdater
{
    const TTL_SECONDS = 259200; // 72 h
    const MAX_BYTES = 1048576;  // 1 MiB
    const TIMEOUT = 5;
    const MAX_REDIRECTS = 3;

    private $pdo;
    private $http;

    /** @param callable|null $http fn(string $url): ['status'=>int,'location'=>?string,'body'=>?string]; sustituible en pruebas */
    public function __construct($pdo, $http = null)
    {
        $this->pdo = $pdo;
        $this->http = $http !== null ? $http : [$this, 'fetchOnce'];
    }

    /** Valida el cuerpo de un feed. @return array|null lista de CIDR o null si el JSON/esquema no es válido */
    public static function parseFeed($body)
    {
        $doc = json_decode((string) $body, true);
        if (!is_array($doc) || !isset($doc['prefixes']) || !is_array($doc['prefixes']) || count($doc['prefixes']) === 0 || count($doc['prefixes']) > 20000) {
            return null;
        }
        $out = [];
        foreach ($doc['prefixes'] as $entry) {
            if (!is_array($entry)) {
                return null;
            }
            $cidr = isset($entry['ipv4Prefix']) ? $entry['ipv4Prefix'] : (isset($entry['ipv6Prefix']) ? $entry['ipv6Prefix'] : null);
            if (!is_string($cidr) || Cidr::parse($cidr) === null) {
                return null;
            }
            $out[] = $cidr;
        }
        return $out;
    }

    /** Descarga con redirecciones controladas. @return string|null cuerpo, o null ante cualquier fallo */
    public function download($feedId)
    {
        $feeds = BotCatalog::feeds();
        if (!isset($feeds[$feedId])) {
            return null;
        }
        $url = $feeds[$feedId][1];
        $allowed = $feeds[$feedId][2];
        for ($i = 0; $i <= self::MAX_REDIRECTS; $i++) {
            $parts = parse_url($url);
            if (!is_array($parts) || ($parts['scheme'] ?? '') !== 'https' || !in_array(strtolower($parts['host'] ?? ''), $allowed, true) || isset($parts['user']) || isset($parts['port'])) {
                return null;
            }
            $res = call_user_func($this->http, $url);
            if (!is_array($res)) {
                return null;
            }
            if ($res['status'] >= 300 && $res['status'] < 400 && !empty($res['location'])) {
                $url = $res['location'];
                continue;
            }
            return ($res['status'] === 200 && is_string($res['body']) && strlen($res['body']) <= self::MAX_BYTES) ? $res['body'] : null;
        }
        return null;
    }

    /** @return array ['updated'=>[], 'unchanged'=>[], 'failed'=>[]] por feed_id */
    public function run($now)
    {
        $report = ['updated' => [], 'unchanged' => [], 'failed' => []];
        $feeds = BotCatalog::feeds();
        foreach ($feeds as $id => $def) {
            $body = $this->download($id);
            $ranges = $body === null ? null : self::parseFeed($body);
            if ($ranges === null) {
                $report['failed'][] = $id; // se conserva el último snapshot válido; no se eleva la confianza
                continue;
            }
            $hash = hash('sha256', $body);
            $valid = gmdate('Y-m-d H:i:s', $now + self::TTL_SECONDS) . '.000';
            $last = $this->pdo->prepare('SELECT snapshot_id, content_hash FROM bot_range_snapshots WHERE provider = ? AND bot_family = ? ORDER BY fetched_at DESC, snapshot_id DESC LIMIT 1');
            $last->execute([$def[0], $id]);
            $row = $last->fetch();
            if ($row && $row['content_hash'] === $hash) {
                $upd = $this->pdo->prepare('UPDATE bot_range_snapshots SET valid_until = ? WHERE snapshot_id = ?');
                $upd->execute([$valid, $row['snapshot_id']]);
                $report['unchanged'][] = $id;
                continue;
            }
            sort($ranges);
            $ins = $this->pdo->prepare('INSERT INTO bot_range_snapshots (provider, bot_family, fetched_at, valid_until, source_url, content_hash, ranges_json) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $ins->execute([$def[0], $id, gmdate('Y-m-d H:i:s', $now) . '.000', $valid, $def[1], $hash, json_encode($ranges)]);
            $report['updated'][] = $id;
        }
        return $report;
    }

    /** Snapshots vigentes (más reciente por feed con valid_until >= $now). */
    public static function loadValid(\PDO $pdo, $now)
    {
        $st = $pdo->prepare('SELECT s.snapshot_id, s.bot_family, s.valid_until, s.ranges_json FROM bot_range_snapshots s JOIN (SELECT bot_family, MAX(snapshot_id) AS id FROM bot_range_snapshots GROUP BY bot_family) m ON m.id = s.snapshot_id');
        $st->execute();
        $out = [];
        foreach ($st->fetchAll() as $r) {
            $valid = strtotime($r['valid_until'] . ' UTC');
            $ranges = json_decode($r['ranges_json'], true);
            if (is_array($ranges)) {
                $out[$r['bot_family']] = ['snapshot_id' => (int) $r['snapshot_id'], 'ranges' => $ranges, 'valid_until' => $valid];
            }
        }
        return $out;
    }

    /** Descarga real de una URL (sin seguir redirecciones). Usa cURL si existe; si no, flujos PHP. */
    public function fetchOnce($url)
    {
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            $buf = '';
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => false, CURLOPT_FOLLOWLOCATION => false, CURLOPT_TIMEOUT => self::TIMEOUT,
                CURLOPT_CONNECTTIMEOUT => self::TIMEOUT, CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2, CURLOPT_USERAGENT => 'ce-telemetry-ranges/1.0',
                CURLOPT_HEADERFUNCTION => function ($c, $h) use (&$location) {
                    if (stripos($h, 'location:') === 0) {
                        $location = trim(substr($h, 9));
                    }
                    return strlen($h);
                },
                CURLOPT_WRITEFUNCTION => function ($c, $data) use (&$buf) {
                    $buf .= $data;
                    return strlen($buf) > FeedUpdater::MAX_BYTES ? -1 : strlen($data);
                },
            ]);
            $location = null;
            $ok = curl_exec($ch);
            $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
            curl_close($ch);
            return $ok === false ? null : ['status' => $status, 'location' => $location, 'body' => $buf];
        }
        $ctx = stream_context_create(['http' => ['timeout' => self::TIMEOUT, 'follow_location' => 0, 'ignore_errors' => true, 'user_agent' => 'ce-telemetry-ranges/1.0'], 'ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
        $fh = @fopen($url, 'rb', false, $ctx);
        if (!$fh) {
            return null;
        }
        $body = stream_get_contents($fh, self::MAX_BYTES + 1);
        $meta = stream_get_meta_data($fh);
        fclose($fh);
        $status = 0;
        $location = null;
        foreach ((array) ($meta['wrapper_data'] ?? []) as $line) {
            if (preg_match('~^HTTP/\S+ (\d{3})~', $line, $m)) {
                $status = (int) $m[1];
            } elseif (stripos($line, 'location:') === 0) {
                $location = trim(substr($line, 9));
            }
        }
        return ['status' => $status, 'location' => $location, 'body' => $body];
    }
}
