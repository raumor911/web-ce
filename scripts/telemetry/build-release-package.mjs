#!/usr/bin/env node
/**
 * Prepara (NO publica) el material de la etapa 6: carpeta de preparación con destinos separados y manifiesto con SHA-256.
 *   .tmp/telemetry-release/<sha>/public/   -> va dentro del document root (public_html)
 *   .tmp/telemetry-release/<sha>/private/  -> va a la carpeta privada `telemetry/` (fuera del document root)
 *   .tmp/telemetry-release/<sha>/manifest.json y SHA256SUMS
 * Se niega a correr con cambios sin commitear (el paquete debe salir de un SHA exacto). No toca el hosting, no hace push,
 * no incluye telemetry-config.php ni ningún secreto. Uso: node scripts/telemetry/build-release-package.mjs
 * Estado: implementado, sin ejecutar por instrucción de Raúl.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const git = (...a) => spawnSync('git', a, { cwd: ROOT, encoding: 'utf8' });
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

const PUBLIC_FILES = [
  ['public/telemetria/collect.php', 'telemetria/collect.php'],
  ['public/telemetria-admin/index.php', 'telemetria-admin/index.php'],
];
const PRIVATE_FILES = [
  ['server/telemetry/bootstrap.php', 'bootstrap.php'],
  ['server/telemetry/telemetry-config.example.php', 'telemetry-config.example.php'],
  ['src/telemetry/contract.json', 'schema/contract.json'],
  ['src/telemetry/elements.json', 'schema/elements.json'],
];
const PRIVATE_TREES = [
  ['server/telemetry/src', 'src', /\.php$/],
  ['server/telemetry/cli', 'cli', /\.php$/],
  ['server/telemetry/schema/migrations', 'schema/migrations', /\.sql$/],
];

function* files(dir, re) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(p, re);
    else if (re.test(e.name)) yield p;
  }
}

const status = git('status', '--porcelain', '--', 'server/telemetry', 'public/telemetria', 'public/telemetria-admin', 'src/telemetry');
if (status.stdout.trim() !== '') {
  console.error('Hay cambios sin commitear en los archivos de telemetría; el paquete debe salir de un SHA exacto.\n' + status.stdout);
  process.exit(1);
}
const head = git('rev-parse', 'HEAD').stdout.trim();
const branch = git('rev-parse', '--abbrev-ref', 'HEAD').stdout.trim();
const out = path.join(ROOT, '.tmp/telemetry-release', head.slice(0, 12));
fs.rmSync(out, { recursive: true, force: true });

const entries = [];
function stage(zone, src, dest) {
  const buf = fs.readFileSync(path.join(ROOT, src));
  const target = path.join(out, zone, dest);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buf);
  entries.push({ zone, destination: dest, source: src, bytes: buf.length, sha256: sha256(buf) });
}
for (const [src, dest] of PUBLIC_FILES) stage('public', src, dest);
for (const [src, dest] of PRIVATE_FILES) stage('private', src, dest);
for (const [dir, destDir, re] of PRIVATE_TREES) {
  for (const f of files(path.join(ROOT, dir), re)) stage('private', path.relative(ROOT, f), path.join(destDir, path.relative(path.join(ROOT, dir), f)));
}

const forbidden = entries.filter((e) => /telemetry-config\.php$/.test(e.destination) || /\.env/.test(e.destination));
if (forbidden.length) { console.error('Archivo prohibido en el paquete:', forbidden.map((e) => e.destination)); process.exit(1); }

const manifest = {
  generated_for: { git_sha: head, branch },
  note: 'Preparado, NO publicado. Destino public = dentro del document root. Destino private = carpeta privada telemetry/ fuera del document root. Las rutas absolutas las decide Raúl en cPanel; no constan aquí.',
  client: 'El cliente (JS) viaja en el dist normal de `npm run build` con VITE_TELEMETRY_ENABLED=true. Sus hashes se calculan sobre ese dist al construirlo (no existen hasta entonces). package-hostgator.mjs EXCLUYE todo .php: los PHP de este manifiesto NO viajan en ese ZIP.',
  never_published: ['telemetry-config.php (lo coloca Raúl)', '.htaccess (cualquier cambio va como diff aparte)', 'robots.txt, sitemap, canonical'],
  files: entries,
};
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'SHA256SUMS'), entries.map((e) => `${e.sha256}  ${e.zone}/${e.destination}`).join('\n') + '\n');
console.log(`Preparado en ${path.relative(ROOT, out)} (${entries.length} archivos). No se publicó nada.`);
