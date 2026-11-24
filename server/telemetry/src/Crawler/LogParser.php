<?php
namespace Ce\Telemetry\Crawler;

/**
 * Lector de líneas del formato «combined» de Apache. Devuelve solo lo necesario para clasificar: la IP y el UA
 * existen únicamente en memoria durante la importación y NUNCA se guardan.
 */
class LogParser
{
    const REGEX = '~^(\S+) \S+ \S+ \[([^\]]+)\] "([A-Z]{3,10}) (\S+)(?: [^"]*)?" (\d{3}) (\d+|-)(?: "(?:[^"\\\\]|\\\\.)*" "((?:[^"\\\\]|\\\\.)*)")?~';

    /**
     * @return array|null null si la línea no es parseable.
     *   ['at' => epoch, 'ip', 'method', 'path', 'status', 'bytes', 'ua']
     */
    public static function parseLine($line)
    {
        if (!is_string($line) || strlen($line) > 8192 || preg_match(self::REGEX, $line, $m) !== 1) {
            return null;
        }
        $dt = \DateTime::createFromFormat('d/M/Y:H:i:s O', $m[2]);
        if ($dt === false) {
            return null;
        }
        $path = self::normalizePath($m[4]);
        if ($path === null) {
            return null;
        }
        return [
            'at' => $dt->getTimestamp(),
            'ip' => $m[1],
            'method' => $m[3],
            'path' => $path,
            'status' => (int) $m[5],
            'bytes' => $m[6] === '-' ? null : (int) $m[6],
            'ua' => isset($m[7]) ? stripcslashes($m[7]) : '',
        ];
    }

    /** Solo la ruta (sin consulta ni fragmento), ASCII imprimible, empezando por «/», máximo 512. */
    public static function normalizePath($target)
    {
        $q = strcspn($target, '?#');
        $path = substr($target, 0, $q);
        if ($path === '' || $path[0] !== '/' || strlen($path) > 512 || preg_match('~^[\x21-\x7e]+$~', $path) !== 1) {
            return null;
        }
        return $path;
    }

    /** Fecha local (America/Mexico_City) de un epoch, para marcar días por reconstruir. */
    public static function localDate($epoch)
    {
        $d = new \DateTime('@' . (int) $epoch);
        $d->setTimezone(new \DateTimeZone('America/Mexico_City'));
        return $d->format('Y-m-d');
    }
}
