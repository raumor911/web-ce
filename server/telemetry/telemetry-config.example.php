<?php
/**
 * Plantilla de configuración PRIVADA de telemetría de Creativos Espacios.
 *
 * - Este archivo es solo un ejemplo con marcadores. NO contiene valores reales y NO se usa en producción.
 * - El archivo real se llama telemetry-config.php, lo crea y lo coloca Raúl en la carpeta privada `telemetry/`
 *   (fuera del document root y fuera de Git) con permisos 600 o 640. Ningún agente lo crea ni lo lee.
 * - Las claves siguen los nombres de la sección 16 del diseño (TELEMETRY_ENABLED, TELEMETRY_ENV, ...), ahora como
 *   claves de este arreglo; el hosting no necesita variables de entorno.
 * - La captura del servidor está APAGADA por defecto ('enabled' => false).
 */
return [
    // TELEMETRY_ENABLED: interruptor del servidor. Con false, collect.php responde 503 y no toca la BD.
    'enabled' => false,

    // TELEMETRY_ENV: etiqueta por defecto; el entorno real sale de 'allowed_origins'.
    'env' => 'production',

    // TELEMETRY_DB_DSN / USER / PASSWORD, uno por rol con privilegios mínimos (BD exclusiva de telemetría).
    //   ingest  : INSERT/UPDATE/SELECT en telemetry_events, telemetry_sessions y telemetry_rate_buckets.
    //   query   : solo SELECT (tablero privado).
    //   import  : INSERT/UPDATE/SELECT/DELETE en las tablas de crawlers, agregados y trabajos (cron).
    //   migrate : CREATE/ALTER/INDEX; solo se usa en cli/migrate.php.
    // Nunca reutilizar usuarios de WordPress ni de otros sistemas.
    'db' => [
        'ingest'  => ['dsn' => 'mysql:host=localhost;dbname=CAMBIAR;charset=utf8mb4', 'user' => 'CAMBIAR', 'password' => 'CAMBIAR'],
        'query'   => ['dsn' => 'mysql:host=localhost;dbname=CAMBIAR;charset=utf8mb4', 'user' => 'CAMBIAR', 'password' => 'CAMBIAR'],
        'import'  => ['dsn' => 'mysql:host=localhost;dbname=CAMBIAR;charset=utf8mb4', 'user' => 'CAMBIAR', 'password' => 'CAMBIAR'],
        'migrate' => ['dsn' => 'mysql:host=localhost;dbname=CAMBIAR;charset=utf8mb4', 'user' => 'CAMBIAR', 'password' => 'CAMBIAR'],
    ],

    // TELEMETRY_ALLOWED_ORIGINS: origen => entorno. Origin es un filtro, no autenticación.
    'allowed_origins' => [
        'https://creativosespacios.mx' => 'production',
        // 'https://staging.ejemplo.invalid' => 'staging',
    ],

    // TELEMETRY_LOG_ROOT: directorio de logs de acceso, fuera del público. Solo lo lee el importador CLI.
    'log_root' => '/CAMBIAR/ruta/privada/de/logs',

    // Fuentes de logs. layer: origin (Apache) o edge (CDN). Nunca se suman entre sí como solicitudes únicas.
    'log_sources' => [
        // ['id' => 'apache-origin', 'host' => 'creativosespacios.mx', 'layer' => 'origin',
        //  'pattern' => 'access.log*', 'format' => 'combined', 'timezone' => 'America/Mexico_City'],
    ],

    // TELEMETRY_TRUSTED_PROXIES: IPs exactas de proxies conocidos. Vacío = X-Forwarded-For se ignora.
    'trusted_proxies' => [],

    // TELEMETRY_RETENTION_DAYS: eventos web y solicitudes de bots.
    'retention_days' => 90,
    'aggregate_retention_months' => 12,
    'jobs_retention_days' => 90,

    // TELEMETRY_HMAC_KEY: cadena aleatoria larga (>= 32 caracteres) para los buckets antiabuso. No se publica.
    'hmac_key' => 'CAMBIAR-por-una-cadena-aleatoria-larga',

    // Límites configurables de ingesta (valores iniciales de diseño, no validados con tráfico real).
    'rate_limits' => ['ip_per_min' => 60, 'session_events_per_min' => 600, 'global_per_min' => 120],

    // Tablero privado. 'server' = protegido por cPanel Directory Privacy (se exige REMOTE_USER).
    // 'app' = autenticación propia: usuarios => hash de password_hash(). Nunca contraseñas en claro.
    'admin' => ['auth' => 'server', 'users' => [], 'session_hours' => 8, 'max_login_attempts' => 5],

    // Alerta de salud por espacio (MiB de tablas de telemetría) y detención de ingesta; 0 = sin umbral.
    'disk_alert_mb' => 0,
    'disk_stop_mb' => 0,

    // Referrers que se etiquetan ai_referred_observed (lista no exhaustiva, editable).
    'ai_referrer_hosts' => ['chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'claude.ai', 'gemini.google.com', 'copilot.microsoft.com'],
];
