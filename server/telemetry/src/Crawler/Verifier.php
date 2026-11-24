<?php
namespace Ce\Telemetry\Crawler;

/**
 * Verificación de bots por IP contra snapshots de rangos oficiales, en memoria durante la importación.
 * Estados: declared_unverified | verified | mismatch | verification_unavailable | unknown.
 * `mismatch` no significa «falso»: puede deberse a cambios de infraestructura o a un proxy.
 * No hace DNS ni peticiones externas por solicitud.
 */
class Verifier
{
    /** @var array feed_id => ['snapshot_id' => int, 'cidrs' => [parsed...], 'valid_until' => int epoch] */
    private $snapshots;

    /** @param array $snapshots snapshots vigentes por feed (ver SnapshotStore::loadValid) */
    public function __construct(array $snapshots)
    {
        $this->snapshots = [];
        foreach ($snapshots as $feed => $s) {
            $parsed = [];
            foreach ($s['ranges'] as $cidr) {
                $p = Cidr::parse($cidr);
                if ($p !== null) {
                    $parsed[] = $p;
                }
            }
            $this->snapshots[$feed] = ['snapshot_id' => $s['snapshot_id'], 'cidrs' => $parsed, 'valid_until' => $s['valid_until']];
        }
    }

    /**
     * @param array|null $class      resultado de BotCatalog::classify
     * @param string     $ip         IP efectiva del log (solo en memoria)
     * @param bool       $ipReliable false si el origen está detrás de un CDN/proxy y la IP del log no es la del cliente
     * @param int        $at         epoch de la solicitud (para comprobar vigencia del snapshot)
     * @return array ['status', 'method', 'snapshot_id']
     */
    public function verify($class, $ip, $ipReliable, $at)
    {
        if ($class === null) {
            return ['status' => 'unknown', 'method' => null, 'snapshot_id' => null];
        }
        if (empty($class['feeds'])) {
            return ['status' => 'declared_unverified', 'method' => 'none', 'snapshot_id' => null];
        }
        if (!$ipReliable) {
            return ['status' => 'verification_unavailable', 'method' => 'untrusted_ip', 'snapshot_id' => null];
        }
        $bin = Cidr::ipToBin($ip);
        if ($bin === null) {
            return ['status' => 'verification_unavailable', 'method' => 'no_ip', 'snapshot_id' => null];
        }
        $usable = [];
        foreach ($class['feeds'] as $feed) {
            if (isset($this->snapshots[$feed]) && $this->snapshots[$feed]['valid_until'] >= $at) {
                $usable[$feed] = $this->snapshots[$feed];
            }
        }
        if (!$usable) {
            return ['status' => 'verification_unavailable', 'method' => 'ranges_expired_or_missing', 'snapshot_id' => null];
        }
        foreach ($usable as $feed => $s) {
            foreach ($s['cidrs'] as $p) {
                if (Cidr::contains($p, $bin)) {
                    return ['status' => 'verified', 'method' => 'ip_ranges:' . $feed, 'snapshot_id' => $s['snapshot_id']];
                }
            }
        }
        $first = reset($usable);
        return ['status' => 'mismatch', 'method' => 'ip_ranges', 'snapshot_id' => $first['snapshot_id']];
    }
}
