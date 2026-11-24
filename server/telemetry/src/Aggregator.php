<?php
namespace Ce\Telemetry;

/**
 * Agregados diarios idempotentes por fecha LOCAL (America/Mexico_City). Cada recálculo REEMPLAZA el día completo
 * (borra e inserta en una transacción): repetirlo no duplica ni suma dos veces. Eventos web y solicitudes de bots
 * son conjuntos distintos y no se mezclan.
 */
class Aggregator
{
    const TZ = 'America/Mexico_City';

    private $pdo;
    private $now;

    public function __construct(\PDO $pdo, $now = null)
    {
        $this->pdo = $pdo;
        $this->now = $now !== null ? $now : 'time';
    }

    /** Ventana UTC [inicio, fin) de una fecha local. */
    public static function window($localDate)
    {
        $tz = new \DateTimeZone(self::TZ);
        $start = new \DateTime($localDate . ' 00:00:00', $tz);
        $end = clone $start;
        $end->modify('+1 day');
        $utc = new \DateTimeZone('UTC');
        return [$start->setTimezone($utc)->format('Y-m-d H:i:s') . '.000', $end->setTimezone($utc)->format('Y-m-d H:i:s') . '.000'];
    }

    public static function localDateOf($epoch)
    {
        $d = new \DateTime('@' . (int) $epoch);
        $d->setTimezone(new \DateTimeZone(self::TZ));
        return $d->format('Y-m-d');
    }

    /** Recalcula las métricas web de un día local. @return int filas escritas */
    public function recomputeWeb($localDate)
    {
        list($from, $to) = self::window($localDate);
        $nowSql = gmdate('Y-m-d H:i:s', call_user_func($this->now)) . '.000';
        $rows = [];
        $add = function ($set, $key) use (&$rows) {
            $k = $set . "\0" . $key;
            if (!isset($rows[$k])) {
                $rows[$k] = ['set' => $set, 'key' => (string) $key, 'sessions' => 0, 'page_views' => 0, 'contact_sessions' => 0, 'contacts' => 0, 'active_ms' => 0];
            }
            return $k;
        };

        $q = $this->pdo->prepare("SELECT route_id, COUNT(*) AS n FROM telemetry_events WHERE name = 'page_view' AND effective_at >= ? AND effective_at < ? GROUP BY route_id");
        $q->execute([$from, $to]);
        $total = 0;
        foreach ($q->fetchAll() as $r) {
            $total += (int) $r['n'];
            $rows[$add('route', $r['route_id'] !== null ? $r['route_id'] : 'unknown')]['page_views'] = (int) $r['n'];
        }
        $t = $add('total', 'all');
        $rows[$t]['page_views'] = $total;

        $q = $this->pdo->prepare("SELECT COUNT(DISTINCT session_id) AS s FROM telemetry_events WHERE name = 'page_view' AND effective_at >= ? AND effective_at < ?");
        $q->execute([$from, $to]);
        $rows[$t]['sessions'] = (int) $q->fetch()['s'];

        $q = $this->pdo->prepare("SELECT element_id, COUNT(*) AS n, COUNT(DISTINCT session_id) AS s FROM telemetry_events WHERE name = 'contact_click' AND effective_at >= ? AND effective_at < ? GROUP BY element_id");
        $q->execute([$from, $to]);
        foreach ($q->fetchAll() as $r) {
            $k = $add('element', $r['element_id'] !== null ? $r['element_id'] : 'unknown');
            $rows[$k]['contacts'] = (int) $r['n'];
            $rows[$k]['contact_sessions'] = (int) $r['s'];
            $rows[$t]['contacts'] += (int) $r['n'];
        }
        $q = $this->pdo->prepare("SELECT COUNT(DISTINCT session_id) AS s FROM telemetry_events WHERE name = 'contact_click' AND effective_at >= ? AND effective_at < ?");
        $q->execute([$from, $to]);
        $rows[$t]['contact_sessions'] = (int) $q->fetch()['s'];

        $q = $this->pdo->prepare("SELECT COALESCE(source, 'direct') AS src, COUNT(*) AS s FROM telemetry_sessions WHERE first_received_at >= ? AND first_received_at < ? GROUP BY src");
        $q->execute([$from, $to]);
        foreach ($q->fetchAll() as $r) {
            $rows[$add('source', $r['src'])]['sessions'] = (int) $r['s'];
        }

        $q = $this->pdo->prepare("SELECT properties FROM telemetry_events WHERE name = 'engagement' AND effective_at >= ? AND effective_at < ?");
        $q->execute([$from, $to]);
        while (($r = $q->fetch()) !== false) {
            $p = json_decode($r['properties'], true);
            if (is_array($p) && isset($p['active_ms']) && is_int($p['active_ms'])) {
                $rows[$t]['active_ms'] += $p['active_ms'];
            }
        }

        $this->pdo->beginTransaction();
        try {
            $del = $this->pdo->prepare('DELETE FROM daily_web_metrics WHERE local_date = ?');
            $del->execute([$localDate]);
            $ins = $this->pdo->prepare('INSERT INTO daily_web_metrics (local_date, dimension_set, dimension_key, sessions, page_views, contact_sessions, contacts, active_ms, computed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            foreach ($rows as $r) {
                $ins->execute([$localDate, $r['set'], substr($r['key'], 0, 128), $r['sessions'], $r['page_views'], $r['contact_sessions'], $r['contacts'], $r['active_ms'], $nowSql]);
            }
            $this->pdo->commit();
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }
        return count($rows);
    }

    /** Recalcula las métricas de bots de un día local y una fuente. @return int filas escritas */
    public function recomputeCrawler($localDate, $sourceId)
    {
        list($from, $to) = self::window($localDate);
        $nowSql = gmdate('Y-m-d H:i:s', call_user_func($this->now)) . '.000';
        $q = $this->pdo->prepare("SELECT declared_bot, verification_status, resource_type, COUNT(*) AS n,
            SUM(status BETWEEN 200 AND 299 AND status <> 304) AS s2, SUM(status = 304) AS s304, SUM(status BETWEEN 300 AND 399 AND status <> 304) AS s3,
            SUM(status BETWEEN 400 AND 499) AS s4, SUM(status BETWEEN 500 AND 599) AS s5
            FROM crawler_requests WHERE source_id = ? AND requested_at >= ? AND requested_at < ?
            GROUP BY declared_bot, verification_status, resource_type");
        $q->execute([$sourceId, $from, $to]);
        $rows = $q->fetchAll();
        $this->pdo->beginTransaction();
        try {
            $del = $this->pdo->prepare('DELETE FROM daily_crawler_metrics WHERE local_date = ? AND source_id = ?');
            $del->execute([$localDate, $sourceId]);
            $ins = $this->pdo->prepare('INSERT INTO daily_crawler_metrics (local_date, source_id, bot_family, verification_status, resource_type, requests, responses_2xx, responses_304, responses_3xx, responses_4xx, responses_5xx, computed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            foreach ($rows as $r) {
                $ins->execute([$localDate, $sourceId, $r['declared_bot'] !== null ? $r['declared_bot'] : 'unknown', $r['verification_status'], $r['resource_type'], (int) $r['n'], (int) $r['s2'], (int) $r['s304'], (int) $r['s3'], (int) $r['s4'], (int) $r['s5'], $nowSql]);
            }
            $this->pdo->commit();
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }
        return count($rows);
    }

    /**
     * Ejecución periódica: web de hoy y ayer (locales) + fechas marcadas como sucias por la importación.
     * Una fecha sucia se limpia solo si no se volvió a marcar durante el recálculo.
     * @return array contadores
     */
    public function run()
    {
        $now = call_user_func($this->now);
        $startedSql = gmdate('Y-m-d H:i:s', $now) . '.000';
        $out = ['web_days' => 0, 'crawler_days' => 0];
        foreach ([self::localDateOf($now), self::localDateOf($now - 86400)] as $d) {
            $this->recomputeWeb($d);
            $this->confirm('web', 'all', $d, $startedSql);
            $out['web_days']++;
        }
        $st = $this->pdo->query("SELECT scope, source_id, local_date FROM aggregate_dirty WHERE scope = 'crawler' ORDER BY local_date");
        foreach ($st->fetchAll() as $r) {
            $this->recomputeCrawler($r['local_date'], $r['source_id']);
            $this->confirm('crawler', $r['source_id'], $r['local_date'], $startedSql);
            $del = $this->pdo->prepare("DELETE FROM aggregate_dirty WHERE scope = 'crawler' AND source_id = ? AND local_date = ? AND marked_at <= ?");
            $del->execute([$r['source_id'], $r['local_date'], $startedSql]);
            $out['crawler_days']++;
        }
        return $out;
    }

    private function confirm($scope, $sourceId, $date, $at)
    {
        $st = $this->pdo->prepare('INSERT INTO aggregate_watermarks (scope, source_id, local_date, confirmed_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE confirmed_at = VALUES(confirmed_at)');
        $st->execute([$scope, $sourceId, $date, $at]);
    }
}
