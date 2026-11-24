<?php
/**
 * Bootstrap público mínimo del tablero privado de telemetría. Solo localiza la carpeta PRIVADA y delega.
 * La autenticación la aplica el servidor (cPanel Directory Privacy) y el código vuelve a exigirla (REMOTE_USER).
 * Sin credenciales ni rutas absolutas. Mismo método de localización que ../telemetria/collect.php.
 */
const CE_TELEMETRY_PRIVATE_DIR = 'telemetry';

function ce_admin_unavailable()
{
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    echo "No disponible.\n";
    exit;
}

function ce_admin_candidate($dir, $dirName, $root)
{
    $config = $dir . '/' . $dirName . '/telemetry-config.php';
    if (!is_file($config) || !is_readable($config)) {
        return null;
    }
    $real = realpath($config);
    if ($real === false || strpos($real . '/', rtrim($root, '/') . '/') === 0) {
        return null;
    }
    return dirname($real);
}

function ce_admin_locate($startDir, $dirName, $documentRoot)
{
    $root = ($documentRoot !== '' && $documentRoot !== null) ? realpath($documentRoot) : false;
    if ($root === false) {
        return null;
    }
    $found = ce_admin_candidate(dirname($root), $dirName, $root);
    if ($found !== null) {
        return $found;
    }
    $dir = $startDir;
    for ($i = 0; $i < 5; $i++) {
        $parent = dirname($dir);
        if ($parent === $dir) {
            break;
        }
        $dir = $parent;
        $found = ce_admin_candidate($dir, $dirName, $root);
        if ($found !== null) {
            return $found;
        }
    }
    return null;
}

$ceRoot = ce_admin_locate(__DIR__, CE_TELEMETRY_PRIVATE_DIR, isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : '');
if ($ceRoot === null || !is_file($ceRoot . '/bootstrap.php')) {
    ce_admin_unavailable();
}
require $ceRoot . '/bootstrap.php';
$ceConfig = \Ce\Telemetry\Config::load($ceRoot . '/telemetry-config.php');
if ($ceConfig === null) {
    ce_admin_unavailable();
}
(new \Ce\Telemetry\Admin\Admin($ceConfig, $_SERVER, $_GET))->handle();
