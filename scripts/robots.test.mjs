// Verifica que robots.txt (fuente y, si existe, dist) declare los dos sitemaps
// y bloquee /blog-admin/. Sin dependencias: node --test scripts/robots.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = [path.join(ROOT, 'public/robots.txt')];
if (process.env.CHECK_DIST === '1' || fs.existsSync(path.join(ROOT, 'dist/robots.txt'))) {
  targets.push(path.join(ROOT, 'dist/robots.txt'));
}

for (const file of targets) {
  const rel = path.relative(ROOT, file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).map(l => l.trim());
  test(`${rel}: Disallow /blog-admin/`, () => {
    assert.ok(lines.includes('Disallow: /blog-admin/'));
  });
  test(`${rel}: Sitemap sitemap.xml`, () => {
    assert.ok(lines.includes('Sitemap: https://creativosespacios.mx/sitemap.xml'));
  });
  test(`${rel}: Sitemap sitemap-blog.xml`, () => {
    assert.ok(lines.includes('Sitemap: https://creativosespacios.mx/sitemap-blog.xml'));
  });
}
