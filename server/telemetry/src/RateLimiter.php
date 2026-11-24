<?php
namespace Ce\Telemetry;

/**
 * Límites por minuto con buckets indexados en BD (sin recorrer tablas). La IP efectiva solo entra como HMAC con clave
 * que rota a diario; no se guarda ni se publica. Valores iniciales de diseño, no validados con tráfico real.
 */
class RateLimiter
{
    private $pdo;
    private $key;
    private $limits;

    public function __construct(\PDO $pdo, $hmacKey, array $limits)
    {
        $this->pdo = $pdo;
        $this->key = (string) $hmacKey;
        $this->limits = $limits + ['ip_per_min' => 60, 'session_events_per_min' => 600, 'global_per_min' => 120];
    }

    public static function minuteStamp($now)
    {
        return gmdate('YmdHi', $now);
    }

    public static function retryAfter($now)
    {
        return 60 - ($now % 60);
    }

    /** Clave HMAC con rotación diaria: la misma IP genera claves distintas cada día. */
    public function hashed($prefix, $value, $now)
    {
        $daily = hash_hmac('sha256', gmdate('Ymd', $now), $this->key);
        return $prefix . substr(hash_hmac('sha256', (string) $value, $daily), 0, 32);
    }

    /** Suma $amount al bucket y devuelve el total del minuto. */
    public function hit($bucket, $amount, $now)
    {
        $expires = gmdate('Y-m-d H:i:s', $now + 120);
        $st = $this->pdo->prepare('INSERT INTO telemetry_rate_buckets (bucket_key, hits, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE hits = hits + VALUES(hits)');
        $st->execute([$bucket, (int) $amount, $expires]);
        $sel = $this->pdo->prepare('SELECT hits FROM telemetry_rate_buckets WHERE bucket_key = ?');
        $sel->execute([$bucket]);
        $row = $sel->fetch();
        return $row ? (int) $row['hits'] : (int) $amount;
    }

    /** Aplica límite global y por IP antes de cualquier trabajo caro. Devuelve true si se permite. */
    public function allowRequest($ip, $now)
    {
        $minute = self::minuteStamp($now);
        if ($this->hit('g:' . $minute, 1, $now) > (int) $this->limits['global_per_min']) {
            return false;
        }
        return $this->hit($this->hashed('i:', $ip . '|' . $minute, $now), 1, $now) <= (int) $this->limits['ip_per_min'];
    }

    /** Límite por sesión, ya con el lote validado. */
    public function allowSessionEvents($sessionId, $count, $now)
    {
        $minute = self::minuteStamp($now);
        return $this->hit($this->hashed('s:', $sessionId . '|' . $minute, $now), $count, $now) <= (int) $this->limits['session_events_per_min'];
    }

    /** Limpieza oportunista de buckets vencidos (acotada). */
    public function purge($now)
    {
        $st = $this->pdo->prepare('DELETE FROM telemetry_rate_buckets WHERE expires_at < ? LIMIT 500');
        $st->execute([gmdate('Y-m-d H:i:s', $now)]);
        return $st->rowCount();
    }
}
