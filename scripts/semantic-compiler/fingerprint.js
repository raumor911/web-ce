import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_DIR = path.join(__dirname, '../../src/knowledge');

/**
 * Reads all knowledge files, normalizes their contents by sorting keys and arrays,
 * and calculates a SHA-256 fingerprint.
 */
export function generateKnowledgeFingerprint() {
  const files = fs.readdirSync(KNOWLEDGE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  const knowledgeObj = {};

  for (const file of files) {
    const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf-8');
    knowledgeObj[file] = JSON.parse(content);
  }

  // Normalization: Deep sort object keys and primitive arrays (or array of objects by ID)
  const normalize = (obj) => {
    if (Array.isArray(obj)) {
      const sortedArray = obj.map(normalize);
      // Sort array of objects by 'id' if they have one, else sort primitive values
      sortedArray.sort((a, b) => {
        if (a && b && typeof a === 'object' && typeof b === 'object' && a.id && b.id) {
          return a.id.localeCompare(b.id);
        }
        return JSON.stringify(a).localeCompare(JSON.stringify(b));
      });
      return sortedArray;
    } else if (obj !== null && typeof obj === 'object') {
      const sortedObj = {};
      Object.keys(obj).sort().forEach(key => {
        // Exclude dynamic timestamps from fingerprint
        if (!['lastVerifiedAt', 'verifiedAt', 'reviewAfter', 'generatedAt'].includes(key)) {
          sortedObj[key] = normalize(obj[key]);
        }
      });
      return sortedObj;
    }
    return obj;
  };

  const normalizedKnowledge = normalize(knowledgeObj);
  const jsonString = JSON.stringify(normalizedKnowledge);
  
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(generateKnowledgeFingerprint());
}
