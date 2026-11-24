<?php
namespace Ce\Telemetry;

/** Bootstrap común de los scripts de línea de comandos y registro de ejecuciones (telemetry_job_runs). */
class Jobs
{
    /** Solo CLI: nunca se ejecuta por HTTP. Devuelve [Config, rutaPrivada]. */
    public static function boot($privateDir)
    {
        if (PHP_SAPI !== 'cli') {
            http_response_code(404);
            exit(1);
        }
        $config = Config::load($privateDir . '/telemetry-config.php');
        if ($config === null) {
            fwrite(STDERR, "config_unavailable\n");
            exit(2);
        }
        return $config;
    }

    public static function start(\PDO $pdo, $job, $now)
    {
        $st = $pdo->prepare("INSERT INTO telemetry_job_runs (job_name, last_start, status) VALUES (?, ?, 'running') ON DUPLICATE KEY UPDATE last_start = VALUES(last_start), status = 'running'");
        $st->execute([$job, gmdate('Y-m-d H:i:s', $now) . '.000']);
    }

    public static function finish(\PDO $pdo, $job, $now, $ok, array $counters)
    {
        $json = json_encode($counters);
        if ($ok) {
            $st = $pdo->prepare("UPDATE telemetry_job_runs SET last_success = ?, status = 'ok', counters_json = ? WHERE job_name = ?");
        } else {
            $st = $pdo->prepare("UPDATE telemetry_job_runs SET status = 'failed', counters_json = ? WHERE job_name = ?");
            $st->execute([$json, $job]);
            return;
        }
        $st->execute([gmdate('Y-m-d H:i:s', $now) . '.000', $json, $job]);
    }
}
