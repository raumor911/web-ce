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

  // 6. Location validation
  if (data.locations) {
    data.locations.forEach(loc => {
      if (!loc.id.startsWith('loc:')) {
        reportError(`Location ID ${loc.id} must start with 'loc:'`);
      }
      if (!loc.slug) {
        reportError(`Location ${loc.id} is missing slug`);
      }
      if (!loc.type) {
        reportError(`Location ${loc.id} is missing type`);
      }
      if (loc.parentId && !allIds.has(loc.parentId)) {
        reportError(`Dangling parent reference: ${loc.parentId} in location ${loc.id}`);
      }
    });
  }

  // 7. UseCase supportedProductIds validation
  if (data['use-cases']) {
    data['use-cases'].forEach(uc => {
      if (uc.supportedProductIds) {
        uc.supportedProductIds.forEach(pId => {
          if (!allIds.has(pId)) {
            reportError(`Dangling product reference: ${pId} in use-case ${uc.id}`);
          }
        });
      }
    });
  }

  // 8. PriceBook validation
  if (data.pricebook) {
    const activeCombo = new Set();
    data.pricebook.forEach(price => {
      if (!price.id.startsWith('price:')) {
        reportError(`Price ID ${price.id} must start with 'price:'`);
      }
      if (!allIds.has(price.productId)) {
        reportError(`Dangling productId reference: ${price.productId} in price ${price.id}`);
      }
      if (!allIds.has(price.serviceId)) {
        reportError(`Dangling serviceId reference: ${price.serviceId} in price ${price.id}`);
      }
      if (price.amount <= 0) {
        reportError(`Price amount must be greater than 0 in ${price.id}`);
      }
      if (!/^[A-Z]{3}$/.test(price.currency)) {
        reportError(`Invalid ISO 4217 currency: ${price.currency} in ${price.id}`);
      }
      if (!['used', 'new', 'one-trip'].includes(price.condition)) {
        reportError(`Invalid condition: ${price.condition} in ${price.id}`);
      }
      if (!['active', 'inactive'].includes(price.status)) {
        reportError(`Invalid status: ${price.status} in ${price.id}`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(price.effectiveFrom)) {
        reportError(`Invalid effectiveFrom date: ${price.effectiveFrom} in ${price.id}`);
      }
      if (price.effectiveTo && price.effectiveTo < price.effectiveFrom) {
        reportError(`effectiveTo must be after effectiveFrom in ${price.id}`);
      }

      // Check for duplicate active combos
      if (price.status === 'active') {
        const combo = `${price.productId}|${price.serviceId}|${price.condition}|${price.currency}`;
        if (activeCombo.has(combo)) {
          reportError(`Duplicate ACTIVE price combination for ${combo} in ${price.id}`);
        }
        activeCombo.add(combo);
      }
    });
  }

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
