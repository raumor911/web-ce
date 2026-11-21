# Changelog - AI Information Package

## 1.0.0 — 2026-07-22

- Creación de `llms.txt` y `llms-full.txt` en la raíz pública.
- Implementación del directorio `/ai/` con perfiles corporativos estructurados (`company.md`, `company.json`).
- Definición de grafo de conocimiento inicial (`knowledge-graph.json`).
- Registro de control de afirmaciones (`claims-register.json`) para validación de datos.
- Implementación de datos estructurados Schema.org (`organization.jsonld`).
- Creación de manifiesto de contenidos (`content-manifest.json`) como índice para agentes de IA.
- Automatización de generación mediante `npm run generate:ai`.
- Configuración de `robots.txt` y `sitemap.xml` para optimización de rastreo semántico.

## 2026-10-15 — One Trip LLMO + Knowledge Graph

- Added the One Trip hub and five intent-specific canonical landing paths to AI guidance.
- Published explicit One Trip rules: sale only; 20 FT Standard and 40 FT High Cube only.
- Added /ai/one-trip.md and /ai/one-trip.json.
- Added canonical One Trip intent paths to intents.md and intents.json.
- Enriched knowledge-graph.json with CommercialPolicy, Condition and governedBy relationships.
- Refreshed llms.txt, llms-full.txt, FAQ context and sitemap.

## 2026-11-21 — Proyectos realizados (evidencia)

- Added 11 entries to `src/knowledge/cases.json` (9 projects and 2 unassigned references) derived from the published page `/proyectos-realizados-contenedores-modulares`, each split into documented / visible in photos / not confirmed.
- Added `/ai/cases.md` and `/ai/cases.json`, and a "Proyectos realizados (evidencia)" section in `llms.txt` and `llms-full.txt`.
- Added source `source:proyectos-realizados`, claim `claim:projects-evidence-page`, intent `intent:see-completed-projects` and canonical answer `answer:completed-projects`.
- No dates, costs, site measurements, results or testimonials are published: they are not documented in the source material.
