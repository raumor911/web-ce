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
// así que cada grupo debe repetir Disallow: /blog-admin/ (o bloquear todo con Disallow: /)
// o ese agente podría rastrear WordPress.
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

// Política de Raúl Morales: el sitio NO se usa para entrenar modelos de IA; sí se permiten
// los agentes de búsqueda y los que actúan a petición de un usuario.
const TRAINING_AGENTS = [
  'GPTBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'Applebot-Extended',
  'CCBot', 'Meta-ExternalAgent', 'Amazonbot', 'Bytespider', 'cohere-ai',
];
const SEARCH_AND_ON_DEMAND_AGENTS = [
  'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'Amzn-SearchBot',
  'ChatGPT-User', 'Claude-User', 'Perplexity-User', 'Amzn-User',
];

for (const file of targets) {
  const rel = path.relative(ROOT, file);
  const groups = parseGroups(fs.readFileSync(file, 'utf8'));
  const groupOf = agent => groups.find(g => g.agents.includes(agent));
  test(`${rel}: cada grupo bloquea /blog-admin/ (o todo el sitio)`, () => {
    assert.ok(groups.length > 0);
    for (const g of groups) {
      assert.ok(
        g.rules.includes('disallow: /blog-admin/') || g.rules.includes('disallow: /'),
        `grupo sin Disallow /blog-admin/: ${g.agents.join(', ')}`
      );
    }
  });
  test(`${rel}: existe el grupo comodín * y no bloquea todo el sitio`, () => {
    const star = groups.find(g => g.agents.includes('*'));
    assert.ok(star);
    assert.ok(!star.rules.includes('disallow: /'));
  });
  test(`${rel}: agentes de entrenamiento bloqueados con Disallow: /`, () => {
    for (const agent of TRAINING_AGENTS) {
      const g = groupOf(agent);
      assert.ok(g, `falta ${agent}`);
      assert.ok(g.rules.includes('disallow: /'), `${agent} sin Disallow: /`);
      assert.ok(!g.rules.includes('allow: /'), `${agent} con Allow: / contradictorio`);
    }
  });
  test(`${rel}: agentes de búsqueda y a petición permitidos y sin acceso a /blog-admin/`, () => {
    for (const agent of SEARCH_AND_ON_DEMAND_AGENTS) {
      const g = groupOf(agent);
      assert.ok(g, `falta ${agent}`);
      assert.ok(!g.rules.includes('disallow: /'), `${agent} bloqueado por Disallow: /`);
      assert.ok(g.rules.includes('disallow: /blog-admin/'), `${agent} sin Disallow /blog-admin/`);
    }
  });
  test(`${rel}: los agentes de búsqueda no comparten grupo con los de entrenamiento`, () => {
    for (const agent of SEARCH_AND_ON_DEMAND_AGENTS) {
      assert.ok(!TRAINING_AGENTS.some(t => groupOf(agent).agents.includes(t)), agent);
    }
  });
}
