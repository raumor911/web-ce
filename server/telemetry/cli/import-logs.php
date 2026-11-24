<?php
// Importa logs de Apache de las fuentes configuradas (cada hora). Uso: php cli/import-logs.php [--max-lines=N]
require dirname(__DIR__) . '/bootstrap.php';

use Ce\Telemetry\Crawler\FeedUpdater;
use Ce\Telemetry\Crawler\LogImporter;
use Ce\Telemetry\Crawler\PdoSink;
use Ce\Telemetry\Crawler\Verifier;
use Ce\Telemetry\Db;
use Ce\Telemetry\Jobs;

$config = Jobs::boot(dirname(__DIR__));
$max = 0;
foreach ($argv as $a) {
    if (preg_match('~^--max-lines=(\d+)$~', $a, $m)) {
        $max = (int) $m[1];
    }
}
$sources = $config->get('log_sources', []);
$root = $config->get('log_root', '');
if (!$sources || !is_string($root) || !is_dir($root)) {
    fwrite(STDERR, "no_log_sources\n"); // log_root o log_sources sin configurar: nada que importar (unknown, no se inventa)
    exit(0);
}
try {
    $pdo = Db::connect($config, 'import');
} catch (\Throwable $e) {
    fwrite(STDERR, "db_unavailable\n");
    exit(3);
}
$now = time();
Jobs::start($pdo, 'import-logs', $now);
$verifier = new Verifier(FeedUpdater::loadValid($pdo, $now));
$sink = new PdoSink($pdo);
$importer = new LogImporter($sink, $verifier);
$all = ['read' => 0, 'inserted' => 0, 'duplicate' => 0, 'rejected' => 0, 'discarded' => 0, 'gaps' => 0, 'errors' => 0, 'locked' => 0];
foreach ($sources as $src) {
    if (!is_array($src) || empty($src['id']) || empty($src['pattern']) || !in_array($src['layer'] ?? '', ['origin', 'edge'], true)) {
        $all['errors']++;
        continue;
    }
    $sink->ensureSource($src);
    $started = time();
    $stats = $importer->run($src, LogImporter::listFiles($root, $src['pattern']), $max);
    $sink->recordRun($src['id'], $started, $stats);
    foreach (['read', 'inserted', 'duplicate', 'rejected', 'discarded', 'gaps'] as $k) {
        $all[$k] += $stats[$k];
    }
    $all['errors'] += $stats['error'] !== null ? 1 : 0;
    $all['locked'] += $stats['locked'] ? 1 : 0;
}
Jobs::finish($pdo, 'import-logs', time(), $all['errors'] === 0, $all);
echo json_encode($all) . "\n";
exit($all['errors'] === 0 ? 0 : 5);
