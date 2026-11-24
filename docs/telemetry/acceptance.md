# Telemetría CE: aceptación, resultados reales y límites

Regla de este documento: solo se declara «pasó» lo que se ejecutó, con su momento. **Raúl pidió después detener toda ejecución de pruebas y builds**; lo no ejecutado se marca como «implementado, sin verificar».

## Ejecutado (antes de la instrucción de detener pruebas)

| Qué | Resultado observado | Notas |
|---|---|---|
| Pruebas unitarias del cliente (`npm run test:telemetry`, Node 24) | 113 de 113 pasaron, tras la corrección de abajo | Cubren esquema compartido, consentimiento, rutas, bfcache, atribución, scroll, engagement, sesión, cola, transporte y privacidad |
| `npx tsc -b --noEmit` | Sin salida de error tras la corrección | Una sola ejecución |
| Prueba de navegador (`e2e.browser.mjs`, Puppeteer 1.20 + Chrome local, servidor simulado) | Primera corrida: 3 de 9. Última corrida: **7 de 9 pasaron; 2 fallan** (`granted` y `transporte`) | Causa de esas dos **sin diagnosticar** (puede ser del arnés o del código). Una depuración manual mostró que el colector simulado recibe el lote tras dos 503 |
| Línea base de `main` | Se construyó y se guardaron 99 hashes de `dist/` en el área temporal | La comparación contra la rama **no se hizo** |

### Defecto real encontrado por la prueba de navegador y corregido (commit `ccc1468`)

Con la preferencia ya en `granted` al cargar, el colector se activaba antes de existir y el bundle de producción fallaba al iniciar (error de inicialización, pantalla en blanco). Las pruebas unitarias no lo detectaron porque su arnés no usaba el colector al adjuntar; se corrigió el orden y el arnés ahora lo ejercita. **Riesgo real:** con la bandera encendida y la preferencia concedida este defecto habría roto el sitio entero; es el motivo para exigir la prueba de navegador antes de encender la bandera.

### Artefactos de la prueba de navegador (no son defectos del producto)

La intercepción de peticiones de Puppeteer cancela los `sendBeacon` al descargar la página (se sustituyó por una regla del resolvedor); Puppeteer 1.20 no maneja la navegación atrás con bfcache (la restauración se cubre en pruebas unitarias); el desplazamiento suave de CSS retrasaba `scrollTo`; el user-agent de escritorio hacía que la emulación móvil se clasificara como escritorio.

## Implementado, sin verificar (no se ejecutó nada de esto)

- Todo el PHP (`server/telemetry/**`, `public/telemetria*/`): **ni siquiera `php -l`** (no hay PHP en esta máquina).
- Pruebas PHP escritas (`server/telemetry/tests/`: contrato compartido, crawlers, importador, migraciones, tablero) y pruebas con base de datos (se omiten sin `CE_TEST_DSN`).
- `scripts/telemetry/verify-telemetry-dist.mjs` y su prueba; `build-release-package.mjs`; `gen-docs.mjs` (este último sí se ejecutó una vez para generar `event-catalog.md`, sin errores ni incoherencias reportadas).
- `npm run build` con las integraciones (la auditoría nueva está encadenada al final del build y **nunca corrió**: un falso positivo rompería el build; revisarlo primero).
- Que el bundle con la bandera apagada no contenga el runtime (árbol sacudido): **hipótesis**, no confirmada.
- Peso del bundle, equivalencia de `dist/` con la línea base, `test:verify-dist`, `test:robots`, `test:urls`.
- Conformidad línea por línea con las 21 secciones de la especificación.

## Criterios de aceptación para Raúl (antes de encender cualquier bandera)

1. `php -l` limpio en todo `server/` y `public/telemetria*/`; pruebas PHP pasan; pruebas con BD desechable pasan.
2. `npm run build` termina con exit 0 y `dist/` equivale a la línea base salvo `telemetria/` y `telemetria-admin/`; auditoría de dist sin hallazgos.
3. Prueba de navegador completa (9 de 9) con la bandera encendida en un entorno local, y diagnosticadas las dos fallas pendientes.
4. Comprobaciones de cPanel de `hosting-evidence.md` resueltas.
5. Decisión sobre la interfaz de consentimiento y la política de privacidad.
6. Revisión de código y seguridad por Raúl (A-035): esta es autorrevisión, no revisión independiente.
