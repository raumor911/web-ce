// NO EJECUTADO: escrito por instrucción de Raúl de no correr pruebas. Ejecutar con `npm run test:telemetry`.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditDist } from './verify-telemetry-dist.mjs';

const CLEAN_COLLECT = '<?php\nconst CE_TELEMETRY_PRIVATE_DIR = "telemetry";\nrequire $ceRoot . "/bootstrap.php";\n';

function mk(files) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ce-dist-'));
  for (const [rel, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(d, rel)), { recursive: true });
    fs.writeFileSync(path.join(d, rel), content);
  }
  return d;
}
const base = { 'telemetria/collect.php': CLEAN_COLLECT, 'telemetria-admin/index.php': '<?php\n// admin\n', 'index.html': '<html></html>' };

test('dist limpio: solo los dos bootstraps públicos', () => {
  assert.deepEqual(auditDist(mk(base)), []);
});
test('falla si viaja server/', () => {
  assert.ok(auditDist(mk({ ...base, 'server/telemetry/src/Ingest.php': '<?php' })).some((p) => p.includes('server/')));
});
test('falla si viaja telemetry-config.php o config.php', () => {
  assert.ok(auditDist(mk({ ...base, 'telemetry-config.php': '<?php return [];' })).some((p) => p.includes('telemetry-config.php')));
  assert.ok(auditDist(mk({ ...base, 'telemetria/config.php': '<?php return [];' })).length > 0);
});
test('falla con una carpeta telemetry/ privada en dist', () => {
  assert.ok(auditDist(mk({ ...base, 'telemetry/bootstrap.php': '<?php' })).some((p) => p.includes('carpeta privada')));
});
test('falla con SQL, .env o PHP extra en las carpetas de telemetría', () => {
  assert.ok(auditDist(mk({ ...base, 'schema/001.sql': 'x' })).length > 0);
  assert.ok(auditDist(mk({ ...base, '.env': 'A=1' })).length > 0);
  assert.ok(auditDist(mk({ ...base, 'telemetria/otro.php': '<?php' })).some((p) => p.includes('no permitido')));
});
test('falla con credenciales, DSN o rutas absolutas en el bootstrap', () => {
  assert.ok(auditDist(mk({ ...base, 'telemetria/collect.php': "<?php $c = ['password' => 'abcd1234'];" })).some((p) => p.includes('sensible')));
  assert.ok(auditDist(mk({ ...base, 'telemetria/collect.php': "<?php new PDO('mysql:host=x');" })).some((p) => p.includes('DSN')));
  assert.ok(auditDist(mk({ ...base, 'telemetria/collect.php': '<?php include "/home9/usuario/telemetry/x.php";' })).some((p) => p.includes('ruta absoluta')));
});
test('falla si falta el bootstrap público esperado', () => {
  const { 'telemetria/collect.php': _drop, ...rest } = base;
  assert.ok(auditDist(mk(rest)).some((p) => p.includes('falta')));
});
test('bandera apagada: el bundle no debe contener el runtime', () => {
  assert.ok(auditDist(mk({ ...base, 'assets/index.js': 'x="ce_telemetry_consent_v1"' }), { expectFlagOff: true }).length > 0);
  assert.deepEqual(auditDist(mk({ ...base, 'assets/index.js': 'x=1' }), { expectFlagOff: true }), []);
});
test('el collect.php real del repositorio pasa la auditoría de patrones', () => {
  const real = fs.readFileSync(new URL('../../public/telemetria/collect.php', import.meta.url), 'utf8');
  const admin = fs.readFileSync(new URL('../../public/telemetria-admin/index.php', import.meta.url), 'utf8');
  assert.deepEqual(auditDist(mk({ ...base, 'telemetria/collect.php': real, 'telemetria-admin/index.php': admin })), []);
});
