#!/usr/bin/env node
/**
 * Genera docs/telemetry/event-catalog.md desde la fuente única (contract.json + elements.json) y los puntos de uso
 * reales (`ce('id')`, `ceNav(...)`, `ceInventory(...)`) con archivo:línea. Con --check falla si el documento está
 * desactualizado o si hay incoherencias (ID usado y no registrado, o registrado y sin uso).
 * Uso: node scripts/telemetry/gen-docs.mjs [--check]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const contract = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/telemetry/contract.json'), 'utf8'));
const elements = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/telemetry/elements.json'), 'utf8'));
const OUT = path.join(ROOT, 'docs/telemetry/event-catalog.md');

function* tsx(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'telemetry') yield* tsx(p); }
    else if (/\.tsx$/.test(e.name)) yield p;
  }
}

const used = new Map();      // id -> ["archivo:línea"]
const navSites = [];         // ceNav(...)
const inventorySites = [];   // ceInventory(...)
for (const f of tsx(path.join(ROOT, 'src'))) {
  const rel = path.relative(ROOT, f);
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/\bce\('([^']+)'/g)) {
      if (!used.has(m[1])) used.set(m[1], []);
      used.get(m[1]).push(`${rel}:${i + 1}`);
    }
    if (/\bceNav\(/.test(line)) navSites.push(`${rel}:${i + 1}`);
    if (/\bceInventory\(/.test(line)) inventorySites.push(`${rel}:${i + 1}`);
  });
}

const problems = [];
for (const id of used.keys()) if (!elements[id]) problems.push(`ID usado y no registrado: ${id}`);
for (const id of Object.keys(elements)) if (!used.has(id) && !/-nav-/.test(id)) problems.push(`ID registrado sin uso en el marcado: ${id}`);

const lines = [];
lines.push('# Telemetría CE: catálogo de eventos y mapa de IDs', '');
lines.push('Generado por `scripts/telemetry/gen-docs.mjs` desde `src/telemetry/contract.json` y `src/telemetry/elements.json`. No editar a mano.', '');
lines.push('## Eventos', '', '| Evento | Propiedades obligatorias | Opcionales |', '|---|---|---|');
for (const [name, spec] of Object.entries(contract.events)) {
  const fmt = (o) => Object.entries(o || {}).map(([k, v]) => `\`${k}\` (${v})`).join(', ') || '—';
  lines.push(`| \`${name}\` | ${fmt(spec.required)} | ${fmt(spec.optional)} |`);
}
lines.push('', '## Enumeraciones', '');
for (const [k, v] of Object.entries(contract.enums)) lines.push(`- \`${k}\`: ${v.map((x) => `\`${x}\``).join(', ')}`);
lines.push('', '## Límites', '');
for (const [k, v] of Object.entries(contract.limits)) lines.push(`- \`${k}\` = ${v}`);
lines.push('', `## Mapa de IDs (${Object.keys(elements).length} elementos)`, '', '| ID | Evento | Ubicación | Canal | Intención | Puntos de uso (archivo:línea) |', '|---|---|---|---|---|---|');
for (const [id, s] of Object.entries(elements)) {
  const sites = used.get(id);
  lines.push(`| \`${id}\` | ${s.event} | ${s.placement} | ${s.channel || '—'} | ${s.intent || '—'} | ${sites ? sites.join(', ') : (/-nav-/.test(id) ? 'dinámico (`ceNav`)' : 'sin uso')} |`);
}
lines.push('', '## Llamadas dinámicas', '', `- \`ceNav(...)\` (arma el ID con ubicación y ruta destino): ${navSites.join(', ') || 'ninguna'}`, `- \`ceInventory(...)\` (fichas visibles): ${inventorySites.join(', ') || 'ninguna'}`, '');
lines.push('## Rutas conocidas (`route_id`)', '', Object.entries(contract.routes).map(([p, id]) => `- \`${p}\` → \`${id}\``).join('\n'), '');
const text = lines.join('\n');

const check = process.argv.includes('--check');
if (check) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (current !== text) problems.push('docs/telemetry/event-catalog.md está desactualizado: ejecuta gen-docs.mjs');
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
  console.log('event-catalog.md coherente con el contrato y el marcado');
} else {
  fs.writeFileSync(OUT, text);
  if (problems.length) console.warn('Incoherencias:\n' + problems.join('\n'));
  console.log(`escrito ${path.relative(ROOT, OUT)}`);
}
