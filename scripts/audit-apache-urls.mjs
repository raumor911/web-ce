#!/usr/bin/env node
/** CE-HTML-05: read-only HTTP/HTML audit. No Apache or WordPress writes. Node 18+. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ORIGIN = 'https://creativosespacios.mx';
const GENERIC_TITLE = 'Creativos Espacios | Infraestructura Modular';
const text = value => (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
function attribute(tag, name) {
  return tag.match(new RegExp('\\b' + name + '\\s*=\\s*["\']([^"\']*)["\']', 'i'))?.[1] || '';
}
export function htmlMetadata(html) {
  const title = text(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const h1 = text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  const canonical = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map(m => m[0]).find(tag => /(?:^|\s)rel\s*=\s*["']canonical["']/i.test(tag));
  return { title, h1, canonical: canonical ? attribute(canonical, 'href') : '' };
}
const noSlash = p => p === '/' ? '/' : p.replace(/\/+$/, '');
export function buildCases(manifest, sitemap, full = false) {
  const paths = manifest.filter(r => r.prerender && r.path !== '/404').map(r => r.path);
  const selected = full ? paths : ['/', '/compra-contenedores-cdmx', '/oficina-para-supervision-de-obra-cdmx', '/contenedor-20-pies-cdmx', '/blog'];
  const cases = [];
  for (const p of selected) {
    if (!paths.includes(p)) continue;
    cases.push({ path: p, kind: 'html', expected: noSlash(p) });
    if (p !== '/') cases.push({ path: noSlash(p) + '/', kind: 'html', expected: noSlash(p) });
  }
  const firstBlog = [...sitemap.matchAll(/<loc>\s*([^<]+)<\/loc>/gi)]
    .map(m => m[1].replaceAll('&amp;', '&'))
    .find(url => url.startsWith(ORIGIN + '/blog/'));
  if (firstBlog) {
    const blogPath = new URL(firstBlog).pathname;
    cases.push({ path: blogPath, kind: 'html', expected: noSlash(blogPath) });
  }
  return [...cases,
    { path: '/404', kind: 'html', expected: '/404' },
    { path: '/index.html', kind: 'redirect', expected: '/' },
    { path: '/catalogo', kind: 'redirect', expected: '/soluciones/venta-renta' },
    { path: '/ce-html-05-route-that-does-not-exist-2026', kind: 'missing' },
    { path: '/favicon-96x96.png', kind: 'asset' },
    { path: '/robots.txt', kind: 'asset' },
    { path: '/blog-admin/', kind: 'wordpress' }
  ];
}
export async function probe(testCase, { origin = ORIGIN, request = fetch, timeoutMs = 12000 } = {}) {
  const redirects = [];
  let target = new URL(testCase.path, origin);
  let initialStatus = null;
  try {
    let response;
    for (let hop = 0; hop <= 6; hop++) {
      if (target.origin !== new URL(origin).origin) throw Error('Redirect leaves expected origin: ' + target.href);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try { response = await request(target.href, { redirect: 'manual', signal: controller.signal }); }
      finally { clearTimeout(timer); }
      if (initialStatus === null) initialStatus = response.status;
      if (![301, 302, 303, 307, 308].includes(response.status)) break;
      const location = response.headers.get('location');
      if (!location) throw Error('Redirect without Location');
      const next = new URL(location, target);
      redirects.push({ status: response.status, from: target.pathname, to: next.pathname });
      target = next;
      if (hop === 6) throw Error('Too many redirects');
    }
    const issues = [];
    const warnings = [];
    const ok = response.status >= 200 && response.status < 300;
    const urlPath = target.pathname;
    let metadata = null;
    if (testCase.kind === 'html') {
      if (!ok) issues.push('HTTP ' + response.status);
      else {
        metadata = htmlMetadata(await response.text());
        if (!metadata.h1) issues.push('Missing H1 (possible Vite shell)');
        if (!metadata.title || (metadata.title === GENERIC_TITLE && testCase.expected !== '/')) issues.push('Generic or missing title');
        const expectedCanonical = new URL(testCase.expected, origin).href;
        if (metadata.canonical !== expectedCanonical) issues.push('Canonical mismatch: ' + (metadata.canonical || '(missing)'));
        if (testCase.expected !== '/404' && /^404(?:\b|\s|-)/i.test(metadata.title)) issues.push('Unexpected 404 page');
        if (urlPath !== testCase.expected) warnings.push('Final URL differs from expected canonical pathname');
      }
    } else if (testCase.kind === 'missing') {
      if (response.status !== 404 && response.status !== 410) issues.push('Nonexistent route did not return 404/410');
    } else if (testCase.kind === 'asset') {
      if (!ok) issues.push('Asset HTTP ' + response.status);
    } else if (testCase.kind === 'redirect') {
      if (!ok || redirects.length === 0 || noSlash(urlPath) !== noSlash(testCase.expected)) issues.push('Missing/incorrect redirect');
      if (urlPath !== testCase.expected) warnings.push('Redirect target ends with a trailing slash');
    } else if (testCase.kind === 'wordpress') {
      if (response.status === 401 || response.status === 403 || response.status === 404 || response.status >= 500) warnings.push('WordPress route requires hosting-level verification');
      // Access controls may legitimately return 401/403. Never parse or log the CMS response body.
    }
    return {
      path: testCase.path, kind: testCase.kind, initialStatus, status: response.status,
      finalUrl: target.href, redirects, metadata,
      state: issues.length ? 'DEFECTO' : warnings.length ? 'OBSERVAR' : 'OK', issues, warnings
    };
  } catch (error) {
    return { path: testCase.path, kind: testCase.kind, initialStatus, finalUrl: target.href,
      redirects, state: 'NO_VERIFICABLE', issues: [], warnings: [error.message] };
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some(a => !['--full'].includes(a) && !a.startsWith('--output='))) {
    console.error('Uso: node scripts/audit-apache-urls.mjs [--full] [--output=ruta.json]');
    process.exitCode = 2; return;
  }
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/config/routes.json'), 'utf8'));
  const sitemap = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
  const cases = buildCases(config, sitemap, args.includes('--full'));
  const results = [];
  for (const item of cases) {
    const r = await probe(item);
    results.push(r);
    console.log([r.state, r.initialStatus ?? '-', r.status ?? '-', item.path, new URL(r.finalUrl).pathname,
      [...r.issues, ...r.warnings].join('; ')].join(' | '));
  }
  const summary = Object.fromEntries(['OK','OBSERVAR','DEFECTO','NO_VERIFICABLE']
    .map(state => [state, results.filter(r => r.state === state).length]));
  console.log('Resumen:', JSON.stringify(summary));
  const out = args.find(a => a.startsWith('--output='))?.slice('--output='.length);
  if (out) {
    const file = path.resolve(out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ testedAt: new Date().toISOString(), origin: ORIGIN, summary, results }, null, 2) + '\n');
    console.log('Informe guardado:', file);
  }
  // Does not touch production. An inaccessible origin is not a successful audit.
  if (summary.DEFECTO) process.exitCode = 1;
  else if (summary.NO_VERIFICABLE) process.exitCode = 2;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(err => { console.error(err); process.exitCode = 2; });
}
