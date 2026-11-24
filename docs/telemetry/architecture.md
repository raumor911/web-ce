# Telemetría CE: arquitectura

Estado: código implementado en la rama `feat/ce-telemetry-v1`; captura **apagada por defecto** (cliente y servidor). Nada de esto está publicado. Varias piezas no se han ejecutado (ver `acceptance.md`).

## Flujo

```
Navegador (React)                          Hosting (Apache + PHP)                        Base de datos propia
-----------------                          ----------------------                        --------------------
TelemetryProvider ── consentimiento ──┐
RouteObserver ── page_view            │
atributos data-ce-* ── clics/vistas   ├─ cola ─ lote ─ POST ──> public/telemetria/collect.php ──> telemetry/ (privada)
formulario ── telemetryBridge         │   (sendBeacon/keepalive)   localiza la carpeta privada      Endpoint: Origin, esquema,
                                      │                            y delega; 503 genérico si no     buckets HMAC, lote transaccional,
                                      │                            hay configuración legible        dedupe por event_id ──> MySQL/MariaDB

Logs de Apache ── cli/import-logs.php (cron) ── clasificación de bots + verificación por IP ──> crawler_requests
Feeds oficiales ── cli/update-bot-ranges.php (cron, 24 h, TTL 72 h) ──> bot_range_snapshots
cli/aggregate.php (cron) ──> daily_web_metrics / daily_crawler_metrics (fecha local America/Mexico_City)
cli/prune.php (cron) ──> retención
public/telemetria-admin/index.php ──> Admin (solo lectura, rol «query», exige REMOTE_USER)
```

## Piezas y dueño

| Pieza | Ubicación | Dueño / quién la opera |
|---|---|---|
| Contrato único | `src/telemetry/contract.json`, `elements.json` | Repositorio (copiado a `telemetry/schema/` al publicar) |
| Cliente | `src/telemetry/*.ts(x)` | Repositorio; bandera `VITE_TELEMETRY_ENABLED` |
| Bootstrap público | `public/telemetria/collect.php`, `public/telemetria-admin/index.php` | Viajan fuera del ZIP normal (el empaquetador excluye `.php`): ver `operations.md` |
| Código privado | `server/telemetry/` -> carpeta privada `telemetry/` | Raúl lo coloca; fuera del document root |
| Configuración real | `telemetry/telemetry-config.php` | Raúl; nunca en Git; ningún agente la lee |
| Base de datos | exclusiva de telemetría, cuatro roles (`ingest`, `query`, `import`, `migrate`) | Raúl (cPanel). Estado: `unknown` |

## Invariantes de privacidad (diseño; sin verificar en producción)

- Sin consentimiento concedido no hay ID, almacenamiento analítico ni red analítica.
- No se capturan valores de formularios, texto de campos, cookies, IP ni user-agent crudo. `crawler_requests` no tiene columnas de IP ni UA.
- La IP solo se usa en memoria (buckets con HMAC que rota a diario y verificación de bots).
- Sin terceros, sin repetición de sesión, sin fingerprinting, sin LLM.
- Los eventos de navegador y las solicitudes HTTP de bots son conjuntos distintos y no se suman.

## Desviaciones frente a la especificación (las que conozco)

| Desviación | Motivo | Impacto | Alternativa |
|---|---|---|---|
| Configuración en un archivo PHP privado en lugar de variables de entorno | Instrucción de Raúl: el hosting no ofrece variables de entorno | Los nombres `TELEMETRY_*` son claves del arreglo | Ninguna sin cambiar de hosting |
| Tablero con autenticación solo `server` (cPanel Directory Privacy + `REMOTE_USER`); el modo `app` queda cerrado | Acotar la superficie de la v1 y no manejar contraseñas propias | Raúl debe activar Directory Privacy en `telemetria-admin/` | Implementar autenticación propia en una versión posterior |
| Agregados web por «sesión-día» (una sesión que cruza medianoche cuenta en dos días) | La fecha local es la unidad de agregación | Sumar días sobrepuebla sesiones únicas | Calcular únicas por periodo con consulta directa |
| Solo se guardan solicitudes de bots declarados; el resto del tráfico se descarta | Minimizar datos (sin IP ni UA persistidos) | No hay visión de todo el tráfico HTTP | Importar todo con agregación previa |
| Agregados con borrar-e-insertar por día en una transacción (en lugar de UPSERT fila a fila) | Que dimensiones que desaparecen no queden obsoletas | Equivalente en resultado; idempotente | UPSERT más barrido |

No se hizo una comprobación línea por línea contra las 21 secciones de la especificación; puede haber otras diferencias.

## Tratamiento de fallos (diseño)

- Colector caído o 503: el cliente reintenta con el mismo `event_id` (máx. 2 reintentos, 30 s) y descarta; la página no depende de la telemetría.
- Importación interrumpida: el checkpoint y las filas van en la misma transacción; se reanuda desde el último offset.
- Feeds de rangos no disponibles: se conserva el último snapshot; tras 72 h la verificación pasa a `verification_unavailable`.
- Config ausente o ilegible: `collect.php` responde 503 genérico, sin rutas.
