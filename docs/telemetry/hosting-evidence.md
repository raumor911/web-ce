# Telemetría CE: evidencia del hosting y matriz de capacidades

Etapa 1 de `CE_Diseno_Telemetria_Usuarios_Crawlers_v1.md` (sección 19). Modo lectura: no hubo acceso al hosting, ni credenciales, ni se buscaron.

## Línea base de la rama

| Dato | Valor | Etiqueta |
|---|---|---|
| Repositorio | `web-ce` (Creativos Espacios) | hecho |
| SHA inicial de `main` | `aa1266382fc50526f6c3f1719d2d345880a356f2` | hecho (`git rev-parse main`, 2026-11-24) |
| Rama de trabajo | `feat/ce-telemetry-v1`, creada desde ese SHA | hecho |
| `AGENTS.md` | No existía en `main` al iniciar. Raúl lo creó en la rama local `docs/agents-md` (commit `0738841`); se trajo con cherry-pick a esta rama | hecho |
| Pruebas existentes al iniciar | `test:verify-dist`, `test:robots`, `test:urls` y `npm run build` completo (exit 0, 62 rutas correctas) con `PUPPETEER_EXECUTABLE_PATH` apuntando a Google Chrome | hecho (ver `acceptance.md`) |

## Matriz de capacidades del hosting

Leyenda: **observado** = consta en el repositorio o sus documentos (con fuente); **inferido** = se deduce, no se comprobó; **unknown** = no consta; **bloqueado** = no se puede resolver sin acceso al panel.

| # | Capacidad | Estado | Evidencia o motivo | Efecto en el diseño |
|---|---|---|---|---|
| 1 | Proveedor y servidor web | Observado: HostGator, Apache | `AGENTS.md` §1; `docs/CE-HTML-07-estado-y-publicacion.md`; `public/.htaccess` usa `mod_rewrite` | Endpoints físicos en `public/`; sin proceso Node permanente |
| 2 | PHP en el hosting | Observado que existe; versión **unknown** | `public/formulario-creativosespacios.php` usa `mail()` y `phpversion()` (solo se buscó el nombre de las funciones; el archivo no se leyó completo para no tocar credenciales); `CE-HTML-07` reporta que el GET responde 405 JSON | Se asume PHP 7.4+ como mínimo del código; hay que confirmar. El código usa solo sintaxis de PHP 7.4 (sin `match`, sin `enum`, sin propiedades tipadas `readonly`) |
| 3 | PHP CLI | **unknown** | No consta | El importador es CLI; si no hay CLI, ver sección «Si falta una capacidad» |
| 4 | PDO MySQL (`pdo_mysql`) | **unknown / bloqueado** | No consta | Sin PDO MySQL no hay ingesta; se entrega el contrato y se propone adaptador separado |
| 5 | Motor y versión de BD (MySQL o MariaDB) | **unknown / bloqueado** | No consta en repo ni docs | DDL escrito para el subconjunto común MySQL 5.7+/MariaDB 10.3+ (InnoDB, `utf8mb4`, sin `CHECK`, sin `JSON`, sin columnas generadas, sin `ON DUPLICATE KEY ... AS alias`) |
| 6 | Permisos de creación, cuota y conexiones de BD | **unknown / bloqueado** | No consta | Se necesita crear BD y 4 usuarios (ingesta, consulta, importación, migración) |
| 7 | InnoDB y `utf8mb4` | **unknown** | No consta | Las migraciones declaran `ENGINE=InnoDB` y `utf8mb4`; si el motor lo rechaza la migración falla sin efectos parciales gracias a que cada archivo es idempotente |
| 8 | Extensiones PHP `json`, `hash`, `mbstring`, `zlib` | **unknown** | No consta | `zlib` solo hace falta para leer logs `.gz` |
| 9 | Cron y duración máxima | Inferido (hipótesis): existe un cron PHP en el servidor | `scripts/generate-sitemap.js` (línea 48) dice que `/sitemap-blog.xml` lo genera un «cron PHP en el servidor, fuera de dist»; no se verificó | Cron propuesto cada 15 min; si no existe, el importador se corre a mano y el tablero lo marca «actualización manual» |
| 10 | Document root real | **Declarado por Raúl vía captura de cPanel (Dominios): `creativosespacios.mx`, Main Domain, directorio raíz `/public_html`.** El tooltip muestra la ruta completa truncada: el prefijo no se ve (no se transcribe aquí: el repositorio es público) | Captura de cPanel compartida por Raúl vía la coordinación; `docs/releases/ce-html-06-hostgator.md`; `AGENTS.md` §5b | La ruta fija `dirname(__DIR__, N)` es frágil. `collect.php` prueba primero `dirname(DOCUMENT_ROOT)/telemetry/telemetry-config.php` y luego busca hacia arriba (máximo 5 niveles desde su carpeta) un hermano `telemetry/telemetry-config.php`, usa el primero que exista, sea legible y **no** esté dentro del document root (compara `realpath` con `$_SERVER['DOCUMENT_ROOT']`). Sin ruta en Git |
| 11 | Directorio privado fuera del document root | **Declarado por Raúl:** la carpeta `telemetry/` es hermana de `public_html`, fuera de la raíz pública (consecuencia del docroot `/public_html`, fila 10). El 404 de `https://creativosespacios.mx/telemetry/telemetry-config.php` (GET: 404 `text/html`) lo reporta la coordinación; **yo no lo ejecuté ni lo verifiqué**. La existencia y los permisos del archivo siguen **sin verificar** | Mensajes de Raúl en la sesión; no consta en el repo | La carpeta privada se llama `telemetry` (ASCII). No confundir con la carpeta pública `public/telemetria/` (donde vive `collect.php`) |
| 12 | Protección de administración (Directory Privacy de cPanel) | **unknown** | No consta | El tablero funciona en modo `server` (exige `REMOTE_USER`; rechaza con 401 si no hay protección) o modo `app` (autenticación propia) |
| 13 | Logs de acceso (formato, zona horaria, IP efectiva, rotación, compresión, permisos, demora) | **unknown / bloqueado** | No consta | El parser soporta Combined y una variante con host/latencia configurable por patrón; sin logs, los crawlers quedan «sin cobertura» |
| 14 | CDN o proxy (Cloudflare u otro) | **unknown** | No hay evidencia en el repo (búsqueda de `cloudflare`, `cdn`, `proxy` sin resultados) | La IP efectiva se toma de `REMOTE_ADDR`; solo se confía en `X-Forwarded-For` si `trusted_proxies` lo declara. Capa de cobertura `origin` por defecto |
| 15 | Respaldos y restauración | **unknown** | No consta. `CE-HTML-07` exige respaldar archivos a sustituir | Paso 0 del runbook |
| 16 | TLS | Observado: HTTPS forzado en `.htaccess`; vigencia **unknown** | `public/.htaccess` redirige a `https://creativosespacios.mx` | La validación de Origin usa `https://creativosespacios.mx` |
| 17 | Espacio en disco / cuota | **unknown** | No consta | El tablero de salud muestra tamaño de tablas; umbral configurable |
| 18 | Procedimiento de publicación | Observado | `AGENTS.md` §5: ZIP `dist N.zip` con `dist/` dentro, publicación manual de Raúl; `.htaccess` manual; `package-hostgator.mjs` **excluye todo `.php`** | El paquete de telemetría usa manifiesto propio (ver `operations.md`) |
| 19 | Tratamiento Apache de `/telemetria/collect.php` y `/telemetria-admin/` | Inferido | `.htaccess` sección 3: un archivo físico (`-f`) o directorio (`-d`) se sirve tal cual y no llega al fallback; sin cambios necesarios en `.htaccess` | **Comprobar por HTTP real** tras publicar (ver pasos de verificación) |

### Comprobaciones que debe hacer Raúl en cPanel

Ninguna requiere cambiar nada; son lecturas. Anotar el resultado en `hosting-evidence.md` (sin contraseñas ni nombres de BD).

1. **Versión de PHP** (MultiPHP Manager) para el dominio, y si la CLI tiene la misma (`php -v` en Terminal, si existe; si no, un cron de prueba con `php -v` escrito a un archivo privado).
2. **Extensiones PHP** (Select PHP Version / Extensions): `pdo_mysql`, `json`, `mbstring`, `zlib`, `hash`.
3. **Base de datos** (MySQL Databases / phpMyAdmin → pestaña Variables o `SELECT VERSION()`): motor (MySQL o MariaDB), versión, si el plan permite crear una BD nueva y cuántos usuarios, y la cuota de disco.
4. **Cron** (Cron Jobs): que exista, frecuencia mínima permitida, y cuánto puede durar un proceso. Confirmar si ya hay un cron PHP para `sitemap-blog.xml`.
5. **Document root**: ruta absoluta de `public_html` y si hay una carpeta hermana (mismo nivel, fuera de `public_html`) donde escribir; crear `telemetry/` ahí es decisión de Raúl.
6. **Logs de acceso** (Raw Access / Metrics → Raw Access, o `~/logs/` o `~/access-logs/`): ruta, formato de línea (una línea de ejemplo **con la IP y la ruta saneadas**), zona horaria, si se rotan y comprimen (`.gz`), cada cuánto, permisos de lectura para el usuario del cron, y retardo de entrega. Esta línea de ejemplo es el fixture que falta (etapa 4).
7. **CDN/proxy**: si el DNS pasa por Cloudflare u otro proxy (panel de DNS, solo lectura) o hay un acelerador del hosting; si sí, si guardan logs de edge.
8. **Protección de directorios** (Directory Privacy): confirmar que existe y que protege también archivos PHP dentro de la carpeta.
9. **Respaldos**: qué respaldo automático existe (fecha del último), si incluye BD, y cómo se restaura.
10. **Espacio y TLS**: espacio libre en disco y vigencia del certificado.

### Carpeta privada (`telemetry`) y carpeta pública (`telemetria`)

- **Privada** (fuera del document root, hermana de `public_html`): `telemetry/`, con `telemetry-config.php` (lo coloca Raúl; nunca está en Git) y el código de `server/telemetry/`.
- **Pública** (dentro de `public_html`): `telemetria/collect.php` y `telemetria-admin/`.
- Raúl descartó el acento en el nombre de la carpeta privada (mensaje de la sesión), con lo que no aplica el riesgo de normalización Unicode (NFC/NFD) ni de codificación en `file_exists`/`include`.
- En el repositorio no se escribe la ruta absoluta ni el usuario del hosting. La resolución es: (1) ruta esperada `dirname(DOCUMENT_ROOT)/telemetry/telemetry-config.php`; (2) si no, búsqueda acotada desde la carpeta de `collect.php`, sube hasta 5 niveles; en cada uno busca `telemetry/telemetry-config.php` (constante `CE_TELEMETRY_PRIVATE_DIR`, un solo valor por archivo público); acepta el primero que exista, sea legible y cuyo `realpath` **no** esté dentro de `$_SERVER['DOCUMENT_ROOT']`. Si no hay ninguno: 503 genérico, sin rutas, captura apagada.
- **Hecho (declarado vía captura de cPanel):** el document root es `/public_html`. **unknown:** el prefijo completo (truncado en la captura) y los permisos reales de `telemetry/`.

**Comprobaciones que debe hacer Raúl** (no se ejecutó ninguna petición contra producción):

1. Document root: declarado `/public_html` (captura de cPanel; prefijo truncado). Pendiente solo confirmar que `telemetry/` es hermana de `public_html`.
2. Repetir al publicar `https://creativosespacios.mx/telemetry/telemetry-config.php` (ya reportado 404 antes de colocar el archivo): debe dar **404** (ni contenido, ni 200, ni un 403 que muestre PHP). Si responde otra cosa, la carpeta está expuesta: no colocar el archivo hasta moverla.
3. Prueba de lectura desde `collect.php`: subir temporalmente a la carpeta pública `telemetria/` un `check-private.php` con este cuerpo, abrirlo una vez y borrarlo:

```php
<?php
header('Content-Type: text/plain');
$d = __DIR__;
for ($i = 0; $i < 5; $i++) {
    $d = dirname($d);
    $f = $d . '/telemetry/telemetry-config.php';
    echo $i . ' exists=' . var_export(file_exists($f), true) . ' readable=' . var_export(is_readable($f), true) . "\n";
}
```

   Debe haber una línea con ambos `true`. Permisos recomendados del archivo: 600 o 640.

### Si falta una capacidad

| Falta | Qué se hace |
|---|---|
| PHP o `pdo_mysql` | Se entrega el contrato (`src/telemetry/contract.json`) y el recolector; se propone un adaptador Node separado; no se migra el sitio |
| Cron | El importador, agregador y retención se ejecutan a mano (`operations.md`); el tablero muestra «actualización manual» |
| Logs de acceso | Solo se miden sesiones de navegador; crawlers = «sin cobertura». No se sustituye con píxel JavaScript |
| Directory Privacy | Se usa el modo `app` del tablero (contraseñas con hash, sesión segura, límite de intentos, CSRF) |
| Directorio privado fuera del document root | **No se publica**. No se deja código privado ni configuración dentro de `public_html` |

## Puntos comerciales en el código (SHA `aa12663`)

Inventario previo a la instrumentación, con archivo y línea. Contactos que **no son enlaces** (no se instrumentan porque no se pueden activar): el teléfono y el correo del pie de página (`src/components/Layout.tsx`, líneas 169 y 172) y el correo de Contacto (`src/pages/Contacto.tsx`, línea 341).

| Punto | Archivo:línea |
|---|---|
| WhatsApp, barra superior (escritorio, menú móvil) y botón flotante | `src/components/Navbar.tsx`:374, 505, 518 |
| Teléfono (`tel:`) | `src/pages/Contacto.tsx`:317 |
| Formulario de contacto (POST a `/formulario-creativosespacios.php`, respuesta JSON `success`) | `src/pages/Contacto.tsx`:51 (envío), 189 (formulario) |
| Cotizador lateral (abre WhatsApp con texto armado) | `src/components/commercial/DeliveryQuoteDrawer.tsx`:120 (apertura), 201 (formulario), 352-358 (botón) |
| Tarjeta de oferta, botón «Solicitar Cotización» | `src/components/commercial/ContainerOfferCard.tsx`:76-81 |
| CTA hacia WhatsApp (`ctaWhatsApp`) en páginas de producto y de intención | `CompraContenedoresCDMX`:125,269; `Contenedor20PiesCDMX`:127; `Contenedor40HighCubeCDMX`:127; `Contenedor40PiesCDMX`:127; `ContenedoresAlmacenamientoCDMX`:137,144,328; `ContenedoresBodegaCDMX`:128,135; `ContenedoresDataCenterCDMX`:140,147,326; `ContenedoresObraCDMX`:128,135,356; `ContenedoresUsadosCDMX`:125,252; `OficinaSupervisionObraCDMX`:151,390,396; `OficinasMovilesCDMX`:127,323; `ProveedorContenedoresCDMX`:178,185,392,514,520; `ProyectosRealizados`:393,543; `RentaContenedoresCDMX`:125,204,295 (todas en `src/pages/`) |
| CTA hacia el cotizador (abre el panel) | `Home.tsx`:136,295; `ContenedoresOneTripCDMX.tsx`:168,171,288,385,386; `src/components/commercial/OneTripIntentLanding.tsx`:187,248,278,353 |
| CTA hacia `/contacto/` | `CompraContenedoresCDMX`:124,246,273; `Contenedor20PiesCDMX`:126,290; `Contenedor40HighCubeCDMX`:126,317; `Contenedor40PiesCDMX`:126,252,331; `ContenedoresUsadosCDMX`:124,251; `RentaContenedoresCDMX`:124,299 |
| Enlaces `wa.me` directos | `Nosotros.tsx`:159,272; `Blog.tsx`:362; `BlogPost.tsx`:353 |
| WhatsApp con `window.open` desde tarjetas | `Oficinas.tsx`:226; `Proyectos.tsx`:207 |
| Filtros o búsqueda propios del sitio | **No existen** en el código (el blog tiene una lista de etiquetas, `Blog.tsx`:100, que son enlaces de navegación). No se inventan `filter_change` ni `search_submit`: quedan definidos en el contrato sin instrumentar |

Observación: el número de WhatsApp del `JSON-LD` en `Layout.tsx` (líneas 45 y 80) está duplicado en el JSX en lugar de leerse de `organization.json`; no se tocó (fuera de alcance, ver hallazgos).
