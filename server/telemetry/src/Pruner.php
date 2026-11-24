<?php
namespace Ce\Telemetry;

/**
 * Retención segura: borra en lotes pequeños, con tope de tiempo, y NO purga datos crudos de fechas con agregados
 * pendientes (aggregate_dirty). Solo toca tablas de telemetría (nunca WordPress ni otras bases).
 */
class Pruner
{
    private $pdo;
    private $now;

    public function __construct(\PDO $pdo, $now = null)
    {
        $this->pdo = $pdo;
        $this->now = $now !== null ? $now : 'time';
    }

    private function chunked($sql, array $params, $deadline)
    {
        $total = 0;
        while (time() < $deadline) {
            $st = $this->pdo->prepare($sql . ' LIMIT 5000');
            $st->execute($params);
            $n = $st->rowCount();
            $total += $n;
            if ($n < 5000) {
                break;
            }
        }
        return $total;
    }

    /**
     * @param int $retentionDays eventos y solicitudes de bots
     * @param int $aggregateMonths agregados
     * @param int $jobsDays registros de trabajos e importaciones
     * @param int $maxSeconds tope de tiempo
     * @return array conteos y banderas
     */
    public function run($retentionDays, $aggregateMonths, $jobsDays, $maxSeconds = 25)
    {
        $now = call_user_func($this->now);
        $deadline = time() + (int) $maxSeconds;
        $cut = gmdate('Y-m-d H:i:s', $now - $retentionDays * 86400) . '.000';
        $cutDate = Aggregator::localDateOf($now - $retentionDays * 86400);
        $out = ['events' => 0, 'sessions' => 0, 'crawler_requests' => 0, 'rate_buckets' => 0, 'aggregates' => 0, 'job_runs' => 0, 'blocked_by_dirty' => false];

        $dirty = $this->pdo->prepare('SELECT COUNT(*) AS n FROM aggregate_dirty WHERE local_date <= ?');
        $dirty->execute([$cutDate]);
        if ((int) $dirty->fetch()['n'] > 0) {
            $out['blocked_by_dirty'] = true; // hay días por agregar dentro del rango a purgar: no se borran datos crudos
        } else {
            $out['events'] = $this->chunked('DELETE FROM telemetry_events WHERE received_at < ?', [$cut], $deadline);
            $out['sessions'] = $this->chunked('DELETE FROM telemetry_sessions WHERE last_received_at < ? AND NOT EXISTS (SELECT 1 FROM telemetry_events e WHERE e.session_id = telemetry_sessions.session_id)', [$cut], $deadline);
            $out['crawler_requests'] = $this->chunked('DELETE FROM crawler_requests WHERE requested_at < ?', [$cut], $deadline);
        }
        $out['rate_buckets'] = $this->chunked('DELETE FROM telemetry_rate_buckets WHERE expires_at < UTC_TIMESTAMP()', [], $deadline);
        $aggCut = Aggregator::localDateOf($now - (int) ($aggregateMonths * 30.5 * 86400));
        foreach (['daily_web_metrics', 'daily_crawler_metrics'] as $t) {
            $out['aggregates'] += $this->chunked('DELETE FROM ' . $t . ' WHERE local_date < ?', [$aggCut], $deadline);
        }
        $this->chunked('DELETE FROM aggregate_watermarks WHERE local_date < ?', [$aggCut], $deadline);
        $out['job_runs'] = $this->chunked('DELETE FROM import_runs WHERE started_at < ?', [gmdate('Y-m-d H:i:s', $now - $jobsDays * 86400) . '.000'], $deadline);
        return $out;
    }
}
