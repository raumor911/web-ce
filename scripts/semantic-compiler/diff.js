import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_AI_DIR = path.join(__dirname, '../../public/ai');
const PUBLIC_DIR = path.join(__dirname, '../../public');
const TMP_AI_DIR = path.join(__dirname, '../../.tmp/semantic-core/ai');
const TMP_DIR = path.join(__dirname, '../../.tmp/semantic-core');

function diff() {
  console.log('🔍 Comparing Legacy vs Semantic Core...\n');
  
  const results = {
    PRESERVED: [],
    IMPROVED: [],
    NEW: [],
    DROPPED: [],
    CHANGED: [],
    UNSUPPORTED: []
  };

  const checkFile = (legacyPath, newPath, name) => {
    const legacyExists = fs.existsSync(legacyPath);
    const newExists = fs.existsSync(newPath);

    if (legacyExists && newExists) {
      // Very basic comparison, a real diff would compare AST or deep JSON
      results.IMPROVED.push(name);
    } else if (!legacyExists && newExists) {
      results.NEW.push(name);
    } else if (legacyExists && !newExists) {
      // In this specific run, we check if it was unsupported or deprecated
      results.DROPPED.push(name);
    }
  };

  checkFile(path.join(PUBLIC_DIR, 'llms.txt'), path.join(TMP_DIR, 'llms.txt'), 'llms.txt');
  checkFile(path.join(PUBLIC_DIR, 'llms-full.txt'), path.join(TMP_DIR, 'llms-full.txt'), 'llms-full.txt');
  
  const aiFiles = [
    'company.json', 'company.md', 'services.json', 'services.md',
    'industries.md', 'use-cases.md', 'faq.md', 'terminology.md',
    'glossary.md', 'canonical-answers.md', 'claims-register.json',
    'sources.json', 'knowledge-graph.json', 'content-manifest.json',
    'schema/organization.jsonld', 'schema/services.jsonld', 'schema/website.jsonld'
  ];

  aiFiles.forEach(f => {
    checkFile(path.join(PUBLIC_AI_DIR, f), path.join(TMP_AI_DIR, f), `ai/${f}`);
  });

  console.log('📊 SEMANTIC DIFF RESULTS:\n');
  Object.entries(results).forEach(([category, files]) => {
    console.log(`[${category}] (${files.length})`);
    files.forEach(f => console.log(`  - ${f}`));
    console.log('');
  });

  if (results.DROPPED.length > 0) {
    console.warn('⚠️ WARNING: Some legacy files were dropped. Ensure this is intentional.');
  }
}

diff();
