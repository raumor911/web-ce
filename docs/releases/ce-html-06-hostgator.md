# CE-HTML-06 — Paquete HostGator seguro y reversible

**Estado:** herramienta local disponible en la rama chore/ce-html-06-hostgator-release. No se ha generado un paquete de producción ni se ha realizado un despliegue en HostGator.

## Decisión de diseño

El proyecto usa Vite + prerenderizado y publica manualmente los archivos de dist dentro de public_html. El directorio public también contiene .htaccess y formulario-creativosespacios.php. Subir todo dist sin filtrarlo podría reemplazar las reglas Apache activas o un endpoint PHP en servicio.

**Solución de menor complejidad:** reutilizar el build existente y las verificaciones de CE-HTML-03/04; seleccionar solamente artefactos estáticos, crear un ZIP con rutas relativas desde la raíz de dist, verificar sus entradas y emitir manifest y hashes SHA-256. No instalar dependencias npm, configurar FTP/SSH ni automatizar el despliegue.

Se descartan el borrado de public_html, rsync --delete, subir la carpeta dist como subcarpeta, alterar .htaccess, administrar WordPress y copiar PHP como parte de este proceso.

## Dependencias y reglas fail-closed

Antes de usar el paquete se deben integrar y validar las mejoras:

- CE-HTML-02: prerender falla cuando alguna ruta no se captura.
- CE-HTML-03: scripts/verify-dist.mjs, sus pruebas y el gate final del build.
- CE-HTML-04: scripts/wordpress-build-posts.js, pruebas y el sitemap basado en la misma lista de artículos capturados.
- CE-HTML-05: auditar externamente redirecciones, URLs y Apache. La herramienta de empaquetado no sustituye ese diagnóstico y no inspecciona el archivo activo en HostGator.

El comando de empaquetado bloquea la operación cuando no existen los archivos necesarios de 03/04; ejecuta las pruebas locales, corre npm run build y verifica nuevamente dist. Cualquier salida no cero detiene el paquete. Estas validaciones no prueban que WordPress, PHP o Apache funcionen en HostGator; esas verificaciones siguen siendo manuales.

**La rama original de CE-HTML-06 NO incluye por sí sola CE-HTML-03 ni CE-HTML-04.** Es necesario integrarlas y superar un build íntegro antes de utilizar el comando.

## Comandos

Requisitos: Node.js 18+, npm, Git y comandos del sistema zip/unzip. Trabajar en un checkout del repositorio con sus dependencias instaladas y conectividad a WordPress para el build.

Probar solo el empaquetador con fixtures aislados, sin tocar producción:

    node --test scripts/package-hostgator.test.mjs

Generar el paquete después de integrar las dependencias:

    node scripts/package-hostgator.mjs

No se admiten opciones para saltarse las comprobaciones. No emplear dist.zip ni dist 2.zip históricos.

El resultado se guarda fuera de dist en el directorio local e ignorado por Git release-artifacts/:

- ce-hostgator-FECHA-COMMIT.zip: contiene index.html, 404.html, carpetas comerciales, assets, sitemap.xml, robots.txt, etc., **directamente en la raíz del ZIP**, no dentro de una carpeta dist/.
- ce-hostgator-FECHA-COMMIT.manifest.json: commit, fecha, SHA-256 del ZIP, rutas, cantidad de URLs, exclusiones y lista completa de archivos con tamaño y SHA-256.
- ce-hostgator-FECHA-COMMIT.sha256: suma para verificar el ZIP después de transferirlo (en macOS: shasum -a 256 -c nombre.sha256).

Se revisa el ZIP con unzip y se comprueba que su listado coincida exactamente con los archivos seleccionados. No se sobrescribe un artefacto de release previo.

**Exclusiones deliberadas:** .htaccess en cualquier nivel; PHP, phtml y phar; blog-admin, wp-* y cgi-bin; secretos y archivos ocultos inesperados; symlinks; .map, respaldos, logs y archivos de base de datos. El empaquetador falla ante archivos ocultos que puedan contener datos temporales sensibles.

**Atención a formularios:** formulario-creativosespacios.php se excluye del ZIP. Debe confirmarse que su copia activa existe y funciona en HostGator ANTES de sustituir el frontend.

## Procedimiento de publicación manual y recuperación

1. **Aprobación previa:** registrar commit de código y resultado de las pruebas; revisar manifiesto y hash del ZIP, y confirmar que el formulario PHP, el blog y las rutas críticas funcionan en producción.
2. **Respaldo confiable:** generar un respaldo completo del hosting usando la herramienta del proveedor. Al menos copiar cada archivo que el manifiesto pueda sobrescribir y registrar las rutas destino que no existen todavía. Conservar una copia separada del .htaccess activo y de WordPress/PHP. Almacenar respaldos **fuera** del directorio público.
3. **Comparar Apache:** obtener el .htaccess activo, contrastarlo con public/.htaccess, confirmar redirecciones, exclusiones y módulos de HostGator. No reemplazar automáticamente el archivo activo. Un cambio de Apache sería otra intervención con autorización explícita.
4. **Transferencia manual:** subir ZIP por el método que permita el proveedor; comprobar el SHA-256 en destino y extraer **su contenido** directamente en public_html. Nunca extraer en public_html/dist, borrar carpetas enteras, usar sincronización destructiva ni dejar el ZIP públicamente accesible.
5. **Smoke tests después de extraer:** comprobar /, /compra-contenedores-cdmx, /contenedor-20-pies-cdmx, /oficina-para-supervision-de-obra-cdmx, /blog y al menos un artículo; HTTP inicial, title, H1, canonical, 404 real, recursos CSS/JS, sitemap.xml, robots.txt y versiones con/sin barra. Comprobar legacy redirect /catalogo, PHP de cotización, API de WordPress y /blog-admin/.
6. **Rollback al detectar defecto:** detener cambios. Restaurar **solamente** los archivos existentes que fueron reemplazados. Eliminar únicamente archivos nuevos que el manifiesto identifica como creados en esta publicación y confirmados como inexistentes antes de ella. Nunca borrar directorios completos ni tocar PHP, .htaccess o WordPress. Repetir pruebas de humo.
7. **Registro:** fecha/hora, SHA del commit, nombre y hash del ZIP, cambios de archivos, responsable, resultado por ruta y cualquier rollback. Conservar temporalmente los respaldos de acuerdo con la política del hosting.

## Definition of Done

- [x] En la rama: empaquetador de solo lectura respecto a producción, exclusiones críticas, formato ZIP a nivel raíz, manifiesto SHA-256 y pruebas locales.
- [ ] Integración de CE-HTML-03/04 con el build completo, con acceso a WordPress y Puppeteer.
- [ ] Confirmación del .htaccess activo y del estado de public_html; cierre de CE-HTML-05.
- [ ] Respaldo operativo y plan de reversión confirmados por el operador.
- [ ] Ejecución de smoke tests de HostGator tras un despliegue manual aprobado.

No dar por concluido un release real mientras alguno de los puntos pendientes esté abierto.
