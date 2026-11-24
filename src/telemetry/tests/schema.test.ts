/* eslint-disable @typescript-eslint/no-explicit-any */
// Pruebas del contrato de eventos (sección 18: Esquema, Privacidad). Casos compartidos con la prueba PHP.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LIMITS, normalizePath, validateBatch, validateEvent, routeIdFor, CONTRACT, ELEMENTS } from '../event-schema.ts';

const fx = JSON.parse(fs.readFileSync(new URL('../../../server/telemetry/tests/fixtures/validation-cases.json', import.meta.url), 'utf8'));

function build(c: { base: string; patch?: Record<string, unknown> }) {
  const ev: any = {
    event_id: fx.ids.event, session_id: fx.ids.session, page_view_id: fx.ids.view, sequence: 7,
    occurred_at: '2026-11-24T20:15:10.000Z', release_id: 'abc1234', ...structuredClone(fx.bases[c.base]),
  };
  for (const [k, v] of Object.entries(c.patch || {})) {
    const parts = k.split('.');
    let o = ev;
    while (parts.length > 1) o = o[parts.shift() as string];
    if (v === null) delete o[parts[0]]; else o[parts[0]] = v;
  }
  return ev;
}

for (const c of fx.event_cases) {
  test(`evento: ${c.id}`, () => {
    const r = validateEvent(build(c));
    if (c.expect === 'ok') assert.equal(r.ok, true, JSON.stringify(r));
    else { assert.equal(r.ok, false); assert.equal(r.error, c.expect); }
  });
}

for (const c of fx.path_cases) {
  test(`ruta: ${JSON.stringify(c.input)}`, () => assert.equal(normalizePath(c.input), c.expect));
}

for (const c of fx.batch_cases) {
  test(`lote: ${c.id}`, () => { const r = validateBatch(c.body); assert.equal(r.ok, false); assert.equal(r.error, c.expect); });
}

test('lote: 20 eventos válidos pasan y 21 se rechazan', () => {
  const mk = (n: number) => Array.from({ length: n }, (_, i) => ({
    ...build({ base: 'page_view' }), event_id: `11111111-1111-4111-8111-${String(i).padStart(12, '0')}`,
  }));
  assert.equal(validateBatch(JSON.stringify({ schema_version: 1, events: mk(20) })).ok, true);
  const r = validateBatch(JSON.stringify({ schema_version: 1, events: mk(21) }));
  assert.equal(r.error, 'too_many_events');
});

test('lote: event_id repetido dentro del lote se rechaza', () => {
  const e = build({ base: 'page_view' });
  assert.equal(validateBatch(JSON.stringify({ schema_version: 1, events: [e, e] })).error, 'duplicate_in_batch');
});

test('lote: cuerpo mayor a 32 KiB UTF-8 se rechaza antes de parsear', () => {
  const body = JSON.stringify({ schema_version: 1, events: [], pad: 'é'.repeat(17000) });
  assert.equal(validateBatch(body).error, 'too_large');
});

test('lote: un evento inválido rechaza el lote completo', () => {
  const good = build({ base: 'page_view' });
  const bad = { ...build({ base: 'page_view' }), event_id: '44444444-4444-4444-8444-444444444444', name: 'x' };
  const r = validateBatch(JSON.stringify({ schema_version: 1, events: [good, bad] }));
  assert.equal(r.ok, false);
  assert.match(r.error as string, /^event_1:/);
});

test('route_id: rutas conocidas, blog dinámico y desconocidas', () => {
  assert.equal(routeIdFor('/'), 'home');
  assert.equal(routeIdFor('/contacto/'), 'contacto');
  assert.equal(routeIdFor('/blog/'), 'blog');
  assert.equal(routeIdFor('/blog/un-articulo/'), 'blog-post');
  assert.equal(routeIdFor('/no-existe/'), null);
});

test('contrato: las rutas del contrato coinciden con src/config/routes.json', () => {
  const routes = JSON.parse(fs.readFileSync(new URL('../../config/routes.json', import.meta.url), 'utf8'));
  const expected = new Set(routes.map((r: { id: string }) => r.id));
  const actual = new Set(Object.values(CONTRACT.routes as Record<string, string>));
  assert.deepEqual([...actual].sort(), [...expected].sort());
  for (const r of routes) assert.equal(routeIdFor(normalizePath(r.path) as string), r.id);
});

test('contrato: todo elemento del registro usa enums y eventos del contrato', () => {
  const events = Object.keys(CONTRACT.events);
  for (const [id, el] of Object.entries(ELEMENTS)) {
    assert.match(id, new RegExp(CONTRACT.patterns.id), id);
    assert.ok(events.includes(el.event), id);
    assert.ok((CONTRACT.enums.placement as string[]).includes(el.placement), id);
    if (el.event === 'contact_click') {
      assert.ok((CONTRACT.enums.channel as string[]).includes(el.channel as string), id);
      assert.ok((CONTRACT.enums.intent as string[]).includes(el.intent as string), id);
    }
  }
});

test('contrato: límites del lote coinciden con la especificación', () => {
  assert.equal(LIMITS.max_events_per_request, 20);
  assert.equal(LIMITS.max_body_bytes, 32 * 1024);
  assert.equal(LIMITS.queue_max_events, 100);
  assert.equal(LIMITS.queue_max_bytes, 256 * 1024);
  assert.equal(LIMITS.engagement_max_ms, 30000);
  assert.equal(LIMITS.session_idle_ms, 30 * 60 * 1000);
});
