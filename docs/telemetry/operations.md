# Telemetría CE: runbook de publicación, operación y reversión

**Nada de esto se ha ejecutado.** Cada paso lo hace Raúl; recomendar no es autorizar. Riesgo global: **medio** (el sitio público no depende de la telemetría, pero hay un endpoint PHP nuevo, una base de datos nueva y cron). Cada paso indica cómo se revierte.

## 0. Estado de las capacidades del hosting

Ver la matriz en `hosting-evidence.md`. Hechos declarados: document root `/public_html` (captura de cPanel; prefijo truncado); carpeta privada `telemetry/` hermana de `public_html` (declarada, GET a `/telemetry/telemetry-config.php` reportado 404 por la coordinación; no verificado por mí). **unknown:** versión de PHP y extensiones (PDO MySQL, cURL, zlib), versión de MySQL/MariaDB, creación de BD y roles, cron y su salida, acceso a logs de acceso crudos y su ruta, CDN, respaldos, `DirectoryIndex` para `index.php`.

## 1. Antes de publicar (comprobaciones en cPanel)

1. PHP >= 7.4 con `pdo_mysql`, `curl` (o `allow_url_fopen`), `zlib`. Versión que usará el cron (puede diferir de la web).
2. Crear una base **exclusiva** de telemetría y cuatro usuarios: `ingest` (INSERT/UPDATE/SELECT en `telemetry_*`), `query` (SELECT), `import` (SELECT/INSERT/UPDATE/DELETE en tablas de bots y agregados) y `migrate` (CREATE/ALTER). Nunca reutilizar los de WordPress ni del formulario.
3. Confirmar la ruta de los logs de acceso de Apache y que el usuario del cron puede leerlos.
4. Activar **Directory Privacy** (cPanel) en la carpeta `telemetria-admin/` una vez publicada.
5. Decidir la interfaz de consentimiento (ver sección 6).

## 2. Dónde va la configuración privada

1. Crear la carpeta **`telemetry`** (ASCII) como hermana de `public_html`, fuera del document root. No confundir con la carpeta pública `public_html/telemetria/`.
2. Copiar `telemetry-config.example.php` a `telemetry/telemetry-config.php` y rellenar los valores. **Nunca en Git, nunca en el ZIP.** Permisos recomendados 600 (o 640).
3. Dejar `'enabled' => false` hasta el paso 7.
4. Comprobar que `https://creativosespacios.mx/telemetry/telemetry-config.php` responde **404** (reportado 404 antes de colocar el archivo; repetir **después** de colocarlo).
5. Si el archivo falta o no se puede leer, `collect.php` responde 503 genérico y la captura queda apagada.

Orden de resolución de `collect.php`: `dirname(DOCUMENT_ROOT)/telemetry/telemetry-config.php`; si no, hasta 5 niveles hacia arriba desde su carpeta; se descarta cualquier candidato dentro del document root.

## 3. Preparar el paquete (en esta máquina, no publica nada)

```bash
git checkout feat/ce-telemetry-v1          # SHA exacto y árbol limpio
npm run telemetry:package                  # .tmp/telemetry-release/<sha>/{public,private,manifest.json,SHA256SUMS}
npm run build                              # cliente con la bandera APAGADA (o ENCENDIDA en el paso 8)
```

El manifiesto separa destinos:

| Zona | Destino en el hosting | Contenido |
|---|---|---|
| `public/` | dentro del document root | `telemetria/collect.php`, `telemetria-admin/index.php` |
| `private/` | carpeta privada `telemetry/` | `bootstrap.php`, `src/`, `cli/`, `schema/` (`contract.json`, `elements.json`, `migrations/*.sql`), `telemetry-config.example.php` |
| (nunca) | — | `telemetry-config.php`, `.htaccess`, `robots.txt`, sitemap, canonical |

**Hecho:** `scripts/package-hostgator.mjs` excluye todo `.php`, así que los PHP **no** viajan en el ZIP `dist N.zip`: se suben aparte según el manifiesto. Verificar los hashes (`SHA256SUMS`) tras subir.

## 4. Respaldo previo

Respaldar (descarga) lo que se va a reemplazar en `public_html`: `telemetria/` y `telemetria-admin/` si existen, y el `index.html`/`assets/` que vayan a cambiar. No reemplazar `assets/` completo (AGENTS.md §5).

## 5. Publicación (orden)

| Paso | Acción | Reversión |
|---|---|---|
| 1 | Subir `private/` a `telemetry/` y colocar `telemetry-config.php` (`enabled=false`) | Borrar el contenido de `telemetry/` |
| 2 | Aplicar migraciones: `php telemetry/cli/migrate.php --dry-run`, luego sin `--dry-run` | Las migraciones son aditivas (`CREATE TABLE IF NOT EXISTS`); revertir = borrar las tablas de telemetría de la BD exclusiva (decisión de Raúl; destruye datos de telemetría) |
| 3 | Subir `public/telemetria/collect.php` | Borrar el archivo |
| 4 | Prueba humana con la captura apagada: cualquier petición debe responder 503 `{"error":"disabled"}` (diseño; sin verificar), nunca un error de PHP visible. Con el servidor apagado y el cliente encendido, cada lote gasta hasta 3 peticiones antes de descartarse: por eso el servidor se enciende (paso 7) antes que el cliente (paso 8) | Igual que el paso 3 |
| 5 | Subir `public/telemetria-admin/index.php` y activar Directory Privacy | Borrar la carpeta |
| 6 | Colocar el cliente (dist con la bandera **apagada**) por manifiesto; comparar con el dist anterior | Restaurar el respaldo |
| 7 | Poner `'enabled' => true` y `allowed_origins` correctos en la configuración privada | Poner `'enabled' => false` (efecto inmediato en el servidor) |
| 8 | Construir el cliente con `VITE_TELEMETRY_ENABLED=true` y `VITE_TELEMETRY_ENDPOINT=/telemetria/collect.php`, publicar por manifiesto | Reconstruir con la bandera apagada y publicar; mientras tanto, apagar el servidor (paso 7) |
| 9 | Programar cron (sección 7) | Quitar las líneas del cron |

Antes del paso 8: **no hay interfaz de consentimiento** (sección 6); con la bandera encendida y sin interfaz, el estado `unknown` no captura nada.

## 6. Consentimiento: inhabilitado por decisión de Raúl (2026-11-24)

**Decisión de Raúl:** la interfaz de consentimiento y el texto de privacidad quedan **inhabilitados de momento**: no se construyen ni se publican. Consecuencia operativa: **no se ejecutan los pasos 7 ni 8** (encender servidor y cliente) hasta que Raúl retome este punto; la telemetría permanece apagada en servidor y cliente. Lo ya implementado no cambia: el cliente respeta tres estados (`unknown`, `denied`, `granted`) y, sin interfaz, el estado `unknown` no captura nada.

Descripción previa de la decisión, conservada como referencia para cuando se retome. El cliente respeta tres estados (`unknown`, `denied`, `granted`) y expone `window.ceTelemetry.setConsent('granted'|'denied')`. **No hay banner ni página de preferencias**: sin una, nadie puede conceder y no se captura nada. Opciones: (a) construir un aviso mínimo con aceptar/rechazar y enlace al aviso de privacidad (requiere decidir el texto y actualizar la política); (b) no activar la captura todavía; (c) otra base legal que decida Raúl. **No es asesoría legal.**

## 7. Cron (rutas y versión de PHP: `unknown`, a completar por Raúl)

Sustituir `<PHP_CLI>` por el binario de PHP CLI de cPanel y `<RUTA_PRIVADA>` por la carpeta `telemetry/` (sin escribirla en el repositorio):

```
7  *  * * *  <PHP_CLI> <RUTA_PRIVADA>/cli/import-logs.php
27 *  * * *  <PHP_CLI> <RUTA_PRIVADA>/cli/aggregate.php
17 4  * * *  <PHP_CLI> <RUTA_PRIVADA>/cli/update-bot-ranges.php
37 3  * * *  <PHP_CLI> <RUTA_PRIVADA>/cli/prune.php
```

Los scripts solo corren por CLI (por HTTP responden 404) y registran su resultado en `telemetry_job_runs`; el tablero muestra la frescura. `import-logs` sin `log_root`/`log_sources` configurados termina sin hacer nada.

## 8. `.htaccess`

**Inferencia (por lectura de `public/.htaccess`, sin probar en el servidor):** la sección 3 sirve archivos y directorios físicos sin fallback, así que `telemetria/collect.php` y `telemetria-admin/` no requieren cambio. **unknown:** que `DirectoryIndex` incluya `index.php`. Si `/telemetria-admin/` no abre, la alternativa sin tocar `.htaccess` es usar `/telemetria-admin/index.php`. **No se propone ningún diff de `.htaccess`.**

## 9. Reversión completa (apagar y retirar)

1. `'enabled' => false` en la configuración privada (el servidor deja de aceptar; el cliente sigue sin enviar nada útil).
2. Reconstruir y publicar el cliente con la bandera apagada (retira el código del bundle; ver riesgo en `acceptance.md`).
3. Quitar el cron.
4. Borrar `public_html/telemetria/` y `public_html/telemetria-admin/`.
5. (Opcional, destructivo) borrar la carpeta `telemetry/` y la BD de telemetría. Decide Raúl; hacer respaldo antes.

## 10. Monitoreo posterior

Tablero: salud (último evento, frescura de cada trabajo, vigencia de rangos, espacio). Umbrales `disk_alert_mb` y `disk_stop_mb` en 0 = sin umbral: **definirlos** es decisión de Raúl. Retención inicial: 90 días de eventos y bots, 12 meses de agregados (valores de diseño, no validados con tráfico real).

## 11. Pruebas pendientes (comandos exactos, para Raúl)

Por instrucción de Raúl no se ejecutaron en la última etapa. Ver `acceptance.md` para lo que sí se corrió antes de esa instrucción.

```bash
npx tsc -b --noEmit && npm run lint
npm run test:telemetry                       # cliente (113) + auditoría de dist
node scripts/telemetry/gen-docs.mjs --check
find server public -name '*.php' -exec php -l {} \;
php server/telemetry/tests/run.php           # PHP sin BD
CE_TEST_DSN='mysql:host=...;dbname=<BD DESECHABLE>' CE_TEST_USER=... CE_TEST_PASS=... php server/telemetry/tests/run.php
export PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
node --test scripts/telemetry/e2e.browser.mjs
npm run build                                # bandera apagada; incluye verify-dist y la auditoría de telemetría
node scripts/telemetry/verify-telemetry-dist.mjs --expect-flag-off
npm run test:verify-dist && npm run test:robots && npm run test:urls
# Tras cada build: git checkout -- public/sitemap.xml public/ai/content-manifest.json public/ai/knowledge-graph.json
```

También pendiente: comparar `dist/` con la línea base (`main`, SHA `aa1266382fc50526f6c3f1719d2d345880a356f2`) y medir el peso del bundle con la bandera encendida frente a apagada (objetivo de diseño: menos de 10 KiB gzip extra).
