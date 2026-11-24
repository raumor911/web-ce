<?php
// Aplica migraciones con el rol «migrate». Uso: php cli/migrate.php [--dry-run]
require dirname(__DIR__) . '/bootstrap.php';

use Ce\Telemetry\Db;
use Ce\Telemetry\Jobs;
use Ce\Telemetry\Migrator;

$config = Jobs::boot(dirname(__DIR__));
$dry = in_array('--dry-run', $argv, true);
try {
    $pdo = Db::connect($config, 'migrate');
} catch (\Throwable $e) {
    fwrite(STDERR, "db_unavailable\n");
    exit(3);
}
$report = (new Migrator($pdo, dirname(__DIR__) . '/schema/migrations'))->migrate($dry);
echo json_encode($report) . "\n";
exit($report['error'] === null ? 0 : 4);
