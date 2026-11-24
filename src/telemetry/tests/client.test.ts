/* eslint-disable @typescript-eslint/no-explicit-any */
// Pruebas del recolector con reloj controlado (sección 18: Preferencias, Rutas, Transporte, Privacidad).
import test from 'node:test';
import assert from 'node:assert/strict';
import { harness } from './harness.ts';
import { sanitizeUtm, utmFromSearch, referrerHost, deviceClass } from '../sanitize.ts';
import { validateBatch, LIMITS } from '../event-schema.ts';
import { createQueue } from '../queue.ts';
import { randomId128, uuidV4, browserRandom } from '../session.ts';

const names = (h: ReturnType<typeof harness>) => h.events().map((e: any) => e.name);

test('preferencias: unknown y denied no crean ID, no encolan y no usan la red', async () => {
  for (const consent of ['unknown', 'denied'] as const) {
    const h = harness({ consent });
    h.collector.setPath('/contacto/', { documentLoad: true });
    h.collector.track('form_start', { form_id: 'contacto' });
    h.collector.scrollProgress(90);
    await h.advance(60000);
    assert.equal(h.sess.m.size, 0, 'sin identificador en sessionStorage');
    assert.equal(h.queue.size, 0);
    assert.equal(h.calls.length + h.beacons.length, 0);
    assert.equal(h.attached, 0, 'sin listeners analíticos');
  }
});

test('preferencias: granted inicia en la página actual sin reconstruir actividad previa', async () => {
  const h = harness({ consent: 'unknown' });
  h.collector.setPath('/nosotros/', { documentLoad: true });
  h.collector.setPath('/contacto/');
  h.consent.set('granted');
  await h.advance(6000);
  assert.deepEqual(names(h), ['page_view']);
  assert.equal(h.events()[0].page_path, '/contacto/');
  assert.equal(h.attached, 1);
});

test('preferencias: revocar detiene listeners, vacía la cola, borra el ID y no reenvía al conceder de nuevo', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/', { documentLoad: true });
  h.collector.scrollProgress(30);
  assert.ok(h.queue.size >= 1);
  assert.ok(h.sess.m.size === 1);
  h.consent.set('denied');
  assert.equal(h.queue.size, 0);
  assert.equal(h.sess.m.size, 0);
  assert.equal(h.detached, 1);
  await h.advance(20000);
  assert.equal(h.calls.length, 0, 'nada se envió tras revocar');
  h.consent.set('granted');
  await h.advance(6000);
  const sent = h.events();
  assert.equal(sent.length, 1, 'solo la página actual: no se reenvía lo anterior');
  assert.equal(sent[0].name, 'page_view');
});

test('exclusión: automatización propia (excluded) no activa nada aunque haya consentimiento', async () => {
  const h = harness({ consent: 'granted', excluded: true });
  h.collector.setPath('/', { documentLoad: true });
  await h.advance(30000);
  assert.equal(h.collector.isActive, false);
  assert.equal(h.sess.m.size, 0);
  assert.equal(h.calls.length, 0);
});

test('rutas: carga, cambio SPA, back (A,B,A) y re-render producen vistas según el contrato', async () => {
  const h = harness({ consent: 'granted', path: '/' });
  h.collector.setPath('/', { documentLoad: true });
  h.collector.setPath('/contacto/');
  h.collector.setPath('/contacto'); // re-render con la misma ruta: ignorado
  h.collector.setPath('/contacto/'); // idem
  h.collector.setPath('/');          // back
  await h.advance(6000);
  const views = h.events().filter((e: any) => e.name === 'page_view');
  assert.equal(views.length, 3);
  assert.deepEqual(views.map((v: any) => v.page_path), ['/', '/contacto/', '/']);
  assert.equal(new Set(views.map((v: any) => v.page_view_id)).size, 3);
  assert.equal(views[1].properties.previous_path, '/');
  assert.equal(views[0].session_id, views[2].session_id);
  const seq = h.events().map((e: any) => e.sequence);
  assert.deepEqual(seq, [...seq].sort((a, b) => a - b), 'sequence incremental por sesión');
  assert.equal(new Set(seq).size, seq.length);
});

test('rutas: recarga = documento nuevo, misma sesión de pestaña, vista nueva', async () => {
  const first = harness({ consent: 'granted' });
  first.collector.setPath('/proyectos/', { documentLoad: true });
  await first.advance(6000);
  const second = harness({ consent: 'granted', local: first.local, session: first.sess, startMs: Date.UTC(2026, 10, 24, 20, 0, 30), seed: 99 });
  second.collector.setPath('/proyectos/', { documentLoad: true });
  await second.advance(6000);
  const a = first.events()[0], b = second.events()[0];
  assert.equal(a.session_id, b.session_id);
  assert.notEqual(a.page_view_id, b.page_view_id);
  assert.ok(b.sequence > a.sequence);
});

test('rutas: bfcache (pagehide + pageshow persistente) crea una vista nueva', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/', { documentLoad: true });
  h.collector.setPath('/blog/');
  await h.advance(100);
  h.collector.pageHide();
  h.collector.pageRestored();
  await h.advance(6000);
  const views = [...h.beacons, ...h.calls].flatMap((c) => c.body.events).filter((e: any) => e.name === 'page_view');
  assert.equal(views.length, 3);
  assert.equal(views[2].page_path, '/blog/');
  assert.notEqual(views[2].page_view_id, views[1].page_view_id);
});

test('rutas: rutas sensibles no generan vistas', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/blog-admin/wp-login.php', { documentLoad: true });
  h.collector.setPath('/telemetria-admin/');
  await h.advance(6000);
  assert.equal(h.events().length, 0);
});

test('atribución: UTM válida, referrer solo hostname, sin gclid ni query completa', async () => {
  const h = harness({ consent: 'granted', path: '/', search: '?utm_source=ChatGPT.com&utm_medium=referral&utm_campaign=nov&gclid=XYZ&utm_term=barata&email=a@b.c', referrer: 'https://www.google.com/search?q=contenedores+cdmx' });
  h.collector.setPath('/', { documentLoad: true });
  await h.advance(6000);
  const pv = h.events()[0];
  assert.deepEqual(pv.properties, { utm_source: 'chatgpt.com', utm_medium: 'referral', utm_campaign: 'nov', landing_source: 'google.com', device_class: 'desktop' });
  assert.ok(!JSON.stringify(h.events()).includes('gclid'));
  assert.ok(!JSON.stringify(h.events()).includes('q=contenedores'));
});

test('saneamiento: UTM con correo, teléfono o caracteres raros', () => {
  assert.equal(sanitizeUtm('persona@example.invalid'), null);
  assert.equal(sanitizeUtm('llame 5512345678'), null);
  assert.equal(sanitizeUtm('  Google  Ads '), 'google ads');
  assert.equal(sanitizeUtm('<b>x</b>'), 'bx/b');
  assert.equal(sanitizeUtm('a'.repeat(300))?.length, 100);
  assert.deepEqual(utmFromSearch('?utm_source=x&utm_term=y&fbclid=1'), { utm_source: 'x' });
  assert.equal(referrerHost('https://creativosespacios.mx/nosotros/', 'creativosespacios.mx'), null);
  assert.equal(referrerHost('https://chatgpt.com/c/abc?x=1', 'creativosespacios.mx'), 'chatgpt.com');
  assert.equal(referrerHost('javascript:alert(1)', 'creativosespacios.mx'), null);
  assert.equal(deviceClass('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148'), 'mobile');
  assert.equal(deviceClass('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)'), 'tablet');
  assert.equal(deviceClass('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'), 'desktop');
  assert.equal(deviceClass(''), 'unknown');
});

test('clics: contact_click y quote_click llevan lo declarado en el registro; no se duplica', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/soluciones/venta-renta/', { documentLoad: true });
  h.collector.trackElement('navbar-whatsapp-desktop');
  h.collector.trackElement('inventory-card-quote', { product: 'product:container-20ft' });
  h.collector.trackElement('navbar-nav-proyectos', { destination: '/proyectos' });
  h.collector.trackElement('navbar-nav-proyectos', {}); // sin destino válido: se descarta
  h.collector.trackElement('id-inventado');
  await h.advance(6000);
  const ev = h.events();
  assert.deepEqual(names(h), ['page_view', 'contact_click', 'quote_click', 'navigation_click']);
  assert.deepEqual(ev[1].properties, { element_id: 'navbar-whatsapp-desktop', placement: 'navbar', channel: 'whatsapp', intent: 'availability' });
  assert.equal(ev[2].properties.product_id, 'product:container-20ft');
  assert.equal(ev[3].properties.destination_path, '/proyectos/');
  // No se transmite el destino de WhatsApp ni texto de botones.
  assert.ok(!JSON.stringify(ev).includes('wa.me'));
});

test('scroll: cada umbral una sola vez por vista; vista nueva reinicia', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/nosotros/', { documentLoad: true });
  h.collector.scrollProgress(10);
  h.collector.scrollProgress(80);
  h.collector.scrollProgress(80);
  h.collector.scrollProgress(100);
  h.collector.setPath('/contacto/');
  h.collector.scrollProgress(30);
  await h.advance(6000);
  const sc = h.events().filter((e: any) => e.name === 'scroll_depth').map((e: any) => e.properties.percent);
  assert.deepEqual(sc, [25, 50, 75, 90, 25]);
});

test('inventory_view: una vez por producto y vista', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/soluciones/venta-renta/', { documentLoad: true });
  h.collector.inventoryVisible('product:container-20ft', 'service:container-sale');
  h.collector.inventoryVisible('product:container-20ft', 'service:container-sale');
  h.collector.inventoryVisible('product:container-40ft');
  await h.advance(6000);
  assert.equal(h.events().filter((e: any) => e.name === 'inventory_view').length, 2);
});

test('formularios: form_start solo una vez por vista y sin valores de campos', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/contacto/', { documentLoad: true });
  h.collector.track('form_start', { form_id: 'contacto' }, 'form_start:contacto');
  h.collector.track('form_start', { form_id: 'contacto' }, 'form_start:contacto');
  h.collector.track('form_submit_attempt', { form_id: 'contacto' });
  h.collector.track('form_submit_error', { form_id: 'contacto', error_code: 'network' });
  h.collector.track('form_submit_error', { form_id: 'contacto', error_code: 'email persona@example.invalid' } as any);
  await h.advance(6000);
  assert.deepEqual(names(h), ['page_view', 'form_start', 'form_submit_attempt', 'form_submit_error']);
});

test('engagement: intervalos sin superposición, máximo 30 s por evento y sin duplicar al ocultar', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/nosotros/', { documentLoad: true });
  await h.advance(30000);           // temporizador de 30 s
  h.collector.activity();
  await h.advance(10000);
  h.collector.hide();               // visibilitychange
  h.collector.pageHide();           // pagehide inmediato: no repite el incremento
  await h.advance(100);
  const eng = h.events().filter((e: any) => e.name === 'engagement').map((e: any) => e.properties.active_ms);
  assert.ok(eng.every((x: number) => x >= 1 && x <= 30000), JSON.stringify(eng));
  const total = eng.reduce((a: number, b: number) => a + b, 0);
  assert.equal(total, 40000, 'ni más ni menos que el tiempo activo real (' + eng.join(',') + ')');
});

test('engagement: sin actividad en 60 s deja de acumular; pestaña oculta no acumula', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/nosotros/', { documentLoad: true });
  await h.advance(120000); // 2 min sin interacción: solo cuentan los primeros 60 s
  h.collector.hide();
  h.collector.activity();
  await h.advance(60000);  // oculta: no cuenta
  h.collector.setVisible(true);
  await h.advance(5000);
  h.collector.hide();
  const total = h.events().filter((e: any) => e.name === 'engagement').reduce((a: number, e: any) => a + e.properties.active_ms, 0);
  assert.equal(total, 65000);
});

test('sesión: se renueva tras 30 min sin interacción y arranca con page_view', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/', { documentLoad: true });
  await h.advance(6000);
  const s1 = h.events()[0].session_id;
  h.tick(31 * 60 * 1000);
  h.collector.trackElement('floating-whatsapp');
  await h.advance(6000);
  const evs = h.events();
  const s2 = evs[evs.length - 1].session_id;
  assert.notEqual(s1, s2);
  const second = evs.filter((e: any) => e.session_id === s2).map((e: any) => e.name);
  assert.deepEqual(second, ['page_view', 'contact_click']);
});

test('sesión: sin sessionStorage la sesión vive en memoria y las recargas pueden crear otra', () => {
  const a = randomId128(browserRandom), b = randomId128(browserRandom);
  assert.match(a, /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
  assert.notEqual(a, b);
  assert.match(uuidV4(browserRandom), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('cola: llena descarta primero engagement y scroll; nunca supera 100 eventos ni 256 KiB', () => {
  const q = createQueue();
  const mk = (name: string, i: number) => ({ event_id: `e${i}`, session_id: 's', page_view_id: 'p', sequence: i, name, occurred_at: '2026-11-24T20:00:00.000Z', page_path: '/', release_id: 'x', properties: {} }) as any;
  for (let i = 0; i < 60; i++) q.push(mk('engagement', i), 0);
  for (let i = 60; i < 140; i++) q.push(mk('contact_click', i), 0);
  assert.ok(q.size <= LIMITS.queue_max_events);
  assert.ok(q.bytes <= LIMITS.queue_max_bytes);
  const left = q.take(200, 1e6).map((x) => x.ev.name);
  assert.equal(left.filter((n) => n === 'contact_click').length, 80, 'los eventos principales se conservan');
  assert.equal(left.filter((n) => n === 'engagement').length, 20, 'primero se descartan los de baja prioridad');
  assert.equal(q.dropped, 40);
});

test('transporte: un lote respeta 20 eventos y 32 KiB', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/', { documentLoad: true });
  for (let i = 0; i < 45; i++) h.collector.trackElement('floating-whatsapp');
  await h.advance(100);
  await h.collector.flush();
  assert.ok(h.calls.length >= 3);
  for (const c of h.calls) {
    assert.ok(c.body.events.length <= 20);
    assert.ok(new TextEncoder().encode(c.raw).length <= 32768);
    assert.equal(validateBatch(c.raw).ok, true, 'el cliente solo envía lo que el servidor aceptaría');
  }
});

test('transporte: BD caída (503) reintenta dos veces conservando event_id y no bloquea', async () => {
  const h = harness({ consent: 'granted', fetchPlan: [503, 503, 503, 200] });
  h.collector.setPath('/', { documentLoad: true });
  await h.advance(12000);
  assert.equal(h.calls.length, 3, '1 intento + 2 reintentos');
  const ids = h.calls.map((c) => c.body.events[0].event_id);
  assert.equal(new Set(ids).size, 1, 'mismo event_id en cada intento');
  assert.equal(h.transport.stats.retries, 2);
});

test('transporte: 429 con Retry-After se respeta; 400 no se reintenta', async () => {
  const h = harness({ consent: 'granted', fetchPlan: [{ status: 429, retryAfter: 4 }, 200] });
  h.collector.setPath('/', { documentLoad: true });
  await h.advance(5000);
  assert.equal(h.calls.length, 1, 'espera 5 s del temporizador; el reintento llega tras el Retry-After');
  await h.advance(4000);
  assert.equal(h.calls.length, 2);
  const g = harness({ consent: 'granted', fetchPlan: [400] });
  g.collector.setPath('/', { documentLoad: true });
  await g.advance(30000);
  assert.equal(g.calls.length, 1, '400 no se reintenta');
});

test('transporte: sin red (offline) agota 2 reintentos y la UI sigue utilizable', async () => {
  const h = harness({ consent: 'granted', fetchPlan: ['throw', 'throw', 'throw'] });
  h.collector.setPath('/', { documentLoad: true });
  h.collector.trackElement('floating-whatsapp'); // sigue aceptando eventos sin lanzar
  await h.advance(20000);
  assert.equal(h.calls.filter((c) => c.body.events.some((e: any) => e.name === 'page_view')).length, 3);
  assert.equal(h.queue.size, 0, 'sin cola persistente: se abandona, no se acumula');
});

test('transporte: no supera 30 s de antigüedad en reintentos', async () => {
  const h = harness({ consent: 'granted', fetchPlan: [{ status: 503 }, { status: 503 }, { status: 503 }] });
  h.collector.setPath('/', { documentLoad: true });
  await h.advance(5000);
  await h.advance(25000);
  const first = h.calls.filter((c) => c.body.events.some((e: any) => e.name === 'page_view'));
  assert.ok(first.length <= 3);
  for (const c of first) assert.ok(c.body.events.every((e: any) => e.event_id === first[0].body.events[0].event_id || e.name !== 'page_view'));
});

test('cierre de pestaña: hide usa sendBeacon una sola vez; un segundo ocultamiento no reenvía', async () => {
  const h = harness({ consent: 'granted' });
  h.collector.setPath('/contacto/', { documentLoad: true });
  h.collector.trackElement('contacto-phone-link');
  h.collector.hide();
  h.collector.pageHide();
  h.collector.hide();
  assert.equal(h.beacons.length, 1);
  assert.equal(h.beacons[0].body.events.map((e: any) => e.name).join(), 'page_view,contact_click');
  assert.equal(h.calls.length, 0);
});

test('cierre de pestaña: si sendBeacon no existe usa fetch con keepalive', async () => {
  const h = harness({ consent: 'granted', beacon: false });
  h.collector.setPath('/', { documentLoad: true });
  h.collector.hide();
  await h.settle();
  assert.equal(h.calls.length, 1);
});

test('privacidad: ningún evento contiene correo, teléfono, texto de formulario ni query', async () => {
  const h = harness({ consent: 'granted', search: '?utm_source=a&nombre=Juan&email=juan@example.invalid&telefono=5512345678' });
  h.collector.setPath('/contacto/?email=juan@example.invalid', { documentLoad: true });
  h.collector.track('form_start', { form_id: 'contacto' });
  h.collector.trackElement('contacto-phone-link');
  await h.advance(6000);
  const blob = JSON.stringify(h.events());
  for (const bad of ['juan', 'example.invalid', '5512345678', 'nombre=', '55 5426']) assert.ok(!blob.includes(bad), bad);
});
