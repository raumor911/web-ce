# Integración de ramas pendientes — 21 de octubre de 2026

Solicitud expresa del propietario: fusionar las ramas pendientes para preparar una única fuente para la próxima compilación. Base main: `99afc112fc41b38b21608514274e36b47c516a59`; QA `9cdcda0` ya era ancestro de main.

## Ramas revisadas

| Rama | Resolución |
|---|---|
| fix/ce-html-07-hostgator-state | Reglas Apache y registro CE-HTML-07 integrados |
| feature/one-trip-intent-landings (PR5) | One Trip comercial/LLMO y compiler integrados; conflictos de artefactos regenerados desde fuentes |
| feature/one-trip-landing-quote-flow | Historial integrado; conservar flujo actual; el único conflicto era una línea vacía entre elementos ya limpiados |
| public-offer | Fuentes trasladadas a head HTML; inventario de esa rama integrado (6/3/2, fecha declarada 2026-10-09, no verificación nueva); artefactos regenerados |
| fix/ce-html-04-wordpress-sitemap | Historial integrado conservando implementación actual ya incluida; no volver al orden incorrecto de espera de articleBody |
| chore/ce-html-06-hostgator-release | Historial integrado conservando empaquetador corregido: sintaxis, realpath y pruebas adicionales |
| sft | Historial integrado conservando implementación actual: PHP idéntico, envío ya integrado; evitar reemplazar SEO/canonical por versión antigua y evitar checkout anidado web-ce |
| PR1 surftware/web-ce:surftware | Historial integrado con misma resolución del formulario; conservar lockfile actual y no incorporar ZIP binario histórico |
| audit/ce-html-01-baseline, audit/ce-html-05-apache-urls, blog, fix/ce-html-02-prerender-failfast, fix/ce-html-qa-minimal, test/ce-html-03-dist-integrity | Ya ancestros de main; no necesitan otra aplicación |

Los cuatro historiales superados se fusionaron con resolución de conservación del árbol actual, documentada por rama. No se afirma que sus versiones antiguas reemplazaran el código moderno. PHP, Contacto.tsx, package.json, lockfile, prerender y empaquetador conservan bytes exactos de main. No se borran ramas.

## Validación local

- 52/52 pruebas existentes aprobadas.
- Semantic Core, generación y validación de artefactos aprobadas.
- TypeScript aprobado; Vite produjo el bundle. Aviso de tamaño JS superior a 500kB sin error.
- Dependencias reutilizadas del lockfile previamente instalado, comprobado idéntico; no nuevo npm ci ni actualizaciones.
- Sin marcadores de conflicto. No se repitió prerender de 47 rutas ni se generó un ZIP de publicación de este árbol integrado: eso corresponde a la siguiente fase.

Esta integración no modifica HostGator y no repara por sí sola el blog productivo. El próximo paquete debe generarse íntegramente desde el SHA final de main e incluir HTML del blog y todos los assets correspondientes, con respaldo y autorización de publicación separados. No subir el dist parcial creado durante la comprobación Vite.
