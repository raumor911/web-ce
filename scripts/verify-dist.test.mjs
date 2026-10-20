import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const command = path.join(path.dirname(fileURLToPath(import.meta.url)), 'verify-dist.mjs');
const domain = 'https://creativosespacios.mx';
function write(root, name, value) {
  const file = path.join(root, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}
function html(route, title) {
  return '<html><head><title>' + title + '</title><meta name="description" content="Texto comercial" />' +
    '<link rel="canonical" href="' + domain + route + '" />' +
    '<link rel="stylesheet" href="/assets/site.css" />' +
    '<script src="/assets/site.js"></script></head>' +
    '<body><h1>' + title + '</h1><p>Contenido propio de la página.</p></body></html>';
}
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ce-html-03-'));
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  write(root, 'src/config/routes.json', JSON.stringify([
    {path:'/',prerender:true,sitemap:true},
    {path:'/compra-contenedores-cdmx',prerender:true,sitemap:true},
    {path:'/404',prerender:true,sitemap:false}
  ]));
  write(root, 'dist/sitemap.xml', '<urlset>' + ['/', '/compra-contenedores-cdmx', '/blog/post']
    .map(p => '<url><loc>' + domain + p + '</loc></url>').join('') + '</urlset>');
  write(root, 'public/.htaccess', 'RewriteEngine On');
  write(root, 'dist/.htaccess', 'RewriteEngine On');
  write(root, 'dist/index.html', html('/', 'Inicio CE'));
  write(root, 'dist/compra-contenedores-cdmx/index.html', html('/compra-contenedores-cdmx','Comprar contenedor CDMX'));
  write(root, 'dist/blog/post/index.html', html('/blog/post','Artículo de contenedores'));
  write(root, 'dist/404.html', html('/404','404 - Página no encontrada'));
  write(root, 'dist/assets/site.js', 'console.log(1)');
  write(root, 'dist/assets/site.css', 'body{margin:0}');
  return root;
}
const run = (root, ...args) => spawnSync(process.execPath, [command, root, ...args], {encoding:'utf8', timeout:10000});

test('build íntegro: se acepta e informa cada ruta', t => {
  const r=run(fixture(t)); assert.equal(r.status,0,r.stderr);
  assert.match(r.stdout,/4 correctas, 0 defectuosas/);
});
for (const [name, edit, evidence] of [
  ['HTML ausente', root => fs.rmSync(path.join(root,'dist/compra-contenedores-cdmx/index.html')), /falta compra-contenedores-cdmx/],
  ['HTML genérico', root => write(root,'dist/compra-contenedores-cdmx/index.html','<title>Creativos Espacios | Infraestructura Modular</title>'), /HTML genérico/],
  ['canonical equivocado', root => write(root,'dist/compra-contenedores-cdmx/index.html',html('/','Comprar contenedor CDMX')), /canonical incorrecto/],
  ['fallback 404', root => write(root,'dist/compra-contenedores-cdmx/index.html',html('/compra-contenedores-cdmx','404 - Página no encontrada')), /Fallback 404/],
  ['bundle JS faltante', root => fs.rmSync(path.join(root,'dist/assets/site.js')), /Recurso ausente/],
  ['HTML idéntico al inicio', root => write(root,'dist/compra-contenedores-cdmx/index.html',fs.readFileSync(path.join(root,'dist/index.html'))), /HTML idéntico/],
  ['post faltante', root => fs.rmSync(path.join(root,'dist/blog/post/index.html')), /blog\/post: falta/],
  ['htaccess ausente', root => fs.rmSync(path.join(root,'dist/.htaccess')), /Falta dist\/\.htaccess/]
]) {
  test('rechaza ' + name, t => {
    const root=fixture(t); edit(root); const r=run(root);
    assert.equal(r.status,1,name + ': ' + r.stdout); assert.match(r.stderr,evidence);
  });
}
test('umbral de artículos es opcional', t => {
  const root=fixture(t); assert.equal(run(root).status,0);
  assert.equal(run(root,'--min-blog=2').status,1);
});
test('manifiesto SHA256 solamente tras éxito', t => {
  const root=fixture(t), out=path.join(root,'ce-dist-manifest.sha256');
  assert.equal(run(root,'--manifest').status,0); assert.ok(fs.existsSync(out));
  assert.match(fs.readFileSync(out,'utf8'),/assets\/site\.js/);
});
