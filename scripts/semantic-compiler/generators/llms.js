import fs from 'fs';
import path from 'path';

export function generateLLMS(knowledge, outDir) {
  const org = knowledge.organization;
  const services = knowledge.services.map(s => `- [${s.name}](${s.canonicalPath}): ${s.description}`).join('\n');
  const useCases = knowledge['use-cases'].map(u => `- ${u.name}: ${u.description}`).join('\n');
  const oneTripPolicy = knowledge.commercial?.find(c => c.id === 'commercial:one-trip-sale');
  const oneTripIntents = (knowledge.intents || []).filter(i => i.commercialPolicyIds?.includes('commercial:one-trip-sale'));
  
  let content = `# ${org.name}\n\n`;
  content += `> ${org.preferredPositioning}\n\n`;
  
  content += `## Sitio oficial\n\n`;
  content += `${org.canonicalUrl}\n\n`;
  
  content += `## Soluciones principales\n\n${services}\n\n`;
  content += `## Aplicaciones principales\n\n${useCases}\n\n`;

  if (oneTripPolicy) {
    const supportedProducts = (oneTripPolicy.productIds || [])
      .map(id => knowledge.products.find(p => p.id === id)?.name)
      .filter(Boolean);

    content += `## Contenedores One Trip\n\n`;
    content += `${oneTripPolicy.description}\n\n`;
    if (oneTripPolicy.canonicalPath) {
      content += `- [Oferta One Trip](${oneTripPolicy.canonicalPath})\n`;
    }
    oneTripIntents
      .filter(i => i.canonicalPath && i.canonicalPath !== oneTripPolicy.canonicalPath)
      .forEach(i => content += `- [${i.name}](${i.canonicalPath})\n`);
    content += `\n**Formatos soportados:** ${supportedProducts.join(', ')}.\n\n`;
    content += `**Reglas comerciales:**\n`;
    oneTripPolicy.rules.forEach(rule => content += `- ${rule}\n`);
    content += `\n`;
  }
  
  content += `## Información ampliada\n\n`;
  content += `- [Manifiesto de Contenido](/ai/content-manifest.json)\n`;
  content += `- [Perfil de Empresa](/ai/company.md)\n`;
  content += `- [Catálogo de Servicios](/ai/services.md)\n`;
  content += `- [Casos de Uso](/ai/use-cases.md)\n`;
  content += `- [Terminología Preferida](/ai/terminology.md)\n`;
  content += `- [Respuestas Canónicas](/ai/canonical-answers.md)\n`;
  content += `- [Intenciones de Usuario](/ai/intents.md)\n`;
  if (oneTripPolicy) {
    content += `- [Guía One Trip para IA](/ai/one-trip.md)\n`;
    content += `- [Oferta One Trip estructurada](/ai/one-trip.json)\n`;
  }
  if (knowledge.pricebook && knowledge.pricebook.length > 0) {
    content += `- [Guía de Precios de Referencia](/ai/pricebook.md)\n`;
  }
  
  if (knowledge.faq && knowledge.faq.length > 0) {
    content += `- [Preguntas Frecuentes](/ai/faq.md)\n`;
  }
  
  content += `\n## Fuente de verdad\n\nEste archivo y los recursos en /ai/ representan la fuente de verdad estructurada de Creativos Espacios para asistentes de IA.\n`;
  
  fs.writeFileSync(path.join(outDir, 'llms.txt'), content);
}
