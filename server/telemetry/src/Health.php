<?php
namespace Ce\Telemetry;

/** Salud operativa para el tablero: estado de trabajos, frescura de datos, espacio y vigencia de rangos. Solo lectura. */
class Health
{
    private $pdo;
    private $config;
    private $now;

    public function __construct(\PDO $pdo, Config $config, $now = null)
    {
        $this->pdo = $pdo;
        $this->config = $config;
        $this->now = $now !== null ? $now : 'time';
    }

    /** @return array lista de comprobaciones: ['name','status' => ok|warn|fail|unknown,'detail'] */
    public function checks()
    {
        $now = call_user_func($this->now);
        $out = [];
        $out[] = ['name' => 'captura_servidor', 'status' => $this->config->enabled() ? 'ok' : 'warn', 'detail' => $this->config->enabled() ? 'activada' : 'apagada (enabled=false)'];
        foreach ($this->config->problems() as $p) {
            $out[] = ['name' => 'configuracion', 'status' => 'warn', 'detail' => $p];
        }
        $jobs = [];
        foreach ($this->pdo->query('SELECT job_name, last_success, status FROM telemetry_job_runs')->fetchAll() as $r) {
            $jobs[$r['job_name']] = $r;
        }
        foreach (['import-logs' => 7200, 'update-bot-ranges' => 129600, 'aggregate' => 7200, 'prune' => 172800] as $name => $maxAge) {
            if (!isset($jobs[$name]) || $jobs[$name]['last_success'] === null) {
                $out[] = ['name' => 'job:' . $name, 'status' => 'unknown', 'detail' => 'sin ejecución registrada'];
                continue;
            }
            $age = $now - strtotime($jobs[$name]['last_success'] . ' UTC');
            $out[] = ['name' => 'job:' . $name, 'status' => $age <= $maxAge && $jobs[$name]['status'] !== 'failed' ? 'ok' : 'warn', 'detail' => 'último éxito hace ' . (int) ($age / 60) . ' min; estado ' . $jobs[$name]['status']];
        }
        $row = $this->pdo->query('SELECT MAX(received_at) AS m FROM telemetry_events')->fetch();
        $out[] = ['name' => 'ultimo_evento', 'status' => $row['m'] ? 'ok' : 'unknown', 'detail' => $row['m'] ? 'recibido ' . $row['m'] . ' UTC' : 'sin eventos'];

        $snap = $this->pdo->query('SELECT bot_family, MAX(valid_until) AS v FROM bot_range_snapshots GROUP BY bot_family')->fetchAll();
        $expired = 0;
        foreach ($snap as $s) {
            if (strtotime($s['v'] . ' UTC') < $now) {
                $expired++;
            }
        }
        $out[] = ['name' => 'rangos_oficiales', 'status' => !$snap ? 'unknown' : ($expired ? 'warn' : 'ok'), 'detail' => !$snap ? 'sin snapshots: la verificación queda «no disponible»' : (count($snap) . ' familias; ' . $expired . ' vencidas')];

        $sz = $this->pdo->query("SELECT COALESCE(SUM(data_length + index_length), 0) AS b FROM information_schema.tables WHERE table_schema = DATABASE() AND (table_name LIKE 'telemetry\\_%' OR table_name LIKE 'daily\\_%' OR table_name IN ('crawler_requests','import_runs','import_sources','bot_range_snapshots','aggregate_dirty','aggregate_watermarks'))")->fetch();
        $mb = (int) round($sz['b'] / 1048576);
        $alert = (int) $this->config->get('disk_alert_mb', 0);
        $out[] = ['name' => 'espacio', 'status' => $alert > 0 && $mb >= $alert ? 'warn' : 'ok', 'detail' => $mb . ' MiB en tablas de telemetría' . ($alert > 0 ? ' (alerta en ' . $alert . ')' : ' (sin umbral)')];
        return $out;
    }
}
