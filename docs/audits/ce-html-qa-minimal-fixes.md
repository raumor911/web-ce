# CE-HTML — Correcciones mínimas posteriores a QA
Fecha: 2026-10-21. Rama de revisión: `fix/ce-html-qa-minimal`.

## Base y alcance
Base: main `3db67b7632ad4d08942b0261ac60b2b045673024`.
Se reúnen los cambios pendientes de CE-HTML-04 (`3603b2b96c7b44cfb8dc3684d3cf621399d3c340`) y CE-HTML-06 (`3ab3a2393772597c1e09a3ee8f8a8332097ac550`), sin reintegrar 02, 03 ni 05, ya presentes en main.

Los ocho archivos afectados por las ramas pendientes no cambiaron entre su base común `b2143586f761886cb3e3e960bada1edcd0af7422` y main: los existentes tienen el mismo blob y los nuevos están ausentes en ambos. Se aplican únicamente esas diferencias sobre el árbol de main. Se conserva su package.json con el gate final verify-dist, su lockfile y todo el código comercial. Esto no es un merge definitivo a main.

## Diseño y reflexión de riesgo
Se elige corregir los defectos de ejecución sin sustituir el pipeline ni ampliar sus reglas. Aumentar las pausas globales, relajar los controles o introducir otra fuente de datos agregaría riesgos sin resolver mejor los defectos observados.

1. **Empaquetador:** reparar el paréntesis adicional del condicional de entrada. Al ejecutar las pruebas se descubrió un segundo defecto: comparar path.resolve(argv[1]) con import.meta.url puede producir exit 0 sin ejecutar main cuando /tmp es un alias de /private/tmp o la entrada es un symlink. Comparar ambos archivos mediante fs.realpathSync conserva el comportamiento del import y ejecuta los controles desde cualquiera de esos caminos. Se reutiliza fs, sin dependencia nueva.
2. **Prerender de artículos:** mover la espera existente de articleBody antes de leer H1, title y canonical. Se mantienen el selector, timeout de 15 segundos, espera general de tres segundos y condiciones de rechazo. Las rutas comerciales no pasan por esa espera adicional.
3. **Pruebas:** añadir una regresión de CLI mediante symlink y comprobar tamaños, SHA-256 y bytes después de extraer un ZIP de fixture.
4. **CE-HTML-03:** conservar las reglas actuales. Su mínimo de artículos no se reduce para aprobar. La exactitud del conjunto de artículos y del texto de title/H1 sigue requiriendo contraste en el build real; no se amplía el verificador en esta intervención.

El impacto nuevo en producción se limita al orden de validación durante el build. El otro ajuste afecta a la herramienta local de empaquetado. No se alteran páginas, estilos, formularios, WordPress, PHP, Apache, Semantic Core, Knowledge Graph ni datos SEO/LLMO.

## Validación ejecutada
Entorno: macOS 26.5.2 ARM64, Node 24.12.0, npm 11.6.2, zip 3.0 y unzip 6.00 de Apple.

```sh
node --check scripts/prerender.js
node --check scripts/package-hostgator.mjs
node --test scripts/verify-dist.test.mjs scripts/wordpress-build-posts.test.mjs scripts/audit-apache-urls.test.mjs scripts/package-hostgator.test.mjs
```

Resultado: **52 pruebas, 52 exitosas, 0 fallidas** (03: 12; 04: 18; 05: 11; 06: 11).
Los ZIP de las pruebas son fixtures temporales y se eliminan; no son paquetes de producción.
Se verificaron estructura en raíz, exclusiones PHP/WordPress/.htaccess, rechazo de symlinks e instantáneas, integridad unzip, correspondencia de bytes/tamaños/hashes y conservación de artefactos previos.

Una prueba adicional sobre el bloque real de validación, con una página simulada, comprobó cuatro escenarios: el orden anterior rechaza un artículo aún cargando; el nuevo espera antes de leer metadatos; cuerpo vacío sigue fallando; ruta comercial no espera articleBody. No es una prueba de Puppeteer ni certifica las respuestas de WordPress.

## Bloqueos y límites
- git fetch se intentó nuevamente y falló con `Could not resolve host: github.com` (exit 128). La conexión GitHub sí permitió leer refs/árboles y publicar la rama. No se presenta el directorio parcial de pruebas como un checkout completo.
- No se ejecutaron npm ci ni el build completo de la aplicación: no hay checkout íntegro obtenido mediante Git y continúa el bloqueo de conectividad identificado durante QA.
- Se intentó arrancar Chromium con una instalación existente de Puppeteer, sin instalar dependencias: falló `Failed to launch the browser process`. No se certifica prerender real ni compatibilidad de esa instalación auxiliar con el lockfile del repositorio.
- No se generó un paquete HostGator de producción ni se inspeccionó el .htaccess activo. Las pruebas de fixtures no sustituyen esos controles.
- Continúa pendiente la auditoría HTTP de Apache y el funcionamiento del endpoint PHP activo.

## Cierre pendiente en un entorno con acceso
Hacer checkout de esta rama en un directorio limpio, ejecutar npm ci, las cuatro suites anteriores y después:

```sh
node scripts/package-hostgator.mjs
```

No hace falta compilar antes: el empaquetador ejecuta su build. Deben concordar 29 rutas configuradas de prerender más los artículos descubiertos y 26 rutas estáticas de sitemap más exactamente esos artículos. Revisar HTML inicial, ZIP/manifiesto, extracción/hash y conservación de archivos del hosting. Ante conflicto o fallo detenerse, sin relajar validaciones.

**Estado:** correcciones implementadas y pruebas aisladas aprobadas; aprobación integral de release pendiente. Main permanece intacta. No se abre PR ni se despliega HostGator.
