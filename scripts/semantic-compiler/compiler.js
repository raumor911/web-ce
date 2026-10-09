import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadKnowledge } from './loaders/index.js';
import { validateKnowledgeData } from './validators/index.js';
import { normalizeKnowledge } from './normalizers/index.js';
import { resolveRelationships, filterPublicationScope, buildKnowledgeGraph } from './graph/index.js';
import { generateLLMS, generateLLMSFull, generateMarkdown, generateJSON, generateJSONLD, generateManifest } from './generators/index.js';
import { validateArtifacts } from './validators/artifacts.js';
import { generateKnowledgeFingerprint } from './fingerprint.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KNOWLEDGE_DIR = path.join(__dirname, '../../src/knowledge');
const TMP_OUT_DIR = path.join(__dirname, '../../.tmp/semantic-core');

function compile() {
  console.log('🚀 Starting Semantic Compiler...');
  
  const rawKnowledge = loadKnowledge(KNOWLEDGE_DIR);
  validateKnowledgeData(rawKnowledge);
  
  const normalized = normalizeKnowledge(rawKnowledge);
  const withRelations = resolveRelationships(normalized);
  const publicKnowledge = filterPublicationScope(withRelations);
  
  const fingerprint = generateKnowledgeFingerprint();
  const kg = buildKnowledgeGraph(publicKnowledge, fingerprint);
  
  if (!fs.existsSync(TMP_OUT_DIR)) {
    fs.mkdirSync(TMP_OUT_DIR, { recursive: true });
  }

  // Generation
  generateLLMS(publicKnowledge, TMP_OUT_DIR);
  generateLLMSFull(publicKnowledge, TMP_OUT_DIR);
  generateMarkdown(publicKnowledge, TMP_OUT_DIR);
  generateJSON(publicKnowledge, kg, TMP_OUT_DIR);
  generateJSONLD(publicKnowledge, TMP_OUT_DIR);
  
  // Manifest generation happens last so it sees all generated files
  generateManifest(TMP_OUT_DIR, publicKnowledge, fingerprint);
  
  validateArtifacts(TMP_OUT_DIR, publicKnowledge);
  
  // Copy to public/
  const PUBLIC_DIR = path.join(__dirname, '../../public');
  fs.cpSync(TMP_OUT_DIR, PUBLIC_DIR, { recursive: true });
  
  console.log(`✅ Compiled artifacts successfully to public/`);
}

compile();
