<?php
namespace Ce\Telemetry\Crawler;

/**
 * Importador de logs de Apache (formato combined) a solicitudes de bots.
 *
 * - Generación de archivo = hash de la PRIMERA línea completa: sobrevive a la rotación (access.log -> access.log.1 -> .gz).
 * - Offset lógico (bytes sin comprimir) al inicio de cada línea; solo se avanza sobre líneas completas.
 * - source_record_key = sha256(source_id \0 generación \0 offset): reintentos y solapes no duplican.
 * - Filas y checkpoint se escriben en la MISMA transacción (RecordSink::writeBatch).
 * - Solo se guardan solicitudes de bots declarados; la IP y el UA viven en memoria y no se persisten.
 * - Lo no importado se cuenta (rechazadas/descartadas) y las discontinuidades se reportan como huecos.
 */
class LogImporter
{
    const BATCH = 500;

    private $sink;
    private $verifier;
    private $now;

    /** @param callable $now fn(): epoch */
    public function __construct(RecordSink $sink, Verifier $verifier, $now = null)
    {
        $this->sink = $sink;
        $this->verifier = $verifier;
        $this->now = $now !== null ? $now : 'time';
    }

    /** Archivos de la fuente, más antiguos primero, siempre dentro de $root (realpath). */
    public static function listFiles($root, $pattern)
    {
        $rootReal = realpath($root);
        if ($rootReal === false || strpos($pattern, '/') !== false || strpos($pattern, '..') !== false) {
            return [];
        }
        $files = [];
        foreach ((array) glob($rootReal . '/' . $pattern) as $f) {
            $real = realpath($f);
            if ($real !== false && is_file($real) && strpos($real, $rootReal . '/') === 0) {
                $files[] = $real;
            }
        }
        usort($files, function ($a, $b) {
            $d = filemtime($a) - filemtime($b);
            return $d !== 0 ? $d : strcmp($a, $b);
        });
        return $files;
    }

    /**
     * @param array $source  ['id','layer','ip_reliable'(opcional)]
     * @param array $files   rutas absolutas ya validadas
     * @param int   $maxLines tope por ejecución (0 = sin tope)
     * @return array contadores + 'locked' => bool
     */
    public function run(array $source, array $files, $maxLines = 0)
    {
        $stats = ['read' => 0, 'inserted' => 0, 'duplicate' => 0, 'rejected' => 0, 'discarded' => 0, 'gaps' => 0, 'locked' => false, 'error' => null];
        $sid = $source['id'];
        if (!$this->sink->tryLock($sid)) {
            $stats['locked'] = true;
            return $stats;
        }
        try {
            $cursor = $this->sink->loadCursor($sid);
            if (!isset($cursor['generations']) || !is_array($cursor['generations'])) {
                $cursor['generations'] = [];
            }
            $ipReliable = array_key_exists('ip_reliable', $source) ? (bool) $source['ip_reliable'] : ($source['layer'] === 'origin');
            foreach ($files as $file) {
                if ($maxLines > 0 && $stats['read'] >= $maxLines) {
                    break;
                }
                $this->importFile($sid, $source['layer'], $ipReliable, $file, $cursor, $stats, $maxLines);
            }
        } catch (\Throwable $e) {
            $stats['error'] = 'import_failed'; // sin mensaje: puede contener rutas o datos
        }
        $this->sink->unlock($sid);
        return $stats;
    }

    private function importFile($sid, $layer, $ipReliable, $file, array &$cursor, array &$stats, $maxLines)
    {
        $gz = substr($file, -3) === '.gz';
        $h = $gz ? @gzopen($file, 'rb') : @fopen($file, 'rb');
        if (!$h) {
            $stats['gaps']++;
            return;
        }
        $first = $gz ? gzgets($h, 8192) : fgets($h, 8192);
        if ($first === false || substr($first, -1) !== "\n") {
            $gz ? gzclose($h) : fclose($h); // aún sin una línea completa: no hay generación estable
            return;
        }
        $gid = substr(hash('sha256', $first), 0, 16);
        $state = isset($cursor['generations'][$gid]) ? $cursor['generations'][$gid] : ['offset' => 0, 'done' => false];
        $offset = (int) $state['offset'];
        if (!$gz) {
            $size = filesize($file);
            if ($size !== false && $size < $offset) { // truncado o reemplazado: se reimporta desde cero y se reporta
                $stats['gaps']++;
                $offset = 0;
            }
        }
        if ($offset > 0) {
            $gz ? gzseek($h, $offset) : fseek($h, $offset);
        } else {
            $gz ? gzrewind($h) : rewind($h);
        }
        $rows = [];
        $dates = [];
        $lastAt = null;
        $pos = $offset;
        $batchStats = ['rejected' => 0, 'discarded' => 0, 'read' => 0];
        $flush = function () use (&$rows, &$dates, &$lastAt, &$pos, &$batchStats, &$cursor, &$stats, $sid, $gid) {
            $cursor['generations'][$gid] = ['offset' => $pos, 'done' => false];
            $cursor['generations'] = array_slice($cursor['generations'], -20, null, true);
            $res = $this->sink->writeBatch($sid, $rows, $cursor, array_keys($dates), $lastAt);
            $stats['inserted'] += $res['inserted'];
            $stats['duplicate'] += $res['duplicate'];
            $stats['rejected'] += $batchStats['rejected'];
            $stats['discarded'] += $batchStats['discarded'];
            $stats['read'] += $batchStats['read'];
            $rows = [];
            $dates = [];
            $batchStats = ['rejected' => 0, 'discarded' => 0, 'read' => 0];
        };
        $snapshotAt = call_user_func($this->now);
        while (true) {
            if ($maxLines > 0 && ($stats['read'] + $batchStats['read']) >= $maxLines) {
                break;
            }
            $lineStart = $pos;
            $line = $gz ? gzgets($h, 8193) : fgets($h, 8193);
            if ($line === false) {
                break;
            }
            if (substr($line, -1) !== "\n") {
                break; // línea incompleta (se está escribiendo): se retoma en la siguiente ejecución
            }
            $pos += strlen($line);
            $batchStats['read']++;
            $rec = LogParser::parseLine(rtrim($line, "\r\n"));
            if ($rec === null) {
                $batchStats['rejected']++;
            } elseif (BotCatalog::isExcludedPath($rec['path'])) {
                $batchStats['discarded']++;
            } else {
                $class = BotCatalog::classify($rec['ua']);
                if ($class === null) {
                    $batchStats['discarded']++; // tráfico que no se declara bot: no se guarda
                } else {
                    $v = $this->verifier->verify($class, $rec['ip'], $ipReliable, $rec['at']);
                    $rows[] = [
                        'source_record_key' => hash('sha256', $sid . "\0" . $gid . "\0" . $lineStart, true),
                        'requested_at' => gmdate('Y-m-d H:i:s', $rec['at']) . '.000',
                        'imported_at' => gmdate('Y-m-d H:i:s', $snapshotAt) . '.000',
                        'method' => substr($rec['method'], 0, 8),
                        'path' => $rec['path'],
                        'resource_type' => BotCatalog::resourceType($rec['path']),
                        'status' => $rec['status'],
                        'bytes' => $rec['bytes'],
                        'declared_bot' => $class['declared_bot'],
                        'provider' => $class['provider'],
                        'purpose' => $class['purpose'],
                        'verification_status' => $v['status'],
                        'verification_method' => $v['method'],
                        'range_snapshot_id' => $v['snapshot_id'],
                        'rules_version' => BotCatalog::RULES_VERSION,
                        'coverage_layer' => $layer,
                        'ua_family' => $class['ua_family'],
                    ];
                    $dates[LogParser::localDate($rec['at'])] = true;
                    $lastAt = $lastAt === null || $rec['at'] > $lastAt ? $rec['at'] : $lastAt;
                }
            }
            if ($batchStats['read'] >= self::BATCH) {
                $flush();
            }
        }
        if ($batchStats['read'] > 0) {
            $flush();
        }
        $gz ? gzclose($h) : fclose($h);
    }
}
