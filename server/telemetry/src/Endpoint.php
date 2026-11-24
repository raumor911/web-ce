<?php
namespace Ce\Telemetry;

/**
 * POST /telemetria/collect.php. Solo ingiere eventos de navegador. Respuestas: 200, 400, 403, 405, 413, 415, 429, 503.
 * Sin CORS abierto; Origin es un filtro (no autentica). Sin credenciales ni errores SQL en las respuestas.
 */
class Endpoint
{
    /** @var Config */
    private $config;
    /** @var array */
    private $server;

    public function __construct(Config $config, array $server)
    {
        $this->config = $config;
        $this->server = $server;
    }

    public static function send($status, array $body, array $headers = [])
    {
        if (!headers_sent()) {
            http_response_code($status);
            header('Content-Type: application/json; charset=utf-8');
            header('Cache-Control: no-store');
            header('X-Content-Type-Options: nosniff');
            foreach ($headers as $name => $value) {
                header($name . ': ' . $value);
            }
        }
        echo json_encode($body);
    }

    /** IP efectiva: REMOTE_ADDR, salvo que venga de un proxy declarado (entonces la primera IP no confiable de X-Forwarded-For, de derecha a izquierda). */
    public function clientIp()
    {
        $remote = isset($this->server['REMOTE_ADDR']) ? (string) $this->server['REMOTE_ADDR'] : '';
        $trusted = $this->config->get('trusted_proxies', []);
        if (!is_array($trusted) || !in_array($remote, $trusted, true) || empty($this->server['HTTP_X_FORWARDED_FOR'])) {
            return $remote;
        }
        $chain = array_reverse(array_map('trim', explode(',', (string) $this->server['HTTP_X_FORWARDED_FOR'])));
        foreach ($chain as $ip) {
            if (filter_var($ip, FILTER_VALIDATE_IP) !== false && !in_array($ip, $trusted, true)) {
                return $ip;
            }
        }
        return $remote;
    }

    private function contentTypeAllowed()
    {
        $type = isset($this->server['CONTENT_TYPE']) ? strtolower(trim((string) $this->server['CONTENT_TYPE'])) : '';
        return preg_match('~^(application/json|text/plain)\s*(;\s*charset\s*=\s*"?utf-8"?)?\s*$~', $type) === 1;
    }

    private function logError($code, $correlation)
    {
        // Registro privado: solo código y correlation_id aleatorio. Nunca payload, SQL ni credenciales.
        @error_log('ce-telemetry ' . $code . ' ' . $correlation);
    }

    public function handle()
    {
        if (!$this->config->enabled()) {
            return self::send(503, ['error' => 'disabled']);
        }
        $method = isset($this->server['REQUEST_METHOD']) ? $this->server['REQUEST_METHOD'] : '';
        if ($method !== 'POST') {
            return self::send(405, ['error' => 'method'], ['Allow' => 'POST']);
        }
        $origin = isset($this->server['HTTP_ORIGIN']) ? (string) $this->server['HTTP_ORIGIN'] : '';
        $environment = $this->config->environmentForOrigin($origin);
        if ($environment === null) {
            return self::send(403, ['error' => 'origin']);
        }
        if (!$this->contentTypeAllowed()) {
            return self::send(415, ['error' => 'content_type']);
        }
        $contract = Contract::fromDir(CE_TELEMETRY_ROOT . '/schema');
        $max = (int) $contract->limit('max_body_bytes');
        if (isset($this->server['CONTENT_LENGTH']) && (int) $this->server['CONTENT_LENGTH'] > $max) {
            return self::send(413, ['error' => 'too_large']);
        }
        $body = file_get_contents('php://input', false, null, 0, $max + 1);
        if ($body === false || strlen($body) > $max) {
            return self::send(413, ['error' => 'too_large']);
        }
        $correlation = bin2hex(random_bytes(6));
        $now = time();
        try {
            $pdo = Db::connect($this->config, 'ingest', 2);
            $limiter = new RateLimiter($pdo, $this->config->get('hmac_key', ''), (array) $this->config->get('rate_limits', []));
            if (!$limiter->allowRequest($this->clientIp(), $now)) {
                return self::send(429, ['error' => 'rate_limited'], ['Retry-After' => (string) RateLimiter::retryAfter($now)]);
            }
            $check = $contract->validateBatch($body);
            if (!$check['ok']) {
                // El detalle va al registro privado sin contenido: solo el código de validación.
                $this->logError('invalid:' . explode(':', (string) $check['error'])[0], $correlation);
                return self::send(400, ['error' => 'invalid']);
            }
            $perSession = [];
            foreach ($check['value'] as $ev) {
                $perSession[$ev['session_id']] = isset($perSession[$ev['session_id']]) ? $perSession[$ev['session_id']] + 1 : 1;
            }
            foreach ($perSession as $sid => $n) {
                if (!$limiter->allowSessionEvents($sid, $n, $now)) {
                    return self::send(429, ['error' => 'rate_limited'], ['Retry-After' => (string) RateLimiter::retryAfter($now)]);
                }
            }
            $ingest = new Ingest($pdo, $contract, (array) $this->config->get('ai_referrer_hosts', []));
            $result = $ingest->persist($check['value'], $environment, microtime(true));
            if (mt_rand(1, 100) === 1) {
                $limiter->purge($now);
            }
            return self::send(200, ['accepted' => $result['accepted'], 'duplicates' => $result['duplicates']]);
        } catch (\Throwable $e) {
            $this->logError('persist:' . get_class($e), $correlation);
            return self::send(503, ['error' => 'unavailable', 'correlation_id' => $correlation]);
        }
    }
}
