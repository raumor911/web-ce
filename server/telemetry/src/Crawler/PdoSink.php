<?php
namespace Ce\Telemetry\Crawler;

/** Destino real (MySQL/MariaDB, rol «import»). Fila + checkpoint + fechas sucias en una sola transacción. */
class PdoSink implements RecordSink
{
    private $pdo;
    private $now;

    public function __construct(\PDO $pdo, $now = null)
    {
        $this->pdo = $pdo;
        $this->now = $now !== null ? $now : 'time';
    }

    /** Registra la fuente si no existe. */
    public function ensureSource(array $source)
    {
        $st = $this->pdo->prepare('INSERT INTO import_sources (source_id, source_type, host, layer, coverage_scope, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE host = VALUES(host), layer = VALUES(layer)');
        $st->execute([$source['id'], 'apache_log', (string) $source['host'], $source['layer'], $source['layer'] === 'origin' ? 'origin_only' : 'edge', 'active']);
    }

    private function lockName($sourceId)
    {
        return 'ce_tel_import_' . substr(hash('sha256', $sourceId), 0, 24);
    }

    public function tryLock($sourceId)
    {
        $st = $this->pdo->prepare('SELECT GET_LOCK(?, 0) AS l');
        $st->execute([$this->lockName($sourceId)]);
        $row = $st->fetch();
        return $row && (int) $row['l'] === 1;
    }

    public function unlock($sourceId)
    {
        $st = $this->pdo->prepare('SELECT RELEASE_LOCK(?)');
        $st->execute([$this->lockName($sourceId)]);
    }

    public function loadCursor($sourceId)
    {
        $st = $this->pdo->prepare('SELECT cursor_json FROM import_sources WHERE source_id = ?');
        $st->execute([$sourceId]);
        $row = $st->fetch();
        $c = $row && $row['cursor_json'] ? json_decode($row['cursor_json'], true) : null;
        return is_array($c) ? $c : ['generations' => []];
    }

    public function writeBatch($sourceId, array $rows, array $cursor, array $dates, $lastRequestAt)
    {
        $inserted = 0;
        $dup = 0;
        $nowSql = gmdate('Y-m-d H:i:s', call_user_func($this->now)) . '.000';
        $this->pdo->beginTransaction();
        try {
            $ins = $this->pdo->prepare('INSERT INTO crawler_requests (source_id, source_record_key, requested_at, imported_at, method, path, resource_type, status, bytes, declared_bot, provider, purpose, verification_status, verification_method, range_snapshot_id, rules_version, coverage_layer, ua_family) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = id');
            foreach ($rows as $r) {
                $ins->bindValue(1, $sourceId);
                $ins->bindValue(2, $r['source_record_key'], \PDO::PARAM_LOB);
                $ins->bindValue(3, $r['requested_at']);
                $ins->bindValue(4, $r['imported_at']);
                $ins->bindValue(5, $r['method']);
                $ins->bindValue(6, $r['path']);
                $ins->bindValue(7, $r['resource_type']);
                $ins->bindValue(8, $r['status'], \PDO::PARAM_INT);
                $ins->bindValue(9, $r['bytes'], $r['bytes'] === null ? \PDO::PARAM_NULL : \PDO::PARAM_INT);
                $ins->bindValue(10, $r['declared_bot']);
                $ins->bindValue(11, $r['provider']);
                $ins->bindValue(12, $r['purpose']);
                $ins->bindValue(13, $r['verification_status']);
                $ins->bindValue(14, $r['verification_method']);
                $ins->bindValue(15, $r['range_snapshot_id'], $r['range_snapshot_id'] === null ? \PDO::PARAM_NULL : \PDO::PARAM_INT);
                $ins->bindValue(16, $r['rules_version']);
                $ins->bindValue(17, $r['coverage_layer']);
                $ins->bindValue(18, $r['ua_family']);
                $ins->execute();
                if ($ins->rowCount() === 1) {
                    $inserted++;
                } else {
                    $dup++;
                }
            }
            $dirty = $this->pdo->prepare('INSERT INTO aggregate_dirty (scope, source_id, local_date, marked_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE marked_at = VALUES(marked_at)');
            foreach ($dates as $d) {
                $dirty->execute(['crawler', $sourceId, $d, $nowSql]);
            }
            $upd = $this->pdo->prepare('UPDATE import_sources SET cursor_json = ?, last_success_at = ?, last_request_at = GREATEST(COALESCE(last_request_at, ?), ?), available_from = COALESCE(available_from, ?) WHERE source_id = ?');
            $lr = $lastRequestAt !== null ? gmdate('Y-m-d H:i:s', $lastRequestAt) . '.000' : null;
            $upd->execute([json_encode($cursor), $nowSql, $lr, $lr, $lr, $sourceId]);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }
        return ['inserted' => $inserted, 'duplicate' => $dup];
    }

    /** Registra el resultado de una ejecución en import_runs. */
    public function recordRun($sourceId, $startedAt, array $stats)
    {
        $st = $this->pdo->prepare('INSERT INTO import_runs (source_id, started_at, finished_at, records_read, records_inserted, records_duplicate, records_rejected, records_discarded, gaps, last_error_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $st->execute([$sourceId, gmdate('Y-m-d H:i:s', $startedAt) . '.000', gmdate('Y-m-d H:i:s', call_user_func($this->now)) . '.000',
            $stats['read'], $stats['inserted'], $stats['duplicate'], $stats['rejected'], $stats['discarded'], $stats['gaps'], $stats['error']]);
    }
}
