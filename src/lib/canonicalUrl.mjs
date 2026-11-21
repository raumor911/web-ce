// Regla única de URLs del sitio (Opción A: barra final).
//  - Toda ruta de página termina en "/" (la raíz es "/").
//  - Los archivos con extensión (/ai/cases.json, /robots.txt) no llevan barra.
// Módulo .mjs sin dependencias para que lo usen la app (Vite/TS) y los scripts de Node.
export const CANONICAL_ORIGIN = 'https://creativosespacios.mx';

export function canonicalPath(path) {
  const raw = String(path ?? '').trim();
  const clean = raw.replace(/^\/+|\/+$/g, '');
  if (!clean) return '/';
  const last = clean.split('/').pop();
  return /\.[A-Za-z0-9]+$/.test(last) ? `/${clean}` : `/${clean}/`;
}

export function canonicalUrl(path) {
  return CANONICAL_ORIGIN + canonicalPath(path);
}
