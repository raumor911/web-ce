<?php
use Ce\Telemetry\Crawler\LogImporter;
use Ce\Telemetry\Crawler\RecordSink;
use Ce\Telemetry\Crawler\Verifier;

/** Destino en memoria: misma semántica de deduplicación por (source_id, source_record_key) y checkpoint atómico. */
class MemSink implements RecordSink
{
    public $rows = [];
    public $cursor = ['generations' => []];
    public $dirty = [];
    public $locked = false;
    public $failNextWrite = false;

    public function tryLock($sourceId)
    {
        if ($this->locked) {
            return false;
        }
        return $this->locked = true;
    }

    public function unlock($sourceId)
    {
        $this->locked = false;
    }

    public function loadCursor($sourceId)
    {
        return json_decode(json_encode($this->cursor), true);
    }

    public function writeBatch($sourceId, array $rows, array $cursor, array $dates, $lastRequestAt)
    {
        if ($this->failNextWrite) {
            $this->failNextWrite = false;
            throw new \RuntimeException('fallo simulado'); // ni filas ni checkpoint entran
        }
        $ins = 0;
        $dup = 0;
        foreach ($rows as $r) {
            $k = bin2hex($r['source_record_key']);
            if (isset($this->rows[$k])) {
                $dup++;
            } else {
                $this->rows[$k] = $r;
                $ins++;
            }
        }
        foreach ($dates as $d) {
            $this->dirty[$d] = true;
        }
        $this->cursor = $cursor;
        return ['inserted' => $ins, 'duplicate' => $dup];
    }
}

function ce_line($ts, $path, $ua, $ip = '203.0.113.9', $status = 200)
{
    return sprintf("%s - - [%s] \"GET %s HTTP/1.1\" %d 100 \"-\" \"%s\"\n", $ip, $ts, $path, $status, $ua);
}

function ce_tmp()
{
    $d = sys_get_temp_dir() . '/ce-tel-test-' . bin2hex(random_bytes(4));
    mkdir($d);
    return $d;
}

function ce_importer($sink)
{
    $v = new Verifier(['openai_gptbot' => ['snapshot_id' => 1, 'ranges' => ['203.0.113.0/24'], 'valid_until' => 4102444800]]);
    return new LogImporter($sink, $v, function () { return 1800000000; });
}

$GPT = 'Mozilla/5.0 (compatible; GPTBot/1.3; +https://openai.com/gptbot)';
$SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15';
$src = ['id' => 'apache-origin', 'layer' => 'origin'];

T::test('importador: guarda solo bots, cuenta descartadas y rechazadas, no guarda IP ni UA', function () use ($GPT, $SAFARI, $src) {
    $dir = ce_tmp();
    file_put_contents($dir . '/access.log',
        ce_line('24/Nov/2026:10:00:00 -0600', '/robots.txt', $GPT) .
        ce_line('24/Nov/2026:10:00:01 -0600', '/', $SAFARI) .
        "basura sin formato\n" .
        ce_line('24/Nov/2026:10:00:02 -0600', '/telemetria/collect.php', $GPT));
    $sink = new MemSink();
    $s = ce_importer($sink)->run($src, [$dir . '/access.log']);
    T::eq(4, $s['read']);
    T::eq(1, $s['inserted']);
    T::eq(1, $s['rejected']);
    T::eq(2, $s['discarded']);
    $row = array_values($sink->rows)[0];
    T::eq('verified', $row['verification_status']);
    T::eq('training_crawl', $row['purpose']);
    T::eq('robots', $row['resource_type']);
    T::ok(strpos(json_encode(array_map('base64_encode', array_filter($row, 'is_string'))), '203.0.113.9') === false);
    T::ok(!array_key_exists('ip', $row) && !array_key_exists('user_agent', $row), 'sin IP ni UA crudo');
    T::eq(['2026-11-24' => true], $sink->dirty);
});

T::test('importador: reejecutar no duplica y reanuda por offset', function () use ($GPT, $src) {
    $dir = ce_tmp();
    $f = $dir . '/access.log';
    file_put_contents($f, ce_line('24/Nov/2026:10:00:00 -0600', '/robots.txt', $GPT) . ce_line('24/Nov/2026:10:00:01 -0600', '/llms.txt', $GPT));
    $sink = new MemSink();
    $imp = ce_importer($sink);
    T::eq(2, $imp->run($src, [$f])['inserted']);
    $again = $imp->run($src, [$f]);
    T::eq(0, $again['read'], 'nada nuevo que leer');
    file_put_contents($f, ce_line('24/Nov/2026:10:05:00 -0600', '/sitemap.xml', $GPT), FILE_APPEND);
    $third = $imp->run($src, [$f]);
    T::eq(1, $third['inserted']);
    T::eq(3, count($sink->rows));
});

T::test('importador: línea incompleta al final no se consume hasta completarse', function () use ($GPT, $src) {
    $dir = ce_tmp();
    $f = $dir . '/access.log';
    $full = ce_line('24/Nov/2026:10:00:00 -0600', '/robots.txt', $GPT);
    $partial = ce_line('24/Nov/2026:10:00:01 -0600', '/llms.txt', $GPT);
    file_put_contents($f, $full . rtrim($partial, "\n"));
    $sink = new MemSink();
    $imp = ce_importer($sink);
    T::eq(1, $imp->run($src, [$f])['inserted']);
    file_put_contents($f, "\n", FILE_APPEND);
    T::eq(1, $imp->run($src, [$f])['inserted']);
    T::eq(2, count($sink->rows));
});

T::test('importador: rotación (renombrar y comprimir) no duplica ni pierde', function () use ($GPT, $src) {
    $dir = ce_tmp();
    $f = $dir . '/access.log';
    file_put_contents($f, ce_line('24/Nov/2026:10:00:00 -0600', '/robots.txt', $GPT) . ce_line('24/Nov/2026:10:00:01 -0600', '/llms.txt', $GPT));
    $sink = new MemSink();
    $imp = ce_importer($sink);
    $imp->run($src, [$f]);
    // Rotación: el archivo pasa a access.log.1 y se agregan líneas; aparece un access.log nuevo.
    rename($f, $dir . '/access.log.1');
    file_put_contents($dir . '/access.log.1', ce_line('24/Nov/2026:10:09:00 -0600', '/sitemap.xml', $GPT), FILE_APPEND);
    file_put_contents($f, ce_line('24/Nov/2026:10:10:00 -0600', '/ai/home.md', $GPT));
    $s = $imp->run($src, [$dir . '/access.log.1', $f]);
    T::eq(2, $s['inserted'], 'solo lo nuevo de ambas generaciones');
    T::eq(4, count($sink->rows));
    // El mismo archivo comprimido (gz) es la misma generación: nada nuevo.
    if (function_exists('gzopen')) {
        $gz = gzopen($dir . '/access.log.2.gz', 'wb');
        gzwrite($gz, file_get_contents($dir . '/access.log.1'));
        gzclose($gz);
        unlink($dir . '/access.log.1');
        T::eq(0, $imp->run($src, [$dir . '/access.log.2.gz', $f])['inserted']);
        T::eq(4, count($sink->rows));
    }
});

T::test('importador: un fallo de escritura no avanza el checkpoint y el reintento completa', function () use ($GPT, $src) {
    $dir = ce_tmp();
    $f = $dir . '/access.log';
    file_put_contents($f, ce_line('24/Nov/2026:10:00:00 -0600', '/robots.txt', $GPT));
    $sink = new MemSink();
    $sink->failNextWrite = true;
    $imp = ce_importer($sink);
    $s = $imp->run($src, [$f]);
    T::eq('import_failed', $s['error']);
    T::eq(0, count($sink->rows));
    T::eq(['generations' => []], $sink->cursor);
    T::eq(false, $sink->locked, 'el bloqueo se libera');
    T::eq(1, $imp->run($src, [$f])['inserted']);
});

T::test('importador: bloqueo de exclusión evita ejecuciones simultáneas', function () use ($src) {
    $sink = new MemSink();
    $sink->locked = true;
    T::eq(true, ce_importer($sink)->run($src, [])['locked']);
});

T::test('importador: archivo truncado se reporta como hueco y no duplica', function () use ($GPT, $src) {
    $dir = ce_tmp();
    $f = $dir . '/access.log';
    $l1 = ce_line('24/Nov/2026:10:00:00 -0600', '/robots.txt', $GPT);
    file_put_contents($f, $l1 . ce_line('24/Nov/2026:10:00:01 -0600', '/llms.txt', $GPT));
    $sink = new MemSink();
    $imp = ce_importer($sink);
    $imp->run($src, [$f]);
    file_put_contents($f, $l1); // misma primera línea, contenido menor al checkpoint
    $s = $imp->run($src, [$f]);
    T::eq(1, $s['gaps']);
    T::eq(1, $s['duplicate']);
    T::eq(2, count($sink->rows));
});

T::test('importador: listFiles solo acepta archivos dentro de la raíz', function () {
    $dir = ce_tmp();
    file_put_contents($dir . '/access.log', 'x');
    T::eq([realpath($dir . '/access.log')], LogImporter::listFiles($dir, 'access.log*'));
    T::eq([], LogImporter::listFiles($dir, '../*'));
    T::eq([], LogImporter::listFiles($dir . '/no-existe', '*'));
});
