#!/usr/bin/env node
/**
 * CE: auditoría de integridad del artefacto dist.
 * Node 18+, sin dependencias. No modifica el repositorio ni HostGator.
 * Uso: node scripts/verify-dist.mjs [directorio-del-repo] [--min-blog=N] [--manifest]
 * Valida el HTML en disco, no confirma el comportamiento de Apache/HostGator.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const argv = process.argv.slice(2);
const root = path.resolve(argv.find(v => !v.startsWith('--')) || process.cwd());
const dist = path.join(root, 'dist');
const origin = 'https://creativosespacios.mx';
const minBlog = Number((argv.find(v => v.startsWith('--min-blog=')) || '--min-blog=1').split('=')[1]);
const manifestWanted = argv.includes('--manifest');
const problems = [];
const results = [];

const read = file => fs.readFileSync(file, 'utf8');
const exists = file => fs.existsSync(file) && fs.statSync(file).isFile();
const canonical = route => origin + (route === '/' ? '/' : '/' + route.replace(/^\/+|\/+$/g, ''));
const visibleText = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, '').replace(/&(?:nbsp|#160);/gi, ' ').replace(/\s+/g, ' ').trim();
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(['"])(.*?)\2/g)].map(m => [m[1].toLowerCase(), m[3]]));

if (!Number.isInteger(minBlog) || minBlog < 0) {
  console.error('Uso inválido: --min-blog debe ser entero no negativo');
  process.exit(2);
}
const routesPath = path.join(root, 'src/config/routes.json');
const sitemapPath = path.join(dist, 'sitemap.xml');
if (!exists(routesPath) || !exists(sitemapPath)) {
  console.error('BLOQUEADO: se requiere src/config/routes.json y dist/sitemap.xml de la compilación actual.');
  process.exit(2);
}
let config;
try { config = JSON.parse(read(routesPath)); }
catch (e) { console.error('ERROR en routes.json:', e.message); process.exit(2); }
if (!Array.isArray(config)) { console.error('ERROR: routes.json no es una lista'); process.exit(2); }
const routeSet = new Set();
for (const r of config) {
  if (!r || typeof r.path !== 'string' || !r.path.startsWith('/')) {
    problems.push('Entrada inválida en routes.json: ruta ausente o mal formada');
    continue;
  }
  if (routeSet.has(r.path)) problems.push('Ruta duplicada en manifiesto: ' + r.path);
  routeSet.add(r.path);
}
const sitemap = read(sitemapPath);
if (!/<urlset(?:\s|>)/i.test(sitemap)) problems.push('Sitemap XML sin elemento urlset');
const locs = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
const locSet = new Set(locs);
if (locSet.size !== locs.length) problems.push('Existen URLs duplicadas en dist/sitemap.xml');
const blogPaths = locs.filter(url => url.startsWith(origin + '/blog/')).map(url => {
  try { return new URL(url).pathname; }
  catch { problems.push('URL de blog inválida: ' + url); return ''; }
}).filter(Boolean);
if (blogPaths.length < minBlog) problems.push(`Blog incompleto: ${blogPaths.length} artículos en sitemap, mínimo requerido ${minBlog}. Verificar API WordPress y build.`);
const expected = [...config.filter(r => r && r.prerender && typeof r.path === 'string' && r.path.startsWith('/')).map(r => r.path), ...blogPaths];
if (new Set(expected).size !== expected.length) problems.push('Rutas prerenderizadas duplicadas entre manifiesto y sitemap.');
for (const r of config.filter(r => r && r.sitemap && typeof r.path === 'string' && r.path.startsWith('/'))) {
  if (!locSet.has(canonical(r.path))) problems.push('URL de manifiesto ausente en sitemap: ' + r.path);
}
for (const loc of locs) {
  if (!loc.startsWith(origin + '/')) problems.push('URL fuera del dominio en sitemap: ' + loc);
}
if (!exists(path.join(dist, 'index.html'))) problems.push('Falta dist/index.html');
if (exists(path.join(root, 'public/.htaccess')) && !exists(path.join(dist, '.htaccess'))) {
  problems.push('Falta dist/.htaccess, necesario para la publicación en HostGator');
}

const pageHashes = new Map();
for (const route of expected) {
  if (route !== '/' && !/^\/[a-zA-Z0-9/_%-]+$/.test(route)) {
    problems.push(route + ': ruta insegura o no admitida en el manifiesto/sitemap');
    continue;
  }
  const local = route === '/404' ? '404.html' : route === '/' ? 'index.html' : route.replace(/^\//, '') + '/index.html';
  const file = path.join(dist, local);
  const row = { route, file:local, exists:exists(file), specific:false, title:'', canonical:'', h1:'', status:'' };
  if (!row.exists) { row.status = 'FALTA HTML'; problems.push(route + ': falta ' + local); results.push(row); continue; }
  const html = read(file);
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  row.title = title ? visibleText(title[1]) : '';
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0]));
  row.canonical = links.find(a => (a.rel || '').split(/\s+/).includes('canonical'))?.href || '';
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  row.h1 = h1 ? visibleText(h1[1]) : '';
  row.specific = Boolean(row.h1 && row.title && row.title !== 'Creativos Espacios | Infraestructura Modular');
  const issues = [];
  if (!row.specific) issues.push('HTML genérico, sin H1 o sin título específico');
  if (route !== '/404' && /^404(?:\s|\b|\s*-)/i.test(row.title)) issues.push('Fallback 404 capturado en ruta válida');
  if (row.canonical !== canonical(route)) issues.push('canonical incorrecto/ausente: ' + (row.canonical || '(vacío)'));
  if (!/<meta\b[^>]*\bname=['"]description['"][^>]*>/i.test(html) && !/<meta\b[^>]*\bcontent=['"][^'"]+['"][^>]*\bname=['"]description['"][^>]*>/i.test(html)) issues.push('meta description ausente');
  // Para no bloquear el build por imágenes de contenido opcionales, verificar solo el bundle obligatorio JS/CSS.
  const sources = [...html.matchAll(/<(?:script|link)\b[^>]*>/gi)].map(m => attrs(m[0]));
  for (const a of sources) {
    const uri = a.src || (/(?:^|\s)stylesheet(?:$|\s)/i.test(a.rel || '') ? a.href : '');
    if (!uri || !uri.startsWith('/')) continue;
    const pathname = uri.split(/[?#]/)[0];
    if (!/\.(?:js|css)$/i.test(pathname)) continue;
    let decoded;
    try { decoded = decodeURIComponent(pathname); }
    catch { issues.push('Ruta de recurso mal codificada: ' + pathname); continue; }
    const assetPath = path.resolve(dist, '.' + decoded);
    if (!assetPath.startsWith(dist + path.sep) || !exists(assetPath)) issues.push('Recurso ausente: ' + pathname);
  }
  const hash = crypto.createHash('sha256').update(html).digest('hex');
  if (pageHashes.has(hash)) issues.push('HTML idéntico a ' + pageHashes.get(hash));
  else pageHashes.set(hash, route);
  row.status = issues.length ? 'FALLÓ: ' + issues.join('; ') : 'OK';
  for (const issue of issues) problems.push(route + ': ' + issue);
  results.push(row);
}
const failed = results.filter(r => r.status !== 'OK');
console.log(`CE / dist — manifiesto ${config.filter(r => r && r.prerender).length}, sitemap ${locs.length}, artículos ${blogPaths.length}, páginas analizadas ${results.length}`);
console.log('Ruta | Archivo | H1 | Título | Canonical | Estado');
for (const r of results) {
  console.log([r.route, r.exists?'Sí':'No', r.h1?'Sí':'No', r.title?'Sí':'No', r.canonical?'Sí':'No', r.status].join(' | '));
}
console.log(`RESUMEN: ${results.length - failed.length} correctas, ${failed.length} defectuosas, ${problems.length} observaciones de bloqueo.`);
if (problems.length) {
  console.error('\nNO PUBLICAR DIST. Problemas detectados:');
  for (const p of [...new Set(problems)]) console.error(' - ' + p);
  process.exitCode = 1;
} else {
  console.log('\nVALIDACIÓN ESTÁTICA SUPERADA. Aún se requieren pruebas funcionales y de HostGator antes de publicar.');
  if (manifestWanted) {
    const files = [];
    function walk(dir) {
      for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
        const full=path.join(dir,entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.isFile()) files.push(full);
      }
    }
    walk(dist);
    const hashes = files.sort().map(f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')+'  '+path.relative(dist,f).replaceAll('\\','/'));
    const dest = path.join(root,'ce-dist-manifest.sha256');
    fs.writeFileSync(dest,hashes.join('\n')+'\n');
    console.log('Manifiesto SHA256 generado fuera de dist: '+dest);
  }
}