// Consistencia entre el marcado (ce('id')) y el mapa de IDs versionado (elements.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ELEMENTS } from '../event-schema.ts';

const srcDir = new URL('../../', import.meta.url).pathname;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'telemetry') walk(full, out); }
    else if (/\.tsx$/.test(e.name)) out.push(full);
  }
  return out;
}

const files = walk(srcDir);
const used = new Map<string, string[]>();
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/\bce\('([a-z0-9:_.-]+)'/g)) used.set(m[1], [...(used.get(m[1]) || []), path.relative(srcDir, f)]);
  for (const m of text.matchAll(/ceNav\('footer', '([^']+)'\)/g)) {
    const id = 'footer-nav-' + m[1].replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
    used.set(id, [...(used.get(id) || []), path.relative(srcDir, f)]);
  }
}

test('marcado: todo ce(\'id\') existe en elements.json', () => {
  assert.ok(used.size > 40, 'se esperaba encontrar el marcado comercial');
  for (const id of used.keys()) assert.ok(Object.prototype.hasOwnProperty.call(ELEMENTS, id), `ID sin registrar: ${id}`);
});

test('marcado: todo ID del registro se usa en el marcado (salvo los de navegación de la barra, que se derivan del enlace)', () => {
  for (const id of Object.keys(ELEMENTS)) {
    if (id.startsWith('navbar-nav-')) continue;
    assert.ok(used.has(id), `ID registrado y sin uso: ${id}`);
  }
});

test('marcado: los enlaces de la barra tienen su ID registrado', () => {
  const navbar = fs.readFileSync(path.join(srcDir, 'components/Navbar.tsx'), 'utf8');
  assert.ok(/ceNav\('navbar', item\.href\)/.test(navbar));
  for (const slug of ['proyectos', 'nosotros', 'contacto', 'blog', 'soluciones-venta-renta', 'soluciones-oficinas']) {
    assert.ok(ELEMENTS['navbar-nav-' + slug], slug);
  }
});

test('marcado: ningún componente lee innerText ni inputs para medir; el módulo de telemetría no usa fingerprinting ni terceros', () => {
  const dir = path.join(srcDir, 'telemetry');
  const code = fs.readdirSync(dir).filter((f) => /\.(ts|tsx)$/.test(f)).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/ \/\/ .*$/gm, '');
  for (const bad of ['innerText', 'textContent', 'HTMLInputElement', 'HTMLTextAreaElement', 'canvas', 'AudioContext', 'getClientRects', 'localStorage.setItem(\'ce_id', 'googletagmanager', 'rrweb', 'preventDefault']) {
    assert.ok(!code.includes(bad), `no debe aparecer ${bad}`);
  }
  assert.ok(!/https?:\/\/(?!creativosespacios)/.test(code.replace(/\/\/.*$/gm, '')), 'sin URLs de terceros en el código del recolector');
});
