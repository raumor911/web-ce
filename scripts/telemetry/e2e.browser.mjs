// Pruebas de navegador (Puppeteer) del recolector. Compila un bundle APARTE con la bandera de cliente encendida
// (.tmp/telemetry-e2e, ignorado por Git), lo sirve con un colector simulado y nunca toca producción ni el formulario real.
// Uso: PUPPETEER_EXECUTABLE_PATH=".../Google Chrome" node --test scripts/telemetry/e2e.browser.mjs
// ESTADO: última corrida (antes de que Raúl pidiera detener las pruebas) = 7 de 9 pasaron; FALLAN «granted» (se cuelga
// en la secuencia clic en icono / Enter / botón central sobre el enlace de WhatsApp) y «transporte». La causa de esos dos
// NO está diagnosticada (puede ser del arnés con Puppeteer 1.20 o del código). No se reejecutó después.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { validateBatch } from '../../src/telemetry/event-schema.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, '.tmp/telemetry-e2e');
const PORT = 8123;
const ORIGIN = `http://localhost:${PORT}`;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.txt': 'text/plain' };

const received = [];     // eventos aceptados por el colector simulado
const rejected = [];     // lotes rechazados por el esquema
const requests = [];     // { method, origin, contentType }
let plan = [];           // respuestas forzadas: números de estado
let formHits = 0;
let server, browser;

before(async () => {
  const r = spawnSync('npx', ['vite', 'build', '--outDir', OUT, '--emptyOutDir'], {
    cwd: ROOT, encoding: 'utf8',
    env: { ...process.env, VITE_TELEMETRY_ENABLED: 'true', VITE_TELEMETRY_RELEASE_ID: 'e2e-build', VITE_TELEMETRY_ENDPOINT: '/telemetria/collect.php' },
  });
  assert.equal(r.status, 0, r.stderr || r.stdout);
  server = http.createServer((req, res) => {
    const url = new URL(req.url, ORIGIN);
    if (url.pathname === '/telemetria/collect.php') {
      let body = '';
      req.on('data', (c) => { body += c; });
      req.on('end', () => {
        requests.push({ method: req.method, origin: req.headers.origin || null, contentType: req.headers['content-type'] || null });
        const forced = plan.shift();
        if (forced) { res.writeHead(forced, { 'Retry-After': '1' }); return res.end('{}'); }
        const check = validateBatch(body);
        if (req.method !== 'POST' || req.headers.origin !== ORIGIN || !check.ok) {
          rejected.push({ error: check.error, origin: req.headers.origin });
          res.writeHead(400); return res.end('{}');
        }
        received.push(...check.value);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"accepted":' + check.value.length + ',"duplicates":0}');
      });
      return;
    }
    if (url.pathname === '/formulario-creativosespacios.php') { // simulado: no existe ningún envío real
      formHits++;
      req.resume();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end('{"success":true,"message":"simulado"}');
    }
    let file = path.join(OUT, decodeURIComponent(url.pathname));
    if (!file.startsWith(OUT)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      if (path.extname(url.pathname)) { res.writeHead(404); return res.end(); }
      file = path.join(OUT, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r2) => server.listen(PORT, r2));
  // Nada sale a internet: el resolvedor del navegador solo resuelve localhost (la intercepción de Puppeteer cancela los sendBeacon al descargar la página).
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE localhost'] });
});

after(async () => {
  await browser?.close();
  await new Promise((r) => server?.close(r));
});

async function open(opts = {}) {
  received.length = 0; rejected.length = 0; requests.length = 0; plan = []; formHits = 0;
  const ctx = await (browser.createBrowserContext ? browser.createBrowserContext() : browser.createIncognitoBrowserContext());
  const page = await ctx.newPage();
  if (opts.mobile) await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
  await page.setViewport(opts.mobile ? { width: 390, height: 844, isMobile: true, hasTouch: true } : { width: 1280, height: 800 });
  if (opts.disabledFlag) await page.evaluateOnNewDocument(() => { window.__CE_TELEMETRY_DISABLED__ = true; });
  if (opts.consent) await page.evaluateOnNewDocument((c) => { try { if (!localStorage.getItem('ce_telemetry_consent_v1')) localStorage.setItem('ce_telemetry_consent_v1', JSON.stringify({ v: 1, state: c })); } catch { /* sin acción */ } }, opts.consent);
  return { ctx, page };
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const names = () => received.map((e) => e.name);
const waitFor = async (fn, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await wait(100); } return false; };
const goto = (page, p) => page.goto(ORIGIN + p, { waitUntil: 'networkidle0' });

test('unknown: sin identificador, sin cola y sin red analítica', { timeout: 120000 }, async () => {
  const { ctx, page } = await open();
  await goto(page, '/contacto/');
  await wait(1500);
  assert.equal(requests.length, 0);
  const keys = await page.evaluate(() => Object.keys(sessionStorage).concat(Object.keys(localStorage)));
  assert.deepEqual(keys.filter((k) => k.startsWith('ce_telemetry_session')), []);
  assert.equal(await page.evaluate(() => window.ceTelemetry.getConsent()), 'unknown');
  await ctx.close();
});

test('granted: inicia en la página actual; SPA, clic con icono, teclado y botón central', { timeout: 120000 }, async () => {
  const { ctx, page } = await open();
  await goto(page, '/');
  await page.evaluate(() => window.ceTelemetry.setConsent('granted'));
  await waitFor(() => received.length >= 1, 8000);
  assert.deepEqual(names(), ['page_view']);
  assert.equal(received[0].page_path, '/');
  assert.equal(received[0].release_id, 'e2e-build');
  // Navegación SPA con enlace etiquetado de la barra.
  await page.evaluate(() => document.querySelector('a[data-ce-id="navbar-nav-nosotros"]').click());
  assert.ok(await waitFor(() => received.some((e) => e.name === 'page_view' && e.page_path === '/nosotros/')));
  assert.ok(received.some((e) => e.name === 'navigation_click' && e.properties.destination_path === '/nosotros/'));
  // Clic sobre el icono SVG dentro del botón flotante de WhatsApp: un solo contact_click y abre sin esperar.
  const popup = new Promise((resolve) => browser.once('targetcreated', resolve));
  await page.click('a[data-ce-id="floating-whatsapp"] svg');
  await Promise.race([popup, wait(2000)]);
  // Teclado (Enter sobre el enlace) y botón central.
  await page.focus('a[data-ce-id="floating-whatsapp"]');
  await page.keyboard.press('Enter');
  await page.click('a[data-ce-id="floating-whatsapp"]', { button: 'middle' });
  await wait(500);
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  assert.ok(await waitFor(() => received.filter((e) => e.name === 'contact_click').length >= 3));
  const cc = received.filter((e) => e.name === 'contact_click');
  assert.equal(cc.length, 3, 'icono, teclado y botón central: un evento por activación');
  assert.ok(cc.every((e) => e.properties.element_id === 'floating-whatsapp' && e.properties.channel === 'whatsapp'));
  assert.ok(!JSON.stringify(received).includes('wa.me'));
  // El colector aceptó solo lotes válidos con Origin igual al del sitio.
  assert.equal(rejected.length, 0, JSON.stringify(rejected));
  assert.ok(requests.every((r) => r.method === 'POST' && r.origin === ORIGIN));
  await ctx.close();
});

test('rutas: atrás, recarga (misma sesión, vista nueva) y sin duplicados por re-render', { timeout: 120000 }, async () => {
  const { ctx, page } = await open({ consent: 'granted' });
  await goto(page, '/');
  await page.evaluate(() => document.querySelector('a[data-ce-id="navbar-nav-contacto"]').click());
  await waitFor(() => received.some((e) => e.page_path === '/contacto/'));
  // Atrás dentro de la SPA (history.back). La restauración real desde bfcache queda cubierta por las pruebas unitarias (pageshow persisted):
  // Puppeteer 1.20 no maneja la navegación atrás con bfcache.
  await page.evaluate(() => history.back());
  await wait(1200);
  await page.reload({ waitUntil: 'networkidle0' });
  await wait(700);
  await page.goto('about:blank');
  await wait(800);
  const views = received.filter((e) => e.name === 'page_view');
  assert.deepEqual(views.map((v) => v.page_path), ['/', '/contacto/', '/', '/']);
  assert.equal(new Set(views.map((v) => v.page_view_id)).size, 4);
  assert.equal(new Set(views.map((v) => v.session_id)).size, 1, 'la recarga conserva la sesión de pestaña');
  await ctx.close();
});

test('revocación: vacía cola, borra el ID y deja de enviar', { timeout: 120000 }, async () => {
  const { ctx, page } = await open({ consent: 'granted' });
  await goto(page, '/');
  await waitFor(() => received.length >= 1);
  const before = received.length;
  await page.evaluate(() => window.ceTelemetry.setConsent('denied'));
  assert.equal(await page.evaluate(() => sessionStorage.getItem('ce_telemetry_session_v1')), null);
  await page.click('a[data-ce-id="floating-whatsapp"]');
  await wait(7000);
  assert.equal(received.length, before);
  await ctx.close();
});

test('exclusiones: automatización propia (bandera) y llave local no capturan', { timeout: 120000 }, async () => {
  const a = await open({ consent: 'granted', disabledFlag: true });
  await goto(a.page, '/');
  await wait(1500);
  assert.equal(requests.length, 0);
  await a.ctx.close();
  const b = await open({ consent: 'granted' });
  await b.page.evaluateOnNewDocument(() => localStorage.setItem('ce_telemetry_exclude', '1'));
  await goto(b.page, '/');
  await wait(1500);
  assert.equal(requests.length, 0);
  await b.ctx.close();
});

test('transporte: colector con 503 reintenta con el mismo event_id y la página sigue utilizable', { timeout: 120000 }, async () => {
  const { ctx, page } = await open({ consent: 'granted' });
  plan = [503, 503];
  await goto(page, '/');
  await wait(300);
  await page.click('a[data-ce-id="floating-whatsapp"]'); // sigue respondiendo con el colector caído
  assert.ok(await waitFor(() => received.length >= 1, 15000), 'tras 2 reintentos el lote entra');
  assert.ok(requests.length >= 3);
  await ctx.close();
});

test('scroll: umbrales una vez; formulario: form_start y envío sin valores; todo sin PII', { timeout: 120000 }, async () => {
  const { ctx, page } = await open({ consent: 'granted' });
  await goto(page, '/nosotros/');
  await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y <= h; y += 200) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo({ top: h, behavior: 'instant' }); });
  await wait(500);
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await waitFor(() => received.some((e) => e.name === 'scroll_depth' && e.properties.percent === 90));
  const pcts = received.filter((e) => e.name === 'scroll_depth').map((e) => e.properties.percent);
  assert.deepEqual([...new Set(pcts)].sort((x, y) => x - y), [25, 50, 75, 90]);
  assert.equal(pcts.length, new Set(pcts).size, 'cada umbral una vez por vista');
  await ctx.close();

  const f = await open({ consent: 'granted' });
  await goto(f.page, '/contacto/');
  await f.page.type('input[name="nombre"]', 'Persona de Prueba');
  await f.page.type('input[name="email"]', 'prueba@example.invalid');
  await f.page.type('textarea[name="mensaje"]', 'Mensaje sintético 5512345678');
  await f.page.click('form button[type="submit"]');
  await waitFor(() => received.some((e) => e.name === 'form_submit_success'));
  await f.page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await wait(500);
  assert.equal(formHits, 1);
  assert.deepEqual(received.map((e) => e.name).filter((n) => n.startsWith('form_')), ['form_start', 'form_submit_attempt', 'form_submit_success']);
  const blob = JSON.stringify(received);
  for (const bad of ['Persona', 'prueba@', '5512345678', 'Mensaje sint', 'example.invalid']) assert.ok(!blob.includes(bad), bad);
  await f.ctx.close();
});

test('móvil: toque en el botón flotante genera un contact_click y la página abre WhatsApp sin esperar', { timeout: 120000 }, async () => {
  const { ctx, page } = await open({ consent: 'granted', mobile: true });
  await goto(page, '/');
  await waitFor(() => received.length >= 1);
  const popup = new Promise((resolve) => browser.once('targetcreated', resolve));
  await page.tap('a[data-ce-id="floating-whatsapp"]');
  await Promise.race([popup, wait(2000)]);
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  assert.ok(await waitFor(() => received.some((e) => e.name === 'contact_click')));
  assert.equal(received.filter((e) => e.name === 'contact_click').length, 1);
  assert.equal(received.find((e) => e.name === 'page_view').properties.device_class, 'mobile');
  await ctx.close();
});

test('prerender: el HTML compilado con la bandera encendida no activa captura bajo __CE_TELEMETRY_DISABLED__', { timeout: 120000 }, async () => {
  const { ctx, page } = await open({ consent: 'granted', disabledFlag: true });
  await goto(page, '/soluciones/venta-renta/');
  await wait(1200);
  assert.equal(requests.length, 0);
  await ctx.close();
});
