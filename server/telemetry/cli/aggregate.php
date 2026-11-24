<?php
// Recalcula agregados diarios (cada hora). Idempotente. Uso: php cli/aggregate.php
require dirname(__DIR__) . '/bootstrap.php';

use Ce\Telemetry\Aggregator;
use Ce\Telemetry\Db;
use Ce\Telemetry\Jobs;

$config = Jobs::boot(dirname(__DIR__));
try {
    $pdo = Db::connect($config, 'import');
} catch (\Throwable $e) {
    fwrite(STDERR, "db_unavailable\n");
    exit(3);
}
Jobs::start($pdo, 'aggregate', time());
try {
    $out = (new Aggregator($pdo))->run();
    Jobs::finish($pdo, 'aggregate', time(), true, $out);
    echo json_encode($out) . "\n";
} catch (\Throwable $e) {
    Jobs::finish($pdo, 'aggregate', time(), false, ['error' => 'aggregate_failed']);
    fwrite(STDERR, "aggregate_failed\n");
    exit(7);
}
