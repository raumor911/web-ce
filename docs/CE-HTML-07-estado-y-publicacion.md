# CE-HTML-07 — Estado de HostGator y publicación conservadora

Registro de la intervención del 21 de octubre de 2026. Base de código: `fix/ce-html-qa-minimal`, SHA `9cdcda0257ae50d72389a6748d1fce65922b2844`. Este documento distingue código, paquete local y estado público; no acredita una publicación íntegra ni una reparación del blog.

## Cambio de Apache versionado

`public/.htaccess` incorpora el archivo completo preparado y entregado para aplicación manual. Preserva la exclusión de `/blog-admin`, el fallback de `/blog/` y las cinco redirecciones heredadas; adelanta la excepción de `/soluciones` antes de comprobar directorios físicos y aplica 404 fuera de los casos válidos. No cambia DirectorySlash, PHP, WordPress ni bases de datos.

SHA-256 del archivo preparado: `99eea89d05a00cc416d0590698c01fb94f148a64aa0833b3aa792b6f33c452a6`. El texto pegado por el operador coincidió byte por byte. El sondeo posterior mostró comportamiento compatible, pero no se descargó de nuevo el archivo activo para demostrar identidad de bytes.

La copia versionada normaliza únicamente dos espacios finales de línea; conserva las mismas reglas. SHA-256 de `public/.htaccess` en esta rama: `4f6f6b47dbd32790842b9a0109031e6dfa4e453646d338cfaf95feb83e1f274f`. Las 52 pruebas existentes pasaron nuevamente en esta copia aislada; las 88 pruebas Apache se ejecutaron previamente sobre el candidato entregado, equivalente salvo esos espacios. No se repitió un build completo ni un despliegue en esta actualización.

## Qué produjo el problema del blog

El índice y 15 artículos conservados piden `/assets/index--aEWjCtK.js` y `/assets/index-CVK6wYoU.css`. Ambos devolvieron 404 tras la publicación; el navegador mostró el blog sin estilos. Las páginas comerciales nuevas usan `/assets/index-CP-zKb2c.js` y `/assets/index-CAU9uG9S.css`, que sí respondieron correctamente. Es una incompatibilidad entre HTML conservado y assets disponibles, no una falla demostrada de la REST API ni una necesidad demostrada de actualizar React.

El operador identificó `index-xipR0hIE.js` e `index-BPmu6Ekc.css` como los assets de su respaldo `dist 7`. Sus nombres tampoco coinciden con los pedidos por el blog. No se demostró que sean compatibles ni se deben renombrar a ciegas. Hay evidencia de distintas compilaciones, pero no permite determinar cuándo se introdujeron todas las referencias ni afirmar quién borró archivos. Conservar carpetas HTML por sí solo no protege sus dependencias compartidas.

`robots.txt` y `/formulario-creativosespacios.php` también respondieron 404 durante el primer sondeo posterior; el paquete selectivo los excluía y requería conservarlos. Tras restauración comunicada por el operador, la comprobación de las 22:39 UTC verificó robots 200 (131 bytes) y PHP 405 JSON al GET, como antes. Esto acredita disponibilidad y rechazo de GET; no acredita entrega de correo. No se enviaron formularios.

## Evidencia y dictamen

- Build alternativo local CUA/IAB: 47 capturas, 18 artículos, sitemap completo de 44 URLs y verificador original 47/47. El prerender nativo Puppeteer no pudo arrancar por restricciones del entorno; no se presenta como aprobado.
- ZIP selectivo nuevo: `CE-HTML-07-IAB-SELECTIVE-NOT-DEPLOYED.zip`, 80 archivos, 31,290,166 bytes. SHA-256 `18919c061c171f8c8ae41d8c6c3598369413ed33d12cd61e439bfe7f1018da0e`. Contiene sitemap selectivo de 41 URLs; excluye blog, blog-admin, PHP, robots y .htaccess. Su nombre describe el estado al crearlo, no el estado posterior del hosting. No es el ZIP histórico SHA `402b6b...`.
- Apache aislado: 88/88 casos con la copia aportada como base y el candidato entregado. Se usaron contenido y API/PHP simulados: no acredita el runtime de HostGator.
- Producción: rutas comerciales con title/H1/canonical sin ejecutar JS; URL inexistente con 404 real; HTTPS/apex y cinco redirecciones heredadas sin bucles; sitemap 41; ambas formas REST con 18 artículos.
- Comparación de bytes: 47 archivos muestreados del paquete coincidieron por SHA-256; no se comprobaron los 80 destinos.
- Bloqueo abierto: blog sin los dos assets referenciados. Los tres artículos que antes usaban fallback siguen sin HTML inicial propio. Persiste barra final de directorios físicos frente a canonical sin barra.
- Dependencias: sin cambios. La revisión previa identificó dos alertas altas asociadas al mismo GHSA-qwww-vcr4-c8h2, condicionado a APIs RSC experimentales; el código revisado usa BrowserRouter y no se encontró RSC. No equivale a una auditoría exhaustiva nueva ni a eliminar la alerta.

Estado: páginas comerciales disponibles y HTML/404 mejorados; robots y PHP restaurados según sondeo; blog pendiente. No declarar el sitio completamente saludable. Esta actualización Git no despliega archivos en HostGator ni resuelve los assets ausentes.

## Publicaciones futuras: preservar el conjunto de dependencias

1. Trabajar desde un SHA exacto y un build íntegro. El empaquetador genérico `scripts/package-hostgator.mjs` no es el empaquetador selectivo especial de CE-HTML-07: incluye el blog generado y robots. No usarlo bajo una autorización que prohíba escribir esos destinos.
2. Inventariar destinos reales en cPanel. Respaldar los archivos a sustituir fuera de `public_html`, con tamaños y hashes, y registrar qué rutas son nuevas. HTTP 200 no acredita existencia física cuando hay fallback.
3. Para HTML que se conserve, leer referencias script, stylesheet, imágenes y módulos, resolver sus URLs y exigir disponibilidad y tipo de contenido correctos. Preservar todos los assets aún referenciados; nunca reemplazar la carpeta `assets` completa ni usar eliminación por sincronización.
4. Extraer solo archivos permitidos del manifiesto, combinándolos con los existentes. La ausencia de un archivo en el ZIP no es autorización para borrarlo. Conservar robots, PHP y los árboles protegidos; comparar Apache y autorizar su diff por separado.
5. No dejar ZIP, respaldos ni mapas de código públicos. No modificar el blog protegido para ajustar nombres sin autorización y una prueba de compatibilidad.
6. Después de publicar, comprobar por HTTP y navegador: páginas comerciales, blog e índice/artículo, CSS/JS de ambos, imágenes, dos rutas REST, robots, sitemap y 404 real. GET al formulario debe devolver el rechazo esperado; el envío y el correo necesitan una prueba separada autorizada.
7. Si faltan archivos, detener cambios y recuperar las copias exactas del respaldo. Revertir solo destinos verificados; no borrar carpetas enteras ni restaurar una compilación distinta encima del sitio.

Los controles sobre assets conservados deben cerrarse antes de aprobar un próximo despliegue. Este registro no sustituye el respaldo ni contiene credenciales, PHP productivo, sesiones de cPanel o ZIP binarios.
