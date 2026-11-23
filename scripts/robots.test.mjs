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

// Grupos por agente (RFC 9309): un grupo con User-agent propio ignora el grupo "*",
// así que cada grupo debe repetir Disallow: /blog-admin/ o ese agente podría rastrear WordPress.
function parseGroups(text) {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    if (key === 'user-agent') {
      if (!current || !lastWasAgent) { current = { agents: [], rules: [] }; groups.push(current); }
      current.agents.push(m[2].trim());
      lastWasAgent = true;
    } else if (key === 'allow' || key === 'disallow') {
      if (current) current.rules.push(`${key}: ${m[2].trim()}`);
      lastWasAgent = false;
    } else {
      lastWasAgent = false; // Sitemap u otras directivas
    }
  }
  return groups;
}

const AI_AGENTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'Claude-SearchBot', 'Claude-User', 'ClaudeBot',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended',
];

for (const file of targets) {
  const rel = path.relative(ROOT, file);
  const groups = parseGroups(fs.readFileSync(file, 'utf8'));
  test(`${rel}: cada grupo de agente bloquea /blog-admin/`, () => {
    assert.ok(groups.length > 0);
    for (const g of groups) {
      assert.ok(g.rules.includes('disallow: /blog-admin/'), `grupo sin Disallow /blog-admin/: ${g.agents.join(', ')}`);
    }
  });
  test(`${rel}: existe el grupo comodín *`, () => {
    assert.ok(groups.some(g => g.agents.includes('*')));
  });
  test(`${rel}: agentes de IA declarados a propósito`, () => {
    const declared = new Set(groups.flatMap(g => g.agents));
    for (const agent of AI_AGENTS) assert.ok(declared.has(agent), `falta ${agent}`);
  });
  test(`${rel}: ningún grupo bloquea el sitio completo sin decisión explícita`, () => {
    for (const g of groups) assert.ok(!g.rules.includes('disallow: /'), `Disallow: / en ${g.agents.join(', ')}`);
  });
}
