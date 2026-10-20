import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getPublishedPosts, fetchWordPressPage } from './wordpress-build-posts.js';
const post=n=>({slug:'post-'+n,modified:'2026-10-19T10:00:00'});
const result=(posts,total=posts.length,totalPages=1)=>({posts,total,totalPages});
test('one page success',async()=>assert.deepEqual(await getPublishedPosts(async()=>result([post(1)])),[post(1)]));
test('legitimate zero posts',async()=>assert.deepEqual(await getPublishedPosts(async()=>result([],0,0)),[]));
test('network failure',async()=>await assert.rejects(getPublishedPosts(async()=>{throw Error('network');}),/network/));
test('more than 100 articles',async()=>{
  const p=await getPublishedPosts(async n=>result(n===1?Array.from({length:100},(_,i)=>post(i)):[post(100)],101,2));
  assert.equal(p.length,101);
});
test('second page failure',async()=>await assert.rejects(getPublishedPosts(async n=>
  n===1?result(Array.from({length:100},(_,i)=>post(i)),101,2):Promise.reject(Error('HTTP 500'))),/HTTP 500/));
test('partial count',async()=>await assert.rejects(getPublishedPosts(async()=>result([post(1)],2,1)),/count mismatch/));
test('duplicate slug',async()=>await assert.rejects(getPublishedPosts(async()=>result([post(1),post(1)])),/Duplicate/));
test('unsafe slug',async()=>await assert.rejects(getPublishedPosts(async()=>result([{slug:'../bad',modified:post(1).modified}])),/invalid post/));
test('inconsistent pages',async()=>await assert.rejects(getPublishedPosts(async()=>result([post(1)],1,2)),/pagination totals/));
test('bad JSON',async()=>await assert.rejects(fetchWordPressPage(1,async()=>
  new Response('bad',{status:200,headers:{'X-WP-Total':'1','X-WP-TotalPages':'1'}})),/WordPress page 1/));
test('HTTP 500',async()=>await assert.rejects(fetchWordPressPage(1,async()=>new Response('x',{status:500})),/HTTP 500/));
test('missing headers',async()=>await assert.rejects(fetchWordPressPage(1,async()=>new Response('[]',{status:200})),/Missing WordPress pagination headers/));
test('non-array JSON',async()=>await assert.rejects(getPublishedPosts(async()=>result({message:'bad'},1,1)),/non-array/));

const generator=path.join(path.dirname(fileURLToPath(import.meta.url)),'generate-sitemap.js');
function fixture(t,posts=[post(1)],html=true){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'ce-html-04-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  function write(name,data){
    const target=path.join(root,name);
    fs.mkdirSync(path.dirname(target),{recursive:true});
    fs.writeFileSync(target,data);
  }
  write('package.json','{"type":"module"}');
  fs.mkdirSync(path.join(root,'scripts'),{recursive:true});
  fs.copyFileSync(generator,path.join(root,'scripts/generate-sitemap.js'));
  write('src/config/routes.json',JSON.stringify([{path:'/',sitemap:true},{path:'/blog',sitemap:true}]));
  write('dist/.ce-build-posts.json',JSON.stringify({posts}));
  if(html)for(const p of posts)write('dist/blog/'+p.slug+'/index.html','<h1>Article</h1>');
  write('public/sitemap.xml','old sitemap');
  return root;
}
const run=root=>spawnSync(process.execPath,['scripts/generate-sitemap.js'],{cwd:root,encoding:'utf8',timeout:10000});
test('sitemap reuses article snapshot and cleans temporary file',t=>{
  const root=fixture(t),r=run(root);assert.equal(r.status,0,r.stderr);
  const xml=fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8');
  assert.equal(xml,fs.readFileSync(path.join(root,'public/sitemap.xml'),'utf8'));
  assert.match(xml,/\/blog\/post-1/);
  assert.equal(fs.existsSync(path.join(root,'dist/.ce-build-posts.json')),false);
});
test('missing article blocks sitemap and preserves previous sitemap',t=>{
  const root=fixture(t,[post(1)],false),r=run(root);
  assert.equal(r.status,1);assert.match(r.stderr,/Missing prerendered article/);
  assert.equal(fs.readFileSync(path.join(root,'public/sitemap.xml'),'utf8'),'old sitemap');
});
test('missing snapshot blocks sitemap and preserves old one',t=>{
  const root=fixture(t);
  fs.rmSync(path.join(root,'dist/.ce-build-posts.json'));
  assert.equal(run(root).status,1);
  assert.equal(fs.readFileSync(path.join(root,'public/sitemap.xml'),'utf8'),'old sitemap');
});
test('valid empty snapshot generates only static URLs',t=>{
  const root=fixture(t,[]),r=run(root);
  assert.equal(r.status,0,r.stderr);
  assert.doesNotMatch(fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8'),/\/blog\/post-/);
});
