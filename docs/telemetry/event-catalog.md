# Telemetría CE: catálogo de eventos y mapa de IDs

Generado por `scripts/telemetry/gen-docs.mjs` desde `src/telemetry/contract.json` y `src/telemetry/elements.json`. No editar a mano.

## Eventos

| Evento | Propiedades obligatorias | Opcionales |
|---|---|---|
| `page_view` | — | `previous_path` (path), `landing_source` (host), `utm_source` (utm), `utm_medium` (utm), `utm_campaign` (utm), `device_class` (enum:device_class) |
| `navigation_click` | `element_id` (element), `destination_path` (path), `placement` (enum:placement) | — |
| `contact_click` | `channel` (enum:channel), `intent` (enum:intent), `element_id` (element), `placement` (enum:placement) | `product_id` (id) |
| `quote_click` | `element_id` (element), `placement` (enum:placement) | `product_id` (id), `solution_id` (id) |
| `inventory_view` | `product_id` (id) | `category_id` (id) |
| `filter_change` | `filter_id` (id), `option_id` (id), `result_count` (count) | — |
| `search_submit` | `search_category` (id), `result_count` (count) | — |
| `form_start` | `form_id` (enum:form_id) | — |
| `form_submit_attempt` | `form_id` (enum:form_id) | — |
| `form_submit_success` | `form_id` (enum:form_id) | — |
| `form_submit_error` | `form_id` (enum:form_id), `error_code` (enum:error_code) | — |
| `scroll_depth` | `percent` (enum:percent) | — |
| `engagement` | `active_ms` (active_ms) | — |

## Enumeraciones

- `channel`: `whatsapp`, `phone`, `email`
- `intent`: `quote`, `availability`, `contact`
- `placement`: `navbar`, `floating`, `hero`, `body`, `final`, `footer`, `inventory`, `drawer`, `contact-page`, `blog`
- `form_id`: `contacto`
- `error_code`: `validation`, `network`, `server`, `rejected`, `unknown`
- `device_class`: `mobile`, `tablet`, `desktop`, `unknown`
- `percent`: `25`, `50`, `75`, `90`

## Límites

- `max_events_per_request` = 20
- `max_body_bytes` = 32768
- `max_path_length` = 512
- `max_id_length` = 64
- `max_utm_length` = 100
- `max_host_length` = 100
- `max_release_length` = 64
- `max_sequence` = 1000000
- `max_result_count` = 100000
- `engagement_max_ms` = 30000
- `clock_window_ms` = 86400000
- `queue_max_events` = 100
- `queue_max_bytes` = 262144
- `flush_events` = 10
- `flush_interval_ms` = 5000
- `retry_max` = 2
- `retry_max_age_ms` = 30000
- `session_idle_ms` = 1800000
- `engagement_idle_ms` = 60000
- `engagement_flush_ms` = 30000
- `inventory_visible_ratio` = 0.5
- `inventory_visible_ms` = 1000
- `route_settle_ms` = 50
- `utm_max_digit_run` = 6
- `rate_ip_per_min` = 60
- `rate_session_events_per_min` = 600
- `rate_global_per_min` = 120

## Mapa de IDs (82 elementos)

| ID | Evento | Ubicación | Canal | Intención | Puntos de uso (archivo:línea) |
|---|---|---|---|---|---|
| `navbar-whatsapp-desktop` | contact_click | navbar | whatsapp | availability | src/components/Navbar.tsx:375 |
| `navbar-whatsapp-mobile` | contact_click | navbar | whatsapp | availability | src/components/Navbar.tsx:506 |
| `floating-whatsapp` | contact_click | floating | whatsapp | contact | src/components/Navbar.tsx:519 |
| `footer-nav-soluciones-venta-renta` | navigation_click | footer | — | — | dinámico (`ceNav`) |
| `footer-nav-soluciones-oficinas` | navigation_click | footer | — | — | dinámico (`ceNav`) |
| `footer-nav-proyectos` | navigation_click | footer | — | — | dinámico (`ceNav`) |
| `footer-nav-blog` | navigation_click | footer | — | — | dinámico (`ceNav`) |
| `footer-nav-privacidad` | navigation_click | footer | — | — | dinámico (`ceNav`) |
| `footer-nav-terminos` | navigation_click | footer | — | — | dinámico (`ceNav`) |
| `inventory-card-quote` | quote_click | inventory | — | — | src/components/commercial/ContainerOfferCard.tsx:80 |
| `drawer-whatsapp-submit` | contact_click | drawer | whatsapp | quote | src/components/commercial/DeliveryQuoteDrawer.tsx:355 |
| `one-trip-intent-hero-quote` | quote_click | hero | — | — | src/components/commercial/OneTripIntentLanding.tsx:188 |
| `one-trip-intent-format-quote` | quote_click | body | — | — | src/components/commercial/OneTripIntentLanding.tsx:249 |
| `one-trip-intent-final-quote` | quote_click | final | — | — | src/components/commercial/OneTripIntentLanding.tsx:354 |
| `one-trip-intent-offer-quote` | quote_click | inventory | — | — | src/components/commercial/OneTripIntentLanding.tsx:279 |
| `contacto-phone-link` | contact_click | contact-page | phone | contact | src/pages/Contacto.tsx:328 |
| `home-hero-quote` | quote_click | hero | — | — | src/pages/Home.tsx:137 |
| `home-final-quote` | quote_click | final | — | — | src/pages/Home.tsx:296 |
| `nosotros-pillars-whatsapp` | contact_click | body | whatsapp | quote | src/pages/Nosotros.tsx:160 |
| `nosotros-final-whatsapp` | contact_click | final | whatsapp | quote | src/pages/Nosotros.tsx:273 |
| `blog-final-whatsapp` | contact_click | blog | whatsapp | contact | src/pages/Blog.tsx:363 |
| `blog-post-final-whatsapp` | contact_click | blog | whatsapp | contact | src/pages/BlogPost.tsx:354 |
| `oficinas-solution-whatsapp` | contact_click | body | whatsapp | quote | src/pages/Oficinas.tsx:227 |
| `proyectos-solution-whatsapp` | contact_click | body | whatsapp | quote | src/pages/Proyectos.tsx:208 |
| `proyectos-realizados-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/ProyectosRealizados.tsx:394 |
| `proyectos-realizados-final-whatsapp` | contact_click | final | whatsapp | contact | src/pages/ProyectosRealizados.tsx:544 |
| `one-trip-hero-quote` | quote_click | hero | — | — | src/pages/ContenedoresOneTripCDMX.tsx:169 |
| `one-trip-hero-quote-alt` | quote_click | hero | — | — | src/pages/ContenedoresOneTripCDMX.tsx:172 |
| `one-trip-final-quote` | quote_click | final | — | — | src/pages/ContenedoresOneTripCDMX.tsx:386 |
| `one-trip-final-quote-alt` | quote_click | final | — | — | src/pages/ContenedoresOneTripCDMX.tsx:387 |
| `one-trip-offer-quote` | quote_click | inventory | — | — | src/pages/ContenedoresOneTripCDMX.tsx:289 |
| `compra-cdmx-hero-form-link` | quote_click | hero | — | — | src/pages/CompraContenedoresCDMX.tsx:125 |
| `compra-cdmx-body-form-link` | quote_click | body | — | — | src/pages/CompraContenedoresCDMX.tsx:247 |
| `compra-cdmx-final-form-link` | quote_click | final | — | — | src/pages/CompraContenedoresCDMX.tsx:274 |
| `compra-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/CompraContenedoresCDMX.tsx:126 |
| `compra-cdmx-final-whatsapp` | contact_click | final | whatsapp | quote | src/pages/CompraContenedoresCDMX.tsx:270 |
| `20ft-cdmx-hero-form-link` | quote_click | hero | — | — | src/pages/Contenedor20PiesCDMX.tsx:127 |
| `20ft-cdmx-final-form-link` | quote_click | final | — | — | src/pages/Contenedor20PiesCDMX.tsx:291 |
| `20ft-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/Contenedor20PiesCDMX.tsx:128 |
| `40hc-cdmx-hero-form-link` | quote_click | hero | — | — | src/pages/Contenedor40HighCubeCDMX.tsx:127 |
| `40hc-cdmx-final-form-link` | quote_click | final | — | — | src/pages/Contenedor40HighCubeCDMX.tsx:318 |
| `40hc-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/Contenedor40HighCubeCDMX.tsx:128 |
| `40ft-cdmx-hero-form-link` | quote_click | hero | — | — | src/pages/Contenedor40PiesCDMX.tsx:127 |
| `40ft-cdmx-body-form-link` | quote_click | body | — | — | src/pages/Contenedor40PiesCDMX.tsx:253 |
| `40ft-cdmx-final-form-link` | quote_click | final | — | — | src/pages/Contenedor40PiesCDMX.tsx:332 |
| `40ft-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/Contenedor40PiesCDMX.tsx:128 |
| `almacenamiento-cdmx-hero-whatsapp-quote` | contact_click | hero | whatsapp | quote | src/pages/ContenedoresAlmacenamientoCDMX.tsx:138 |
| `almacenamiento-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/ContenedoresAlmacenamientoCDMX.tsx:145 |
| `almacenamiento-cdmx-final-whatsapp` | contact_click | final | whatsapp | quote | src/pages/ContenedoresAlmacenamientoCDMX.tsx:329 |
| `bodega-cdmx-hero-whatsapp-quote` | contact_click | hero | whatsapp | quote | src/pages/ContenedoresBodegaCDMX.tsx:129 |
| `bodega-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/ContenedoresBodegaCDMX.tsx:136 |
| `data-center-cdmx-hero-whatsapp-quote` | contact_click | hero | whatsapp | quote | src/pages/ContenedoresDataCenterCDMX.tsx:141 |
| `data-center-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/ContenedoresDataCenterCDMX.tsx:148 |
| `data-center-cdmx-final-whatsapp` | contact_click | final | whatsapp | quote | src/pages/ContenedoresDataCenterCDMX.tsx:327 |
| `obra-cdmx-hero-whatsapp-quote` | contact_click | hero | whatsapp | quote | src/pages/ContenedoresObraCDMX.tsx:129 |
| `obra-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/ContenedoresObraCDMX.tsx:136 |
| `obra-cdmx-final-whatsapp` | contact_click | final | whatsapp | quote | src/pages/ContenedoresObraCDMX.tsx:357 |
| `usados-cdmx-hero-form-link` | quote_click | hero | — | — | src/pages/ContenedoresUsadosCDMX.tsx:125 |
| `usados-cdmx-final-form-link` | quote_click | final | — | — | src/pages/ContenedoresUsadosCDMX.tsx:252 |
| `usados-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/ContenedoresUsadosCDMX.tsx:126 |
| `usados-cdmx-final-whatsapp` | contact_click | final | whatsapp | contact | src/pages/ContenedoresUsadosCDMX.tsx:253 |
| `supervision-obra-cdmx-hero-whatsapp-quote` | contact_click | hero | whatsapp | quote | src/pages/OficinaSupervisionObraCDMX.tsx:152 |
| `supervision-obra-cdmx-final-whatsapp` | contact_click | final | whatsapp | contact | src/pages/OficinaSupervisionObraCDMX.tsx:391 |
| `supervision-obra-cdmx-final-whatsapp-alt` | contact_click | final | whatsapp | contact | src/pages/OficinaSupervisionObraCDMX.tsx:397 |
| `oficinas-moviles-cdmx-hero-whatsapp-quote` | contact_click | hero | whatsapp | quote | src/pages/OficinasMovilesCDMX.tsx:128 |
| `oficinas-moviles-cdmx-final-whatsapp` | contact_click | final | whatsapp | quote | src/pages/OficinasMovilesCDMX.tsx:324 |
| `proveedor-cdmx-hero-whatsapp-quote` | contact_click | hero | whatsapp | quote | src/pages/ProveedorContenedoresCDMX.tsx:179 |
| `proveedor-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/ProveedorContenedoresCDMX.tsx:186 |
| `proveedor-cdmx-body-whatsapp` | contact_click | body | whatsapp | quote | src/pages/ProveedorContenedoresCDMX.tsx:393 |
| `proveedor-cdmx-final-whatsapp-quote` | contact_click | final | whatsapp | quote | src/pages/ProveedorContenedoresCDMX.tsx:515 |
| `proveedor-cdmx-final-whatsapp` | contact_click | final | whatsapp | contact | src/pages/ProveedorContenedoresCDMX.tsx:521 |
| `renta-cdmx-hero-form-link` | quote_click | hero | — | — | src/pages/RentaContenedoresCDMX.tsx:125 |
| `renta-cdmx-final-form-link` | quote_click | final | — | — | src/pages/RentaContenedoresCDMX.tsx:300 |
| `renta-cdmx-hero-whatsapp` | contact_click | hero | whatsapp | contact | src/pages/RentaContenedoresCDMX.tsx:126 |
| `renta-cdmx-body-whatsapp` | contact_click | body | whatsapp | quote | src/pages/RentaContenedoresCDMX.tsx:205 |
| `renta-cdmx-final-whatsapp` | contact_click | final | whatsapp | quote | src/pages/RentaContenedoresCDMX.tsx:296 |
| `navbar-nav-proyectos` | navigation_click | navbar | — | — | dinámico (`ceNav`) |
| `navbar-nav-nosotros` | navigation_click | navbar | — | — | dinámico (`ceNav`) |
| `navbar-nav-contacto` | navigation_click | navbar | — | — | dinámico (`ceNav`) |
| `navbar-nav-blog` | navigation_click | navbar | — | — | dinámico (`ceNav`) |
| `navbar-nav-soluciones-venta-renta` | navigation_click | navbar | — | — | dinámico (`ceNav`) |
| `navbar-nav-soluciones-oficinas` | navigation_click | navbar | — | — | dinámico (`ceNav`) |

## Llamadas dinámicas

- `ceNav(...)` (arma el ID con ubicación y ruta destino): src/components/Layout.tsx:146, src/components/Layout.tsx:151, src/components/Layout.tsx:156, src/components/Layout.tsx:161, src/components/Layout.tsx:190, src/components/Layout.tsx:193, src/components/Navbar.tsx:334, src/components/Navbar.tsx:361, src/components/Navbar.tsx:470, src/components/Navbar.tsx:494
- `ceInventory(...)` (fichas visibles): src/components/commercial/ContainerOfferCard.tsx:29

## Rutas conocidas (`route_id`)

- `/` → `home`
- `/nosotros/` → `nosotros`
- `/soluciones/venta-renta/` → `venta-renta`
- `/soluciones/oficinas/` → `oficinas`
- `/proyectos/` → `proyectos`
- `/proyectos-realizados-contenedores-modulares/` → `proyectos-realizados`
- `/contacto/` → `contacto`
- `/blog/` → `blog`
- `/compra-contenedores-cdmx/` → `compra-cdmx`
- `/contenedores-nuevos-one-trip-cdmx/` → `one-trip-cdmx`
- `/contenedor-one-trip-20-pies-cdmx/` → `one-trip-20ft-cdmx`
- `/contenedor-one-trip-40-high-cube-cdmx/` → `one-trip-40hc-cdmx`
- `/contenedores-one-trip-para-proyectos-arquitectonicos-cdmx/` → `one-trip-architecture-cdmx`
- `/contenedores-one-trip-para-escuelas-cdmx/` → `one-trip-schools-cdmx`
- `/contenedores-one-trip-para-proyectos-corporativos-cdmx/` → `one-trip-corporate-cdmx`
- `/renta-contenedores-cdmx/` → `renta-cdmx`
- `/contenedores-usados-cdmx/` → `usados-cdmx`
- `/contenedor-20-pies-cdmx/` → `20ft-cdmx`
- `/contenedor-40-pies-cdmx/` → `40ft-cdmx`
- `/contenedor-40-high-cube-cdmx/` → `40hc-cdmx`
- `/contenedores-para-almacenamiento-cdmx/` → `almacenamiento-cdmx`
- `/contenedores-para-bodega-cdmx/` → `bodega-cdmx`
- `/contenedores-para-obra-cdmx/` → `obra-cdmx`
- `/oficinas-moviles-cdmx/` → `oficinas-moviles-cdmx`
- `/oficina-para-supervision-de-obra-cdmx/` → `supervision-obra-cdmx`
- `/proveedor-de-contenedores-cdmx/` → `proveedor-cdmx`
- `/contenedores-para-data-center-cdmx/` → `data-center-cdmx`
- `/privacidad/` → `privacidad`
- `/terminos/` → `terminos`
- `/404/` → `not-found`
