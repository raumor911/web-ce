<?php
namespace Ce\Telemetry\Crawler;

/** Coincidencia de IP contra rangos CIDR IPv4/IPv6. Una IPv6 «mapeada» (::ffff:a.b.c.d) se compara como IPv4. */
class Cidr
{
    /** @return string|null IP en binario (4 o 16 bytes) o null si no es válida */
    public static function ipToBin($ip)
    {
        if (!is_string($ip) || $ip === '' || strlen($ip) > 45) {
            return null;
        }
        $bin = @inet_pton($ip);
        if ($bin === false) {
            return null;
        }
        if (strlen($bin) === 16 && substr($bin, 0, 12) === "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff") {
            return substr($bin, 12);
        }
        return $bin;
    }

    /** @return array|null [binario de la red, bits] o null si el CIDR no es válido */
    public static function parse($cidr)
    {
        if (!is_string($cidr) || strlen($cidr) > 50 || substr_count($cidr, '/') !== 1) {
            return null;
        }
        list($ip, $bits) = explode('/', $cidr);
        if ($bits === '' || !ctype_digit($bits)) {
            return null;
        }
        $bin = @inet_pton($ip);
        if ($bin === false) {
            return null;
        }
        $bits = (int) $bits;
        if ($bits > strlen($bin) * 8) {
            return null;
        }
        return [$bin, $bits];
    }

    public static function contains(array $parsed, $ipBin)
    {
        list($net, $bits) = $parsed;
        if ($ipBin === null || strlen($ipBin) !== strlen($net)) {
            return false;
        }
        $full = intdiv($bits, 8);
        if ($full > 0 && substr($ipBin, 0, $full) !== substr($net, 0, $full)) {
            return false;
        }
        $rest = $bits % 8;
        if ($rest === 0) {
            return true;
        }
        $mask = (0xff << (8 - $rest)) & 0xff;
        return (ord($ipBin[$full]) & $mask) === (ord($net[$full]) & $mask);
    }

    /** ¿La IP está en alguno de los rangos (cadenas CIDR)? */
    public static function inAny($ip, array $cidrs)
    {
        $bin = self::ipToBin($ip);
        if ($bin === null) {
            return false;
        }
        foreach ($cidrs as $cidr) {
            $p = self::parse($cidr);
            if ($p !== null && self::contains($p, $bin)) {
                return true;
            }
        }
        return false;
    }
}
