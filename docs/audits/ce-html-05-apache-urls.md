# CE-HTML-05 — Auditoría de Apache y URLs canónicas

**Estado:** diagnóstico implementado en la rama audit/ce-html-05-apache-urls. No se ha modificado el archivo .htaccess.

**Referencias:** src/config/routes.json, public/sitemap.xml y public/.htaccess (copia versionada en Git). Todavía no se cuenta con el archivo .htaccess **activo** de public_html ni con la línea base definitiva de CE-HTML-01.

## Evidencia pública preliminar (21 de octubre de 2026)

La recuperación web, que puede utilizar caché, observa resultados diferentes:

- /compra-contenedores-cdmx/ y /nosotros/ aparecen redirigidos a rutas sin barra; el recuperador mostró título genérico, sin texto extraíble.
- /blog y /soluciones/venta-renta aparecen redirigidos a rutas con barra final, con contenido específico recuperable.
- No se pudo verificar con esa herramienta el estado HTTP exacto de /contenedor-20-pies-cdmx, /index.html, una ruta inexistente o /blog-admin/.

Estos resultados **no** prueban una regla Apache defectuosa. En la copia versionada, la normalización trailing slash usa una condición que excluye directorios físicos, mientras Vite genera carpetas con index.html. Una interacción con DirectorySlash de Apache es plausible, pero solo una hipótesis hasta comparar el archivo activo, el contenido físico de public_html y los códigos HTTP reales.

## Diseño elegido (mínima complejidad)

Agregar un comprobador Node.js de solo lectura y sin nuevas dependencias. Registra URL solicitada, saltos HTTP, URL final, código HTTP, título, H1 y canonical en el HTML inicial. Clasifica cada resultado como OK, OBSERVAR, DEFECTO o NO_VERIFICABLE. No ejecuta JavaScript ni publica archivos.

Descartados: rediseñar .htaccess, desactivar DirectorySlash globalmente, agregar reglas generales de redirección sin evidencia, cambiar React/Vite, instalar librerías de crawling.

## Ejecución

Node 18+; requiere conectividad desde el equipo que ejecute la prueba.

Auditoría representativa:

    node scripts/audit-apache-urls.mjs --output=/tmp/ce-html-05-representative.json

Cobertura completa de rutas estáticas y variantes con/sin slash, primer artículo del sitemap y pruebas especiales:

    node scripts/audit-apache-urls.mjs --full --output=/tmp/ce-html-05-full.json

Pruebas locales sin conexión:

    node --test scripts/audit-apache-urls.test.mjs

Códigos de salida: 0 = sin defectos ni inaccesibles; 1 = existe un defecto; 2 = una o más comprobaciones no verificables o argumentos inválidos. Las observaciones (OBSERVAR) no se confunden con un error definitivo. El informe opcional registra metadatos, no cuerpos completos o secretos.

## Comprobaciones incluidas

- Home, landings representativas, blog, ruta 404, rutas declaradas en manifiesto (modo --full).
- Versiones con/sin barra, /index.html y redirección antigua /catalogo.
- URL que no debe existir (se espera 404/410); robots.txt, favicon y disponibilidad superficial de /blog-admin/.
- HTML inicial sin JS: H1, title y canonical. No se interpreta HTTP 200 como éxito suficiente.
- Una ruta WordPress restringida (401/403) se marca para observación; no implica que el CMS esté roto ni verifica funcionalidad.

## Condiciones para editar Apache

1. Obtener una copia segura del .htaccess activo de public_html y respaldo de la instalación, conservando WordPress, PHP y configuraciones operativas.
2. Comparar archivo activo vs public/.htaccess, incluyendo diferencias de reglas, módulos, redirecciones y hash de archivos.
3. Ejecutar auditoría con conectividad y registrar fecha, commit, redirecciones y cabeceras HTTP. Complementar con pruebas manuales de http→https, www→sin www, redirecciones antiguas, WordPress REST, formularios PHP y recursos.
4. Contrastar ruta → HTML del dist **recién compilado** → archivo físico en public_html → respuesta de producción. Si falta un archivo publicado o dist es defectuoso, no cambiar Apache.
5. Solo ante fallo Apache reproducido: preparar el **diff mínimo** sobre una copia del archivo activo, plan de reversión y pruebas de regresión; obtener revisión y autorización antes de publicar.
6. Si Apache está correcto, cerrar la incidencia sin cambio de reglas. La herramienta permanece como diagnóstico reutilizable.

## Definition of Done

**Implementación local:** pruebas simuladas exitosas, script y documentación en rama, sin cambiar .htaccess, backend, frontend, ni producción.

**Pendiente para confirmar producción:** auditoría --full ejecutada con conexión real, comparación con .htaccess activo de HostGator, comprobación funcional de PHP/WordPress y clasificación documentada de causas. No declarar esa parte completada sin evidencia.
