import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRelease, enumerateRelease } from './package-hostgator.mjs';
const src=path.join(path.dirname(fileURLToPath(import.meta.url)),'package-hostgator.mjs');
const stamp=new Date('2026-10-21T12:00:00Z'),commit='a'.repeat(40);
function write(root,rel,s='x'){let p=path.join(root,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);}
function fixture(t){
  let root=fs.mkdtempSync(path.join(os.tmpdir(),'ce-html06-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  write(root,'dist/index.html','<html>Home</html>');
  write(root,'dist/404.html','<html>404</html>');
  write(root,'dist/robots.txt','User-agent: *');
  write(root,'dist/sitemap.xml','<urlset><url><loc>https://creativosespacios.mx/</loc></url></urlset>');
  write(root,'dist/assets/index-hash.js','console.log(1)');
  write(root,'dist/assets/index-hash.css','body{}');
  write(root,'dist/compra-contenedores-cdmx/index.html','<h1>Venta</h1>');
  write(root,'dist/.htaccess','DO NOT DEPLOY');
  write(root,'dist/formulario-creativosespacios.php','<?php ?>');
  write(root,'dist/blog-admin/wp-config.php','SECRET');
  write(root,'dist/wp-config.php','SECRET');
  write(root,'src/config/routes.json',JSON.stringify([{path:'/',prerender:true},{path:'/404',prerender:true}]));
  return root;
}
function entries(archive){let x=spawnSync('unzip',['-Z','-1',archive],{encoding:'utf8'});assert.equal(x.status,0);return x.stdout.trim().split('\n');}
test('root structure excludes PHP, WP and .htaccess',t=>{
  let r=createRelease({root:fixture(t),stamp,commit}),names=entries(r.archive);
  assert.ok(names.includes('index.html')&&names.includes('assets/index-hash.js')&&names.includes('compra-contenedores-cdmx/index.html'));
  assert.ok(names.every(n=>!n.startsWith('dist/')&&!n.endsWith('.php')&&!n.includes('wp-')&&!n.includes('.htaccess')&&!n.includes('blog-admin')));
  assert.ok(r.manifest.excluded.includes('formulario-creativosespacios.php'));
  assert.ok(r.manifest.excluded.includes('.htaccess'));
  assert.equal(r.manifest.routeCount,2);
  assert.equal(r.manifest.sitemapUrlCount,1);
  assert.equal(r.manifest.files.length,names.length);
});
test('SHA-256 manifest includes archive and file hashes and commit',t=>{
  let r=createRelease({root:fixture(t),stamp,commit});
  assert.match(r.manifest.archiveSha256,/^[a-f0-9]{64}$/);
  assert.ok(r.manifest.files.every(f=>/^[a-f0-9]{64}$/.test(f.sha256)));
  assert.equal(r.manifest.sourceCommit,commit);
  assert.ok(fs.existsSync(r.archive.replace(/\.zip$/,'.manifest.json')));
  assert.ok(fs.existsSync(r.archive.replace(/\.zip$/,'.sha256')));
});
test('missing HTML fails before archive creation',t=>{
  let root=fixture(t);fs.rmSync(path.join(root,'dist/404.html'));
  assert.throws(()=>createRelease({root,stamp,commit}),/Required frontend file missing/);
  assert.equal(fs.existsSync(path.join(root,'release-artifacts')),false);
});
test('JS bundle missing is rejected',t=>{
  let root=fixture(t);fs.rmSync(path.join(root,'dist/assets/index-hash.js'));
  assert.throws(()=>enumerateRelease(path.join(root,'dist')),/No Vite JS bundle/);
});
test('symbolic links are rejected',t=>{
  let root=fixture(t);fs.symlinkSync('/etc/passwd',path.join(root,'dist/linked'));
  assert.throws(()=>enumerateRelease(path.join(root,'dist')),/Symlink not permitted/);
});
test('hidden WordPress build snapshot is rejected',t=>{
  let root=fixture(t);write(root,'dist/.ce-build-posts.json','SECRET');
  assert.throws(()=>createRelease({root,stamp,commit}),/Unexpected hidden/);
});
test('existing ZIP is not overwritten',t=>{
  let root=fixture(t);createRelease({root,stamp,commit});
  assert.throws(()=>createRelease({root,stamp,commit}),/already exists/);
});
test('existing manifest is never deleted if archive absent',t=>{
  let root=fixture(t),name='ce-hostgator-2026-10-21T12-00-00-000Z-aaaaaaaa';
  write(root,'release-artifacts/'+name+'.manifest.json','preserve');
  assert.throws(()=>createRelease({root,stamp,commit}),/already exists/);
  assert.equal(fs.readFileSync(path.join(root,'release-artifacts',name+'.manifest.json'),'utf8'),'preserve');
});
test('CLI blocks when CE-HTML-03/04 are not integrated',t=>{
  let root=fixture(t);write(root,'scripts/package-hostgator.mjs',fs.readFileSync(src));
  let r=spawnSync(process.execPath,[path.join(root,'scripts/package-hostgator.mjs')],{cwd:root,encoding:'utf8'});
  assert.equal(r.status,1);assert.match(r.stderr,/Cannot package before merging prerequisite/);
  assert.equal(fs.existsSync(path.join(root,'release-artifacts')),false);
});
