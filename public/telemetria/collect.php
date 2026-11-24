<?php
/**
 * Bootstrap público mínimo de la ingesta de telemetría de Creativos Espacios.
 *
 * Solo localiza la carpeta PRIVADA y delega. No contiene lógica de negocio, credenciales ni rutas absolutas.
 * La configuración real (telemetry-config.php) y el código viven fuera del document root y fuera de Git.
 *
 * Resolución: primero la ruta esperada dirname(DOCUMENT_ROOT)/telemetry; si no, desde esta carpeta sube como máximo 5 niveles buscando un hermano `telemetry/` que contenga
 * `telemetry-config.php`; usa el primero que exista, sea legible y NO esté dentro del document root (comparando
 * realpath con DOCUMENT_ROOT). Si no lo encuentra: 503 genérico, sin rutas, captura apagada.
 */

// Nombre de la carpeta privada. Un solo lugar; cambiar aquí si el hosting usa otro nombre (ASCII recomendado).
const CE_TELEMETRY_PRIVATE_DIR = 'telemetry';

function ce_telemetry_unavailable()
{
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo '{"error":"unavailable"}';
    exit;
}

function ce_telemetry_candidate($dir, $dirName, $root)
{
    $config = $dir . '/' . $dirName . '/telemetry-config.php';
    if (!is_file($config) || !is_readable($config)) {
        return null;
    }
    $real = realpath($config);
    if ($real === false || strpos($real . '/', rtrim($root, '/') . '/') === 0) {
        return null; // dentro del document root: se descarta
    }
    return dirname($real);
}

function ce_telemetry_locate($startDir, $dirName, $documentRoot)
{
    $root = ($documentRoot !== '' && $documentRoot !== null) ? realpath($documentRoot) : false;
    if ($root === false) {
        return null; // sin document root verificable no se puede comprobar que la carpeta esté fuera
    }
    // 1) Ruta esperada: hermana del document root (public_html/../telemetry).
    $found = ce_telemetry_candidate(dirname($root), $dirName, $root);
    if ($found !== null) {
        return $found;
    }
    // 2) Búsqueda ascendente acotada desde esta carpeta (por si el document root es una subcarpeta).
    $dir = $startDir;
    for ($i = 0; $i < 5; $i++) {
        $parent = dirname($dir);
        if ($parent === $dir) {
            break;
        }
        $dir = $parent;
        $found = ce_telemetry_candidate($dir, $dirName, $root);
        if ($found !== null) {
            return $found;
        }
    }
    return null;
}

$ceRoot = ce_telemetry_locate(__DIR__, CE_TELEMETRY_PRIVATE_DIR, isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : '');
if ($ceRoot === null || !is_file($ceRoot . '/bootstrap.php')) {
    ce_telemetry_unavailable();
}
require $ceRoot . '/bootstrap.php';

$ceConfig = \Ce\Telemetry\Config::load($ceRoot . '/telemetry-config.php');
if ($ceConfig === null) {
    ce_telemetry_unavailable();
}
$ceEndpoint = new \Ce\Telemetry\Endpoint($ceConfig, $_SERVER);
$ceEndpoint->handle();
