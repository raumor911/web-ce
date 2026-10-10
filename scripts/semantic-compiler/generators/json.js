import fs from 'fs';
import path from 'path';

export function generateJSON(knowledge, kg, outDir) {
  const aiDir = path.join(outDir, 'ai');
  if (!fs.existsSync(aiDir)) fs.mkdirSync(aiDir, { recursive: true });

  fs.writeFileSync(path.join(aiDir, 'company.json'), JSON.stringify(knowledge.organization, null, 2));
  fs.writeFileSync(path.join(aiDir, 'services.json'), JSON.stringify(knowledge.services, null, 2));
  if (knowledge.intents) {
    fs.writeFileSync(path.join(aiDir, 'intents.json'), JSON.stringify(knowledge.intents, null, 2));
  }
  fs.writeFileSync(path.join(aiDir, 'claims-register.json'), JSON.stringify(knowledge.claims, null, 2));
  fs.writeFileSync(path.join(aiDir, 'sources.json'), JSON.stringify(knowledge.sources, null, 2));
  if (knowledge.pricebook) {
    fs.writeFileSync(path.join(aiDir, 'pricebook.json'), JSON.stringify(knowledge.pricebook, null, 2));
  }
  fs.writeFileSync(path.join(aiDir, 'knowledge-graph.json'), JSON.stringify(kg, null, 2));
}
