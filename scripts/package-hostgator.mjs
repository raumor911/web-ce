#!/usr/bin/env node
/** CE-HTML-06 — non-destructive, manually uploaded HostGator frontend package.
 * Node >=18. Requires system zip/unzip; adds no npm dependencies.
 * Does not connect to HostGator, modify Apache, or publish a release.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT_REQUIRED = ['index.html', '404.html', 'sitemap.xml', 'robots.txt'];
const protectedSegment = segment => /^(?:blog-admin|wp-admin|wp-content|wp-includes|cgi-bin)$/i.test(segment)
  || /^wp-/i.test(segment);
const phpName = name => /\.(?:php\d*|phtml|phar)$/i.test(name);
const concealed = segment => segment.startsWith('.');
const hex = data => crypto.createHash('sha256').update(data).digest('hex');

export function enumerateRelease(dist) {
  if (!fs.statSync(dist, { throwIfNoEntry: false })?.isDirectory()) {
    throw Error('Missing dist/. Build first.');
  }
  const selected = [];
  const excluded = [];
  function walk(current, prefix = '') {
    for (const dirent of fs.readdirSync(current, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
      const relative = prefix ? prefix + '/' + dirent.name : dirent.name;
      const full = path.join(current, dirent.name);
      if (dirent.isSymbolicLink()) throw Error('Symlink not permitted in release: ' + relative);
      if (relative.includes('\\') || /[\r\n]/.test(relative)) throw Error('Unsafe file name: ' + relative);
      const bits = relative.split('/');
      if (bits.some(protectedSegment) || phpName(dirent.name) || dirent.name === '.htaccess') {
        excluded.push(relative + (dirent.isDirectory() ? '/' : ''));
        continue;
      }
      if (bits.some(concealed)) {
        if (dirent.name === '.DS_Store' || /\.map$/i.test(dirent.name)) {
          excluded.push(relative);
          continue;
        }
        throw Error('Unexpected hidden file/directory in dist: ' + relative);
      }
      if (dirent.isDirectory()) walk(full, relative);
      else if (dirent.isFile()) {
        if (/\.(?:map|bak|old|zip|tar|gz|sql|sqlite|db|pem|key|log)$/i.test(dirent.name)) {
          excluded.push(relative);
        } else {
          selected.push(relative);
        }
      } else throw Error('Unsupported entry in dist: ' + relative);
    }
  }
  walk(dist);
  selected.sort();
  for (const required of ROOT_REQUIRED) {
    if (!selected.includes(required)) throw Error('Required frontend file missing: ' + required);
  }
  if (!selected.some(file => /^assets\/[^/]+\.js$/i.test(file))) throw Error('No Vite JS bundle in dist/assets/');
  if (!selected.some(file => /^assets\/[^/]+\.css$/i.test(file))) throw Error('No Vite CSS bundle in dist/assets/');
  return { selected, excluded };
}
function command(bin, args, options = {}) {
  const result = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024, ...options });
  if (result.error) throw Error(`${bin} is required: ${result.error.message}`);
  if (result.status !== 0) throw Error(`${bin} failed (code ${result.status}): ${result.stderr || result.stdout || ''}`.trim());
  return (result.stdout || '').trim();
}

export function createRelease({ root = ROOT, stamp = new Date(), commit = 'unverified-fixture' } = {}) {
  const dist = path.join(root, 'dist');
  const out = path.join(root, 'release-artifacts');
  const { selected, excluded } = enumerateRelease(dist);
  fs.mkdirSync(out, { recursive: true });
  const name = `ce-hostgator-${stamp.toISOString().replace(/[:.]/g, '-').replace('Z','Z')}-${commit.slice(0,8)}`;
  const archive = path.join(out, name + '.zip');
  for (const output of [archive, path.join(out, name + '.manifest.json'), path.join(out, name + '.sha256')]) {
    if (fs.existsSync(output)) throw Error('Release artifact already exists: ' + output);
  }
  const files = selected.map(relative => {
    const buffer = fs.readFileSync(path.join(dist, ...relative.split('/')));
    return { path: relative, size: buffer.length, sha256: hex(buffer) };
  });
  try {
    // -@ uses explicit relative filenames: archive root is public_html content, not dist/.
    command('zip', ['-q', '-X', archive, '-@'], { cwd: dist, input: selected.join('\n') + '\n' });
    command('unzip', ['-tqq', archive]);
    const entries = command('unzip', ['-Z', '-1', archive]).split('\n').filter(Boolean).sort();
    if (entries.length !== selected.length || entries.some((entry, i) => entry !== selected[i])) {
      throw Error('Archive entries differ from approved frontend file list');
    }
    const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
    const routeConfig = JSON.parse(fs.readFileSync(path.join(root, 'src/config/routes.json'), 'utf8'));
    const listedUrls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m => m[1]);
    const manifest = {
      format: 'ce-hostgator-release-v1',
      createdAt: stamp.toISOString(), sourceCommit: commit,
      archive: path.basename(archive), archiveSha256: hex(fs.readFileSync(archive)),
      instructions: 'Extract the archive CONTENTS into public_html after selective backup. Never delete existing host files.',
      excluded, routeCount: routeConfig.filter(r => r.prerender).length,
      sitemapUrlCount: listedUrls.length, files
    };
    fs.writeFileSync(path.join(out, name + '.manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
    fs.writeFileSync(path.join(out, name + '.sha256'), `${manifest.archiveSha256}  ${path.basename(archive)}\n`, { flag: 'wx' });
    return { archive, manifest, selectedCount: selected.length };
  } catch (error) {
    fs.rmSync(archive, { force: true });
    fs.rmSync(path.join(out, name + '.manifest.json'), { force: true });
    fs.rmSync(path.join(out, name + '.sha256'), { force: true });
    throw error;
  }
}

export function main() {
  // Fail closed until the independent quality gates from CE-HTML-03 and CE-HTML-04 are integrated.
  const dependencies = [
    'scripts/verify-dist.mjs', 'scripts/wordpress-build-posts.js',
    'scripts/verify-dist.test.mjs', 'scripts/wordpress-build-posts.test.mjs'
  ];
  for (const relative of dependencies) {
    if (!fs.existsSync(path.join(ROOT, relative))) throw Error('Cannot package before merging prerequisite: ' + relative);
  }
  if (process.argv.length > 2) throw Error('No bypass flags supported. Use: node scripts/package-hostgator.mjs');
  // A bad test suite must never permit a release just because a previous dist still exists.
  command(process.execPath, ['--test',
    path.join(ROOT, 'scripts/verify-dist.test.mjs'),
    path.join(ROOT, 'scripts/wordpress-build-posts.test.mjs'),
    path.join(ROOT, 'scripts/package-hostgator.test.mjs')], { cwd: ROOT, stdio: 'inherit' });
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  command(npm, ['run','build'], { cwd: ROOT, stdio: 'inherit' });
  command(process.execPath, [path.join(ROOT, 'scripts/verify-dist.mjs'), ROOT], { cwd: ROOT, stdio: 'inherit' });
  const sha = command('git', ['rev-parse', 'HEAD'], { cwd: ROOT });
  if (!/^[a-f0-9]{40}$/.test(sha)) throw Error('Cannot identify source commit');
  const result = createRelease({ root: ROOT, commit: sha });
  console.log(`Frontend package: ${result.archive}\nFiles: ${result.selectedCount}\nSHA-256: ${result.manifest.archiveSha256}`);
  console.log('NOT DEPLOYED. Backup exact target paths and compare active .htaccess before manual extraction.');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))) {
  try { main(); } catch (e) { console.error('CE-HTML-06 BLOCKED:', e.message); process.exitCode = 1; }
}
