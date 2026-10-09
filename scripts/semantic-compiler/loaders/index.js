import fs from 'fs';
import path from 'path';

export function loadKnowledge(knowledgeDir) {
  const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.json'));
  const knowledge = {};
  for (const file of files) {
    const key = file.replace('.json', '');
    knowledge[key] = JSON.parse(fs.readFileSync(path.join(knowledgeDir, file), 'utf-8'));
  }
  return knowledge;
}
