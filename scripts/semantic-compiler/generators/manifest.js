import fs from 'fs';
import path from 'path';

export function generateManifest(tmpDir, knowledge, fingerprint) {
  const aiDir = path.join(tmpDir, 'ai');
  
  // Recursively find all files in .tmp/semantic-core
  const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
        filelist = walkSync(filepath, filelist);
      } else {
        filelist.push(filepath);
      }
    }
    return filelist;
  };

  const allFiles = walkSync(tmpDir);
  const resources = [];

  for (const fullPath of allFiles) {
    const relativePath = '/' + path.relative(tmpDir, fullPath);
    if (relativePath === '/ai/content-manifest.json') continue; // exclude itself
    
    let mediaType = 'text/plain';
    if (relativePath.endsWith('.json')) mediaType = 'application/json';
    else if (relativePath.endsWith('.md')) mediaType = 'text/markdown';
    else if (relativePath.endsWith('.jsonld')) mediaType = 'application/ld+json';
    
    resources.push({
      path: relativePath,
      mediaType,
      generated: new Date().toISOString(),
      knowledgeFingerprint: fingerprint
    });
  }

  const manifest = {
    name: "Creativos Espacios Content Manifest",
    version: "2.0.0",
    language: knowledge.organization.language,
    canonicalDomain: knowledge.organization.canonicalUrl,
    knowledgeFingerprint: fingerprint,
    generatedAt: new Date().toISOString(),
    resources
  };

  fs.writeFileSync(path.join(aiDir, 'content-manifest.json'), JSON.stringify(manifest, null, 2));
}
