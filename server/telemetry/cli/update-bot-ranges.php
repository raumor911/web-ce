<?php
// Descarga los feeds oficiales de rangos IP (cada 24 h). Uso: php cli/update-bot-ranges.php
require dirname(__DIR__) . '/bootstrap.php';

use Ce\Telemetry\Crawler\FeedUpdater;
use Ce\Telemetry\Db;
use Ce\Telemetry\Jobs;

$config = Jobs::boot(dirname(__DIR__));
try {
    $pdo = Db::connect($config, 'import');
} catch (\Throwable $e) {
    fwrite(STDERR, "db_unavailable\n");
    exit(3);
}
Jobs::start($pdo, 'update-bot-ranges', time());
$report = (new FeedUpdater($pdo))->run(time());
// Fallar algunos feeds no es fatal: se conserva el último snapshot válido y la verificación vence a las 72 h.
$counts = ['updated' => count($report['updated']), 'unchanged' => count($report['unchanged']), 'failed' => count($report['failed']), 'failed_feeds' => $report['failed']];
Jobs::finish($pdo, 'update-bot-ranges', time(), $counts['failed'] === 0, $counts);
echo json_encode($counts) . "\n";
exit($counts['failed'] === 0 ? 0 : 6);
