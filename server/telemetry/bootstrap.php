<?php
/**
 * Bootstrap privado de telemetría: autocarga de clases. No lee configuración por sí mismo.
 * Vive en la carpeta privada `telemetry/` (fuera del document root). Sintaxis compatible con PHP 7.4.
 */
namespace Ce\Telemetry;

if (!defined('CE_TELEMETRY_ROOT')) {
    define('CE_TELEMETRY_ROOT', __DIR__);
}

spl_autoload_register(function ($class) {
    $prefix = 'Ce\\Telemetry\\';
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }
    $relative = str_replace('\\', '/', substr($class, strlen($prefix)));
    $file = CE_TELEMETRY_ROOT . '/src/' . $relative . '.php';
    if (is_file($file)) {
        require $file;
    }
});
