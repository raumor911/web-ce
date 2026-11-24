<?php
namespace Ce\Telemetry;

/** Conexiones PDO por rol (ingest, query, import, migrate). Excepciones activadas, sentencias preparadas reales. */
class Db
{
    public static function connect(Config $config, $role, $timeoutSeconds = 3)
    {
        $dsn = $config->get('db.' . $role . '.dsn');
        $user = $config->get('db.' . $role . '.user');
        $pass = $config->get('db.' . $role . '.password');
        if (!is_string($dsn) || $dsn === '') {
            throw new \RuntimeException('db_role_missing');
        }
        $options = [
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_EMULATE_PREPARES => false,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            \PDO::ATTR_TIMEOUT => (int) $timeoutSeconds,
            \PDO::ATTR_PERSISTENT => false,
        ];
        $pdo = new \PDO($dsn, (string) $user, (string) $pass, $options);
        // Todo en UTC: la presentación en America/Mexico_City se resuelve en PHP, no con desplazamientos fijos.
        $pdo->exec("SET time_zone = '+00:00'");
        $pdo->exec("SET NAMES utf8mb4");
        return $pdo;
    }

    /** ¿Es una violación de clave única (1062) sobre la clave indicada? */
    public static function isDuplicateOn(\PDOException $e, $keyName)
    {
        $info = $e->errorInfo;
        return is_array($info) && isset($info[1]) && (int) $info[1] === 1062 && strpos((string) $e->getMessage(), $keyName) !== false;
    }
}
