<?php
namespace Ce\Telemetry;

/**
 * Persistencia atómica de un lote ya validado. Un fallo que no sea un duplicado de event_id revierte el lote completo.
 * No usa INSERT IGNORE: solo se toleran duplicados de la clave uk_event_id.
 */
class Ingest
{
    private $pdo;
    private $contract;
    private $aiHosts;

    public function __construct(\PDO $pdo, Contract $contract, array $aiHosts)
    {
        $this->pdo = $pdo;
        $this->contract = $contract;
        $this->aiHosts = array_map('strtolower', $aiHosts);
    }

    /** Fecha SQL (UTC, milisegundos) de un instante en segundos con fracción. */
    public static function sqlNow($microtime)
    {
        $sec = (int) floor($microtime);
        $ms = (int) floor(($microtime - $sec) * 1000);
        return gmdate('Y-m-d H:i:s', $sec) . '.' . str_pad((string) $ms, 3, '0', STR_PAD_LEFT);
    }

    /** Atribución v1: UTM válida > referrer externo > direct_or_unknown. Devuelve [source, medium, campaign, referrer, basis, ai]. */
    public function attribution(array $props)
    {
        $referrer = isset($props['landing_source']) ? $props['landing_source'] : null;
        $utmSource = isset($props['utm_source']) ? $props['utm_source'] : null;
        $ai = ($utmSource !== null && in_array($utmSource, $this->aiHosts, true)) || ($referrer !== null && in_array($referrer, $this->aiHosts, true));
        if ($utmSource !== null) {
            return [$utmSource, isset($props['utm_medium']) ? $props['utm_medium'] : null, isset($props['utm_campaign']) ? $props['utm_campaign'] : null, $referrer, 'utm', $ai ? 1 : 0];
        }
        if ($referrer !== null) {
            return [$referrer, 'referral', null, $referrer, 'referrer', $ai ? 1 : 0];
        }
        return [null, null, null, null, 'none', 0];
    }

    /**
     * @param array  $events      eventos normalizados por Contract::validateBatch
     * @param string $environment entorno derivado del Origin permitido
     * @param float  $nowMicro    microtime(true) de la recepción
     * @return array ['accepted' => int, 'duplicates' => int]
     */
    public function persist(array $events, $environment, $nowMicro)
    {
        $received = self::sqlNow($nowMicro);
        $receivedMs = (int) round($nowMicro * 1000);
        $window = (int) $this->contract->limit('clock_window_ms');
        $accepted = 0;
        $duplicates = 0;
        $this->pdo->beginTransaction();
        try {
            $sessions = [];
            foreach ($events as $ev) {
                $sessions[$ev['session_id']] = true;
            }
            $upsert = $this->pdo->prepare('INSERT INTO telemetry_sessions (session_id, first_received_at, last_received_at, environment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE last_received_at = GREATEST(last_received_at, VALUES(last_received_at)), first_received_at = LEAST(first_received_at, VALUES(first_received_at))');
            foreach (array_keys($sessions) as $sid) {
                $upsert->execute([$sid, $received, $received, $environment]);
            }
            $attr = $this->pdo->prepare('UPDATE telemetry_sessions SET landing_path = ?, source = ?, medium = ?, campaign = ?, referrer_host = ?, attribution_basis = ?, ai_referred_observed = ?, device_class = ? WHERE session_id = ? AND landing_path IS NULL');
            $ins = $this->pdo->prepare('INSERT INTO telemetry_events (event_id, session_id, page_view_id, seq, name, occurred_at, received_at, effective_at, clock_status, page_path, route_id, element_id, product_id, release_id, properties) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            foreach ($events as $ev) {
                $ts = $this->contract->parseTimestamp($ev['occurred_at']);
                $skewOk = $ts !== null && abs($ts['ms'] - $receivedMs) <= $window;
                $occurred = $skewOk ? $ts['sql'] : null;
                $effective = $skewOk ? $ts['sql'] : $received;
                $props = $ev['properties'];
                try {
                    $ins->execute([
                        $ev['event_id'], $ev['session_id'], $ev['page_view_id'], $ev['sequence'], $ev['name'],
                        $occurred, $received, $effective, $skewOk ? 'ok' : 'skewed',
                        $ev['page_path'], $ev['route_id'],
                        isset($props['element_id']) ? $props['element_id'] : null,
                        isset($props['product_id']) ? $props['product_id'] : null,
                        $ev['release_id'], json_encode($props, JSON_UNESCAPED_SLASHES),
                    ]);
                    $accepted++;
                } catch (\PDOException $e) {
                    if (!Db::isDuplicateOn($e, 'uk_event_id')) {
                        throw $e;
                    }
                    $duplicates++;
                    continue;
                }
                if ($ev['name'] === 'page_view' && isset($props['device_class'])) {
                    $a = $this->attribution($props);
                    $attr->execute([$ev['page_path'], $a[0], $a[1], $a[2], $a[3], $a[4], $a[5], $props['device_class'], $ev['session_id']]);
                }
            }
            $this->pdo->commit();
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }
        return ['accepted' => $accepted, 'duplicates' => $duplicates];
    }
}
