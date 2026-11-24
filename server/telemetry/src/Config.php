<?php
namespace Ce\Telemetry;

/** Configuración privada (arreglo devuelto por telemetry-config.php). Nunca se imprime ni se registra. */
class Config
{
    /** @var array */
    private $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /** Carga el archivo de configuración; devuelve null si no es un arreglo válido (sin revelar la ruta). */
    public static function load($path)
    {
        if (!is_string($path) || !is_file($path) || !is_readable($path)) {
            return null;
        }
        try {
            $data = (static function ($file) {
                return include $file;
            })($path);
        } catch (\Throwable $e) {
            return null;
        }
        return is_array($data) ? new self($data) : null;
    }

    public function get($key, $default = null)
    {
        $node = $this->data;
        foreach (explode('.', $key) as $part) {
            if (!is_array($node) || !array_key_exists($part, $node)) {
                return $default;
            }
            $node = $node[$part];
        }
        return $node;
    }

    public function enabled()
    {
        return $this->get('enabled', false) === true;
    }

    /** Entorno asociado a un Origin permitido, o null si el origen no está permitido. */
    public function environmentForOrigin($origin)
    {
        $allowed = $this->get('allowed_origins', []);
        if (!is_string($origin) || !is_array($allowed) || !isset($allowed[$origin])) {
            return null;
        }
        return (string) $allowed[$origin];
    }

    /** Errores de configuración sin valores sensibles (para cli/health). */
    public function problems()
    {
        $out = [];
        $key = $this->get('hmac_key', '');
        if (!is_string($key) || strlen($key) < 32 || strpos($key, 'CAMBIAR') !== false) {
            $out[] = 'hmac_key';
        }
        foreach (['ingest', 'query', 'import', 'migrate'] as $role) {
            $dsn = $this->get('db.' . $role . '.dsn', '');
            if (!is_string($dsn) || $dsn === '' || strpos($dsn, 'CAMBIAR') !== false) {
                $out[] = 'db.' . $role;
            }
        }
        return $out;
    }
}
