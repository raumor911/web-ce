<?php
namespace Ce\Telemetry;

/**
 * Aplica las migraciones SQL numeradas (schema/migrations/NNN_*.sql) con el rol «migrate».
 * Solo crea o altera esquema propio; no borra datos. Cada archivo se aplica una vez; si un archivo ya aplicado cambió
 * (checksum distinto) se detiene en lugar de reaplicar. Las sentencias terminan con «;» al final de línea.
 */
class Migrator
{
    private $pdo;
    private $dir;

    public function __construct(\PDO $pdo, $migrationsDir)
    {
        $this->pdo = $pdo;
        $this->dir = rtrim($migrationsDir, '/');
    }

    public static function splitStatements($sql)
    {
        $lines = [];
        foreach (preg_split('~\r?\n~', $sql) as $line) {
            if (preg_match('~^\s*--~', $line) === 1) {
                continue;
            }
            $lines[] = $line;
        }
        $out = [];
        foreach (preg_split('~;[ \t]*\n~', implode("\n", $lines) . "\n") as $stmt) {
            $stmt = trim($stmt);
            if ($stmt !== '' && $stmt !== ';') {
                $out[] = rtrim($stmt, ';');
            }
        }
        return $out;
    }

    /** @return array ['applied' => [...], 'skipped' => [...], 'error' => ?string] */
    public function migrate($dryRun = false)
    {
        $report = ['applied' => [], 'skipped' => [], 'error' => null];
        $this->pdo->exec('CREATE TABLE IF NOT EXISTS telemetry_migrations (name VARCHAR(80) CHARACTER SET ascii NOT NULL, checksum CHAR(64) CHARACTER SET ascii NOT NULL, applied_at DATETIME NOT NULL, PRIMARY KEY (name)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
        $files = (array) glob($this->dir . '/[0-9][0-9][0-9]_*.sql');
        sort($files);
        foreach ($files as $file) {
            $name = basename($file);
            $sql = (string) file_get_contents($file);
            $sum = hash('sha256', $sql);
            $st = $this->pdo->prepare('SELECT checksum FROM telemetry_migrations WHERE name = ?');
            $st->execute([$name]);
            $row = $st->fetch();
            if ($row) {
                if ($row['checksum'] !== $sum) {
                    $report['error'] = 'checksum_changed:' . $name;
                    return $report;
                }
                $report['skipped'][] = $name;
                continue;
            }
            if ($dryRun) {
                $report['applied'][] = $name . ' (simulada)';
                continue;
            }
            try {
                foreach (self::splitStatements($sql) as $stmt) {
                    $this->pdo->exec($stmt); // DDL: en MySQL confirma implícitamente; por eso cada archivo es idempotente
                }
                $ins = $this->pdo->prepare('INSERT INTO telemetry_migrations (name, checksum, applied_at) VALUES (?, ?, UTC_TIMESTAMP())');
                $ins->execute([$name, $sum]);
                $report['applied'][] = $name;
            } catch (\Throwable $e) {
                $report['error'] = 'failed:' . $name;
                return $report;
            }
        }
        return $report;
    }
}
