import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCases, htmlMetadata, probe, ORIGIN } from './audit-apache-urls.mjs';

const html = (canonical = '/compra-contenedores-cdmx', title = 'Comprar contenedores en CDMX') =>
  '<html><head><title>' + title + '</title><link rel="canonical" href="' + ORIGIN + canonical +
  '"></head><body><h1>' + title + '</h1></body></html>';
const makeFetch = entries => async url => {
  const name = new URL(url).pathname;
  const item = entries[name];
  if (!item) throw Error('no fixture ' + name);
  return new Response(item.body || '', { status: item.status, headers: item.headers || {} });
};
const page = { path: '/compra-contenedores-cdmx', kind: 'html', expected: '/compra-contenedores-cdmx' };

test('extrae título, H1 y canonical de HTML inicial', () => {
  assert.deepEqual(htmlMetadata(html()), {
    title: 'Comprar contenedores en CDMX', h1: 'Comprar contenedores en CDMX',
    canonical: ORIGIN + '/compra-contenedores-cdmx'
  });
});
test('HTML especializado válido pasa', async () => {
  const r = await probe(page, { request: makeFetch({ '/compra-contenedores-cdmx': { status: 200, body: html() } }) });
  assert.equal(r.state, 'OK'); assert.equal(r.status, 200); assert.equal(r.redirects.length, 0);
});
test('HTML shell genérico se rechaza', async () => {
  const r = await probe(page, { request: makeFetch({ '/compra-contenedores-cdmx': {
    status: 200, body: '<title>Creativos Espacios | Infraestructura Modular</title><div id="root"></div>'
  } }) });
  assert.equal(r.state, 'DEFECTO'); assert.match(r.issues.join(' '), /Missing H1/);
});
test('canonical de otra ruta se rechaza', async () => {
  const r = await probe(page, { request: makeFetch({ '/compra-contenedores-cdmx': { status: 200, body: html('/') } }) });
  assert.equal(r.state, 'DEFECTO'); assert.match(r.issues.join(' '), /Canonical mismatch/);
});
test('redirección a URL con slash conserva HTML pero advierte', async () => {
  const r = await probe(page, { request: makeFetch({
    '/compra-contenedores-cdmx': { status: 301, headers: { location: '/compra-contenedores-cdmx/' } },
    '/compra-contenedores-cdmx/': { status: 200, body: html() }
  }) });
  assert.equal(r.state, 'OBSERVAR'); assert.equal(r.redirects.length, 1);
});
test('ruta inexistente debe responder 404 o 410', async () => {
  const missing = { path: '/inexistente', kind: 'missing' };
  assert.equal((await probe(missing, { request: makeFetch({ '/inexistente': { status: 404 } }) })).state, 'OK');
  assert.equal((await probe(missing, { request: makeFetch({ '/inexistente': { status: 200 } }) })).state, 'DEFECTO');
});
test('redirección heredada exige destino esperado', async () => {
  const c = { path: '/catalogo', kind: 'redirect', expected: '/soluciones/venta-renta' };
  const r = await probe(c, { request: makeFetch({
    '/catalogo': { status: 301, headers: { location: '/soluciones/venta-renta' } },
    '/soluciones/venta-renta': { status: 200 }
  }) });
  assert.equal(r.state, 'OK');
});
test('no seguir redirecciones fuera del dominio', async () => {
  const r = await probe(page, { request: makeFetch({
    '/compra-contenedores-cdmx': { status: 302, headers: { location: 'https://otro-dominio.example/' } }
  }) });
  assert.equal(r.state, 'NO_VERIFICABLE'); assert.match(r.warnings.join(' '), /expected origin/);
});
test('no confunde fallos de red con una prueba correcta', async () => {
  const r = await probe(page, { request: async () => { throw Error('network failed'); } });
  assert.equal(r.state, 'NO_VERIFICABLE');
});
test('WordPress 403 no implica avería', async () => {
  const r = await probe({ path: '/blog-admin/', kind: 'wordpress' }, {
    request: makeFetch({ '/blog-admin/': { status: 403 } })
  });
  assert.equal(r.state, 'OBSERVAR');
});
test('genera variantes sin barra y caso de blog según sitemap', () => {
  const c = buildCases([{ path:'/',prerender:true },{ path:'/blog',prerender:true },
    { path:'/compra-contenedores-cdmx',prerender:true }],
    '<loc>' + ORIGIN + '/blog/articulo-ejemplo</loc>', true);
  assert.ok(c.some(x => x.path === '/blog/'));
  assert.ok(c.some(x => x.path === '/blog/articulo-ejemplo'));
  assert.ok(c.some(x => x.kind === 'missing'));
});
