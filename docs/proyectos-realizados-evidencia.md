# Página «Proyectos realizados» — trazabilidad de evidencia

- **Ruta:** `/proyectos-realizados-contenedores-modulares`
- **Fuente:** `PROYECTOS_De Contenedor a Espacio_CE.pdf` (23 páginas). Solo existe esta copia en el equipo
  (`~/Downloads`); no se encontró la copia `(1)`.
- **Imágenes:** extraídas tal cual vienen incrustadas en el PDF (máx. 800 px de lado; no se reescalaron hacia arriba)
  y convertidas a WebP (calidad 82) en `public/images/proyectos-realizados/`.
  En la página 22 se recortó el marco negro; en las páginas 9 y 13 el PDF mostraba una versión recortada,
  aquí se usa la fotografía completa.
- **Omitidas:** logotipos de CE (págs. 1 y 23) e íconos de contacto. Ninguna foto se descartó por duplicada.
- **Datos:** `src/data/proyectosRealizados.ts`.

## Leyenda de certeza

| Nivel | Significado |
|---|---|
| **Alta** | El texto del PDF identifica el proyecto o la foto comparte página y pie con otras fotos del mismo grupo. |
| **Media** | Sin pie propio, pero hay evidencia visual concreta de que pertenece al grupo. Publicada como parte del caso. |
| **Sin proyecto** | El PDF no permite asignarla a un caso; se presenta como ejemplo por tipo de solución. |

## Imágenes por grupo

| Archivo (`.webp`) | Pág. | Grupo | Certeza | Nota |
|---|---|---|---|---|
| makerspace-santa-cruz-meyehualco-edificio-terminado | 1 | MakerSpace | Alta | Pie: «MakerSpace, Santa Cruz Meyehualco». También es la imagen de portada. |
| makerspace-…-estructura-tres-niveles | 2 | MakerSpace | Alta | Pie del PDF. |
| makerspace-…-contenedores-con-aberturas | 3 | MakerSpace | Alta | Pie del PDF. |
| makerspace-…-contenedor-pintura-en-patio | 3 | MakerSpace | Alta | Pie del PDF. |
| makerspace-…-interior-estructura-ventanas | 4 | MakerSpace | Alta | Pie del PDF. |
| makerspace-…-interior-instalaciones-muros | 5 | MakerSpace | Alta | Pie del PDF. |
| makerspace-…-estructura-sobre-columnas | 6 | MakerSpace | **Media** | Sin pie. Mismo edificio por escalones, columnas y muro rojo/blanco del fondo. |
| laboratorio-unam-omecca-contenedor-en-traslado | 7 | Laboratorio ICAyCC, UNAM | Alta | Pie: «Laboratorio para el Instituto de Ciencias de la Atmósfera y Cambio Climático, UNAM». |
| contenedor-acondicionado-puerta-abierta-exterior | 8 | Interiores acondicionados | Sin proyecto | Sin pie. Sigue a la pág. del laboratorio, pero el número de contenedor difiere del de la pág. 7; **no** se atribuye al laboratorio. |
| contenedor-acondicionado-interior-piso-antiderrapante-minisplit | 8 | Interiores acondicionados | Sin proyecto | Ídem. |
| contenedor-acondicionado-puerta-de-acceso-interior | 8 | Interiores acondicionados | Sin proyecto | Ídem. |
| oficinas-40-dc-proveedor-gas-natural-exterior | 9 | Oficinas, proveedor de gas natural industrial | Alta | Pie: 40′ DC; aislamiento térmico, piso vinílico y clima integrado. |
| oficina-contenedor-tablaroca-piso-azulejo-interior-a / -b | 10 | Acabados interiores | Sin proyecto | Pie: tablaroca, piso azulejo y clima. No coincide con los acabados de la pág. 9 (piso vinílico), por eso no se une a ese caso. |
| oficina-contenedor-20-dc-azul-exterior | 11 | Oficina 20′ DC azul | Alta | Pie: «Oficinas, contenedor de 20′ dc». |
| oficina-contenedor-20-dc-interior-piso-spc-a / -b / interior-minisplit-puerta | 12 | Oficina 20′ DC azul | **Media** | Mismo diseño geométrico de reja en ventanas que el contenedor azul de la pág. 11. Pie: aislante, plafón, piso SPC, instalación eléctrica, minisplit. |
| oficinas-tres-contenedores-40-hc-usados-exterior | 13 | Tres contenedores 40′ HC usados | Alta | Pie: unión de 3 contenedores 40′ HC usados; instalación eléctrica aparente. |
| oficinas-tres-contenedores-40-hc-usados-interior-a / -b | 14 | Tres contenedores 40′ HC usados | **Media** | Sin pie. Contenedores usados con canalización eléctrica aparente. |
| oficinas-tres-contenedores-40-hc-usados-trabajos-a / -b | 15 | Tres contenedores 40′ HC usados | **Media** | Sin pie. Mismos criterios; muestran trabajos en proceso. |
| contenedores-40-dc-hilera-de-unidades-con-puertas, contenedor-40-dc-interior-piso-vinilico-minisplit | 16 | Unidades 40′ DC en serie | Alta | Pie único «Contenedor de 40′ dc» para ambas fotos (misma página). |
| oficina-contenedor-20-dc-exterior-ventanas-con-reja | 17 | Oficina 20′ DC (exterior) | Alta | Pie: «Oficinas, contenedor de 20′ dc». |
| oficina-contenedor-20-dc-interior-lambrin-piso-pvc / -cocineta | 18 | Acabados interiores | Sin proyecto | Pie con acabados; no hay evidencia suficiente para unirlas al contenedor de la pág. 17. |
| oficina-contenedor-40-hc-ventanas-proyectables-exterior | 19 | Oficina 40′ HC con protecciones | Alta | Pie: 40′ HC con protecciones proyectables en ventanas. |
| oficina-contenedor-40-hc-interior-plafon-iluminado / -privado | 20 | Acabados interiores | Sin proyecto | Pie: acabados, piso cerámico, minisplit + privado. No se unen a la pág. 19 sin evidencia concluyente. |
| centro-capacitacion-movil-40-dc-exterior-remolque | 21 | Centro de capacitación móvil | Alta | Pie: «Centro de capacitación modular / móvil, contenedor de 40′ dc». |
| centro-capacitacion-movil-40-dc-aula-butacas / mobiliario-y-minisplit / interior-iluminacion-riel | 22 | Centro de capacitación móvil | Alta | Mismo pie que la pág. 21. Marco negro recortado. |

## Datos que requieren validación humana antes de publicar

1. **Autorización de nombres y marcas de clientes.**
   - Se nombra a la UNAM / ICAyCC (el PDF lo hace) y se menciona la rotulación OMECCA visible.
   - Se menciona «proveedor de gas natural industrial» sin nombre.
   - **Rótulos de clientes visibles en fotos** (no mencionados en el texto): *Concretos Reciclados* (pág. 19), logotipos del remolque del centro de capacitación (pág. 21).
     Si no hay autorización, retirar o recortar esas imágenes.
2. **MakerSpace:** confirmar el nombre público del proyecto, que se puede mencionar ubicación y que la pág. 6 es el mismo edificio.
3. **Número de niveles** («tres niveles») y que las fotos 2–5 son etapas del mismo inmueble: se deduce de la imagen, no del texto.
4. **Pág. 8 (interiores):** si se puede confirmar que pertenece al laboratorio, moverla al caso de la UNAM y añadir sus datos.
5. **Págs. 12, 14, 15 (grupos de certeza media):** confirmar que son el mismo proyecto que sus exteriores.
6. **Págs. 10, 18, 20:** confirmar a qué proyecto pertenecen y sus dimensiones; hoy se presentan como acabados sin proyecto asignado.
7. **Personas visibles** (págs. 5, 13, 14, 15): son pequeñas y no identificables; confirmar que es aceptable.
8. **Número visible en contenedores** (pág. 8: «0300 3095») y matrículas de camión (pág. 7): no se difuminaron.
9. **Fecha, plazos, costos y alcance:** el PDF no los trae y la página no los menciona.
10. **Textos editoriales** (introducciones, narrativas): redactados con base en lo documentado y lo visible; revisar tono y exactitud.
