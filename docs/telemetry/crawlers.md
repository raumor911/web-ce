# Telemetría CE: verificación de crawlers de IA

Catálogo versionado: `BotCatalog::RULES_VERSION = 2026-11-24.1` (`server/telemetry/src/Crawler/BotCatalog.php`).

## Qué se verificó y cuándo

**Hecho** (documentación oficial de cada proveedor, consultada el 2026-11-24 durante este desarrollo; no se descargaron los feeds ni se contactó a los proveedores desde los servidores de CE):

| Proveedor | Fuente consultada | Feeds de rangos IP usados |
|---|---|---|
| OpenAI | developers.openai.com/api/docs/bots | `openai.com/searchbot.json`, `gptbot.json`, `chatgpt-user.json`, `adsbot.json` |
| Anthropic | support.claude.com (artículo 8896518) | `claude.com/crawling/bots.json` |
| Perplexity | docs.perplexity.ai/docs/resources/perplexity-crawlers | `www.perplexity.ai/perplexitybot.json`, `perplexity-user.json` |
| Google | developers.google.com/crawling/docs/crawlers-fetchers/... | `developers.google.com/static/crawling/ipranges/` (common, special, user-triggered x3) |

**unknown:** si los feeds siguen vigentes en la fecha de publicación; el contenido real de cada feed (no se descargaron); si el hosting permite salidas HTTPS desde cron.

## Reglas

| Familia | Finalidad (por documentación del proveedor) | Verificación |
|---|---|---|
| OAI-SearchBot | `search` | IP contra `searchbot.json` |
| GPTBot | `training_crawl` | IP contra `gptbot.json` |
| ChatGPT-User | `user_triggered` | IP contra `chatgpt-user.json` |
| OAI-AdsBot | `other` | IP contra `adsbot.json` |
| Claude-SearchBot / ClaudeBot / Claude-User | `search` / `training_crawl` / `user_triggered` | IP contra `bots.json` |
| PerplexityBot / Perplexity-User | `search` / `user_triggered` | IP contra su feed |
| Googlebot, GoogleOther, AdsBot-Google, Storebot-Google, Google-InspectionTool, Google-CloudVertexBot | `search` / `other` | IP contra los feeds de Google |
| Google-Agent, Google-GeminiNotebook/NotebookLM, FeedFetcher-Google, APIs-Google | `user_triggered` | IP contra feeds de agentes de usuario |
| Genéricos (`bot`, `crawler`, `spider`, `curl/`, ...) | `other` | Sin mecanismo oficial: `declared_unverified` |

- `Google-Extended` **no es un user-agent**: es un token de control de `robots.txt`; no aparece en los logs y no se clasifica.
- La finalidad es la que declara el proveedor; **no es evidencia de lo que hizo con la respuesta**.

## Estados de verificación

`verified` (IP dentro de un rango vigente del feed correcto) · `mismatch` (UA declarado, IP fuera de rangos vigentes: **no prueba falsedad**; puede ser infraestructura nueva o proxy) · `verification_unavailable` (sin snapshot vigente, IP no confiable por proxy/CDN, o IP ausente) · `declared_unverified` (sin mecanismo oficial) · `unknown`.

## Límites de cobertura

- Los logs de origen no incluyen respuestas servidas por un CDN/caché si lo hubiera (`unknown`: no se sabe si CE usa CDN). Capa `origin` y `edge` no se suman.
- El tipo de recurso (`robots`, `llms`, `html`, ...) se **infiere por la ruta**; el log de Apache no trae el Content-Type.
- Un bot que no se declara (UA de navegador) no se detecta.
- No hay DNS inverso por solicitud ni peticiones externas por solicitud.

## Estado

Implementado, **sin ejecutar** (no hay PHP en el entorno de desarrollo y Raúl pidió no correr pruebas). Las pruebas escritas están en `server/telemetry/tests/CrawlerTest.php` e `ImporterTest.php`.
