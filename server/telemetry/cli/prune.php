<?php
// Retención: borra datos vencidos en lotes, con tope de tiempo. Uso: php cli/prune.php
require dirname(__DIR__) . '/bootstrap.php';

use Ce\Telemetry\Db;
use Ce\Telemetry\Jobs;
use Ce\Telemetry\Pruner;

$config = Jobs::boot(dirname(__DIR__));
try {
    $pdo = Db::connect($config, 'import');
} catch (\Throwable $e) {
    fwrite(STDERR, "db_unavailable\n");
    exit(3);
}
Jobs::start($pdo, 'prune', time());
try {
    $out = (new Pruner($pdo))->run((int) $config->get('retention_days', 90), (int) $config->get('aggregate_retention_months', 12), (int) $config->get('jobs_retention_days', 90));
    Jobs::finish($pdo, 'prune', time(), !$out['blocked_by_dirty'], $out);
    echo json_encode($out) . "\n";
} catch (\Throwable $e) {
    Jobs::finish($pdo, 'prune', time(), false, ['error' => 'prune_failed']);
    fwrite(STDERR, "prune_failed\n");
    exit(8);
}
