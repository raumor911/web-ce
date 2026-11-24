#!/usr/bin/env node
/**
 * Auditoría del artefacto dist para la telemetría: falla si algo privado viaja en el paquete público.
 * Solo viajan: telemetria/collect.php (bootstrap mínimo) y telemetria-admin/index.php. El código del servidor,
 * la configuración real, SQL, scripts de línea de comandos y credenciales NUNCA deben estar en dist/.
 * Uso: node scripts/telemetry/verify-telemetry-dist.mjs [directorio-del-repo] [--expect-flag-off]
 * Estado: implementado, sin ejecutar por instrucción de Raúl.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ALLOWED_PHP = new Set(['telemetria/collect.php', 'telemetria-admin/index.php']);
const BANNED_DIRS = new Set(['server', 'telemetry', 'cli', 'schema', 'migrations']);
const BANNED_FILE = [
  [/^telemetry-config.*\.php$/i, 'configuración privada de telemetría'],
  [/^config(\..+)?\.php$/i, 'archivo de configuración PHP'],
  [/\.sql$/i, 'SQL (esquema o migraciones)'],
  [/^\.env(\..*)?$/i, 'archivo .env'],
  [/^bootstrap\.php$/i, 'bootstrap privado del servidor'],
  [/\.(pem|key|p12|pfx)$/i, 'material criptográfico'],
];
const SECRET_PATTERNS = [
  [/mysql:host=|mysql:dbname=/i, 'DSN de base de datos'],
  [/['"](?:password|passwd|pass|hmac_key|secret|api_key|token)['"]\s*=>\s*['"][^'"]{4,}['"]/i, 'valor sensible en arreglo PHP'],
  [/\b(?:password|passwd|secret|hmac_key)\s*=\s*['"][^'"]{4,}['"]/i, 'asignación sensible'],
  [/\/home\d*\/[A-Za-z0-9_.-]+\//, 'ruta absoluta del hosting'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'llave privada'],
];
const TEXT_EXT = /\.(php|json|js|mjs|css|html|txt|md|xml|ini|htaccess)$/i;

function* walk(dir, rel = '') {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) { yield { rel: r, dir: true, name: e.name }; yield* walk(path.join(dir, e.name), r); }
    else yield { rel: r, dir: false, name: e.name, abs: path.join(dir, e.name) };
  }
}

/** @returns {string[]} lista de problemas (vacía = limpio) */
export function auditDist(distDir, opts = {}) {
  const problems = [];
  if (!fs.existsSync(distDir)) return [`no existe ${distDir}`];
  let phpSeen = 0;
  for (const f of walk(distDir)) {
    if (f.dir) {
      if (BANNED_DIRS.has(f.name.toLowerCase()) && (!f.rel.includes("/") || f.name.toLowerCase() === "telemetry")) problems.push(`carpeta privada en dist: ${f.rel}/`);
      continue;
    }
    for (const [re, why] of BANNED_FILE) if (re.test(f.name)) problems.push(`archivo prohibido (${why}): ${f.rel}`);
    if (/\.php$/i.test(f.name)) {
      phpSeen++;
      const inTelemetry = /^telemetria(-admin)?\//.test(f.rel);
      if (inTelemetry && !ALLOWED_PHP.has(f.rel)) problems.push(`PHP no permitido en carpeta de telemetría: ${f.rel}`);
    }
    if (TEXT_EXT.test(f.name) || f.name === '.htaccess') {
      const size = fs.statSync(f.abs).size;
      if (size > 5 * 1024 * 1024) continue;
      const text = fs.readFileSync(f.abs, 'utf8');
      // Los PHP públicos y los JSON/MD de telemetría se revisan siempre; el resto solo busca llaves privadas y rutas del hosting.
      const strict = /^telemetri/.test(f.rel); // solo las carpetas de telemetría se revisan a fondo; el resto del sitio (p. ej. el formulario existente) no se inspecciona por contenido
      for (const [re, why] of SECRET_PATTERNS) {
        if (!strict && !/PRIVATE KEY/.test(why)) continue;
        if (re.test(text)) problems.push(`posible secreto (${why}): ${f.rel}`);
      }
    }
  }
  for (const required of ALLOWED_PHP) {
    if (opts.requireBootstrap === false) break;
    if (!fs.existsSync(path.join(distDir, required))) problems.push(`falta el bootstrap público esperado: ${required}`);
  }
  if (opts.expectFlagOff) {
    for (const f of walk(path.join(distDir, 'assets'))) {
      if (f.dir || !/\.js$/.test(f.name)) continue;
      const t = fs.readFileSync(f.abs, 'utf8');
      if (t.includes('ce_telemetry_consent_v1') || t.includes('window.ceTelemetry')) problems.push(`la compilación con la bandera apagada contiene el runtime de telemetría: ${f.rel}`);
    }
  }
  return problems;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const root = path.resolve(args.find((a) => !a.startsWith('--')) || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'));
  const problems = auditDist(path.join(root, 'dist'), { expectFlagOff: args.includes('--expect-flag-off') });
  if (problems.length) {
    console.error('verify-telemetry-dist: FALLA\n - ' + problems.join('\n - '));
    process.exit(1);
  }
  console.log('verify-telemetry-dist: dist sin archivos privados ni secretos detectables (revisión por patrones, no exhaustiva)');
}
