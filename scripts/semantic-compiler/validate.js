import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateKnowledgeFingerprint } from './fingerprint.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KNOWLEDGE_DIR = path.join(__dirname, '../../src/knowledge');

let hasErrors = false;

function reportError(msg) {
  console.error(`❌ [ERROR] ${msg}`);
  hasErrors = true;
}

function validateKnowledge() {
  console.log('🔍 Starting CE Semantic Core validation...');
  
  const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.json'));
  const data = {};
  const allIds = new Set();
  
  // 1. JSON Validity and Mojibake checks
  for (const file of files) {
    const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf-8');
    
    // Check mojibake characters
    if (/[ÃÂâ€ðŸ]/.test(content)) {
      reportError(`Mojibake character found in ${file}`);
    }
    // Check example.com
    if (content.includes('example.com')) {
      reportError(`example.com found in ${file}`);
    }
    // Check TODO/FIXME
    if (content.includes('TODO') || content.includes('FIXME')) {
      reportError(`TODO/FIXME found in ${file}`);
    }

    try {
      const parsed = JSON.parse(content);
      data[file.replace('.json', '')] = parsed;
      
      // Collect IDs
      const items = Array.isArray(parsed) ? parsed : [parsed];
      items.forEach(item => {
        if (item && item.id) {
          if (allIds.has(item.id)) {
            reportError(`Duplicate ID found: ${item.id}`);
          }
          allIds.add(item.id);
        } else if (file !== 'site') { // site.json or similar might not have ID
          if (item && typeof item === 'object' && !item.id) {
            reportError(`Item missing ID in ${file}`);
          }
        }
      });
    } catch (e) {
      reportError(`Invalid JSON in ${file}: ${e.message}`);
    }
  }

  // 2. Reference validation
  const checkReferences = (obj, file) => {
    if (Array.isArray(obj)) {
      obj.forEach(i => checkReferences(i, file));
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        if (key.endsWith('Id') && typeof value === 'string') {
          if (!allIds.has(value)) {
            reportError(`Dangling reference: ${value} in ${file}`);
          }
        } else if (key.endsWith('Ids') && Array.isArray(value)) {
          value.forEach(id => {
            if (!allIds.has(id)) {
              reportError(`Dangling reference: ${id} in ${file}`);
            }
          });
        } else {
          checkReferences(value, file);
        }
      });
    }
  };

  Object.entries(data).forEach(([file, content]) => {
    checkReferences(content, file);
  });

  // 3. Claims validation (public claims must have sourceIds)
  if (data.claims) {
    data.claims.forEach(claim => {
      if (claim.visibility === 'public' && (!claim.sourceIds || claim.sourceIds.length === 0)) {
        reportError(`Public claim ${claim.id} is missing sourceIds`);
      }
    });
  }
  
  // 4. Cases validation (published cases must have canonicalPath)
  if (data.cases) {
    data.cases.forEach(c => {
      if (c.status === 'published' && !c.canonicalPath) {
        reportError(`Published case ${c.id} is missing canonicalPath`);
      }
    });
  }
  
  // 5. Canonical Path formats
  const paths = new Set();
  const checkCanonicalPath = (obj, file) => {
    if (Array.isArray(obj)) {
      obj.forEach(i => checkCanonicalPath(i, file));
    } else if (obj && typeof obj === 'object') {
      if (obj.canonicalPath) {
        if (!obj.canonicalPath.startsWith('/')) {
          reportError(`canonicalPath must start with '/' in ${obj.id} (${file})`);
        }
        if (obj.canonicalPath !== '/' && obj.canonicalPath.endsWith('/')) {
          reportError(`canonicalPath must not end with '/' in ${obj.id} (${file})`);
        }
        paths.add(obj.canonicalPath);
      }
      Object.values(obj).forEach(val => {
        if (val && typeof val === 'object') checkCanonicalPath(val, file);
      });
    }
  };
  Object.entries(data).forEach(([file, content]) => checkCanonicalPath(content, file));

  if (hasErrors) {
    console.error('❌ Validation failed.');
    process.exit(1);
  } else {
    console.log('✅ Validation passed.');
    const fp = generateKnowledgeFingerprint();
    console.log(`🧠 Knowledge Fingerprint: ${fp}`);
  }
}

validateKnowledge();
