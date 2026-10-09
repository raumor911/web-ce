import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function validateArtifacts(tmpDir, knowledge) {
  const manifestPath = path.join(tmpDir, 'ai', 'content-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found in shadow build');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const filesToCheck = manifest.resources.map(r => r.path);
  
  for (const filePath of filesToCheck) {
    const fullPath = path.join(tmpDir, filePath.replace('/ai/', 'ai/').replace(/^\//, ''));
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Artifact listed in manifest not found: ${filePath}`);
    }
  }

  // Check llms.txt links
  const llmsPath = path.join(tmpDir, 'llms.txt');
  if (fs.existsSync(llmsPath)) {
    const llms = fs.readFileSync(llmsPath, 'utf-8');
    if (llms.includes('example.com') || llms.includes('TODO')) {
      throw new Error('llms.txt contains example.com or TODO');
    }
  }
  
  // Verify fingerprint matching
  const kgPath = path.join(tmpDir, 'ai', 'knowledge-graph.json');
  if (fs.existsSync(kgPath)) {
    const kg = JSON.parse(fs.readFileSync(kgPath, 'utf-8'));
    if (kg.knowledgeFingerprint !== manifest.knowledgeFingerprint) {
      throw new Error('Fingerprint mismatch between manifest and knowledge graph');
    }
  }
}

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('🔍 Validating artifacts in .tmp/semantic-core...');
  try {
    // Just a placeholder mock load for standalone validation
    const tmpDir = path.join(__dirname, '../../../.tmp/semantic-core');
    validateArtifacts(tmpDir, {});
    console.log('✅ Artifacts validation passed.');
  } catch (err) {
    console.error(`❌ Validation failed: ${err.message}`);
    process.exit(1);
  }
}
