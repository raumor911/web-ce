import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalPath, canonicalUrl } from './canonicalUrl.mjs';

test('raíz', () => {
  assert.equal(canonicalUrl('/'), 'https://creativosespacios.mx/');
  assert.equal(canonicalUrl(''), 'https://creativosespacios.mx/');
});
test('páginas terminan en barra, con o sin barra de entrada', () => {
  for (const p of ['/nosotros', '/nosotros/', 'nosotros', '//nosotros//']) {
    assert.equal(canonicalUrl(p), 'https://creativosespacios.mx/nosotros/');
  }
  assert.equal(canonicalUrl('/blog/un-articulo'), 'https://creativosespacios.mx/blog/un-articulo/');
});
test('archivos con extensión no llevan barra', () => {
  for (const p of ['/ai/cases.json', '/ai/cases.md/', '/robots.txt', '/sitemap.xml', '/llms.txt']) {
    assert.ok(!canonicalPath(p).endsWith('/'), p);
  }
  assert.equal(canonicalUrl('/sitemap.xml'), 'https://creativosespacios.mx/sitemap.xml');
});
test('es idempotente', () => {
  for (const p of ['/', '/nosotros', '/ai/cases.json']) {
    assert.equal(canonicalPath(canonicalPath(p)), canonicalPath(p));
  }
});
