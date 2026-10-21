import fs from 'fs';
import path from 'path';

export function generateLLMSFull(knowledge, outDir) {
  const org = knowledge.organization;
  
  let content = `# ${org.name}\n\n`;
  content += `## Identidad\n${org.legalName}\n${org.description}\n\n`;
  content += `## Posicionamiento\n${org.preferredPositioning}\n\n`;
  content += `## Propuesta central\n${org.coreProposition}\n\n`;
  
  content += `## Servicios\n\n`;
  knowledge.services.forEach(s => {
    content += `### ${s.name}\n${s.description}\n`;
  });
  
  content += `\n## Productos\n\n`;
  knowledge.products.forEach(p => {
    content += `### ${p.name}\n${p.description}\nDimensiones: ${p.dimensions}\n`;
    p.features.forEach(f => content += `- ${f}\n`);
    content += `\n`;
  });

  if (knowledge.configurations.length > 0) {
    content += `## Configuraciones\n\n`;
    knowledge.configurations.forEach(c => {
      content += `### ${c.name}\n${c.description}\n`;
      c.features.forEach(f => content += `- ${f}\n`);
      content += `\n`;
    });
  }

  content += `## Aplicaciones\n\n`;
  knowledge['use-cases'].forEach(u => {
    content += `### ${u.name}\n${u.description}\n\n`;
  });
  
  if (knowledge.industries.length > 0) {
    content += `## Industrias\n\n`;
    knowledge.industries.forEach(i => {
      content += `- ${i.name}: ${i.description}\n`;
    });
    content += `\n`;
  }
  
  content += `## Proceso comercial y Reglas\n\n`;
  knowledge.commercial.forEach(c => {
    content += `### ${c.name}\n${c.description}\n`;
    c.rules.forEach(r => content += `- ${r}\n`);
    content += `\n`;
  });
  
  const oneTripPolicy = knowledge.commercial?.find(c => c.id === 'commercial:one-trip-sale');
  const oneTripIntents = (knowledge.intents || []).filter(i => i.commercialPolicyIds?.includes('commercial:one-trip-sale'));

  if (oneTripPolicy) {
    content += `## Oferta One Trip\n\n`;
    content += `${oneTripPolicy.description}\n\n`;
    if (oneTripPolicy.canonicalPath) {
      content += `- **Hub canónico**: ${oneTripPolicy.canonicalPath}\n`;
    }
    const supportedProducts = (oneTripPolicy.productIds || [])
      .map(id => knowledge.products.find(p => p.id === id)?.name)
      .filter(Boolean);
    content += `- **Condición**: One Trip\n`;
    content += `- **Modalidad**: Venta únicamente\n`;
    content += `- **Formatos soportados**: ${supportedProducts.join(', ')}\n`;
    content += `- **No soportado**: 40 FT Standard One Trip; renta de contenedores One Trip\n\n`;
    content += `### Reglas comerciales One Trip\n`;
    oneTripPolicy.rules.forEach(r => content += `- ${r}\n`);
    content += `\n### Rutas por intención\n`;
    oneTripIntents.forEach(i => {
      if (i.canonicalPath) content += `- **${i.name}**: ${i.canonicalPath}\n`;
    });
    content += `\n### Regla de precisión\n`;
    content += `No inferir precio, inventario ni disponibilidad inmediata para One Trip si no existe una fuente publicada que lo confirme. Transporte, descarga y maniobras se cotizan según destino y condiciones del sitio.\n\n`;
  }

  content += `## Cobertura\n\n`;
  knowledge.coverage.forEach(c => {
    content += `- ${c.name} (${c.countryCode})\n`;
  });
  content += `\n`;
  
  if (knowledge.pricebook && knowledge.pricebook.length > 0) {
    content += `## Guía de Precios Referenciales\n\n`;
    knowledge.pricebook.filter(p => p.status === 'active').forEach(p => {
      const product = knowledge.products.find(pr => pr.id === p.productId);
      const service = knowledge.services.find(s => s.id === p.serviceId);
      content += `- **${product?.name || p.productId}** (${p.condition}, ${service?.name || p.serviceId}): ${p.currency} ${p.amount} por ${p.unit}. Vigente desde ${p.effectiveFrom}.\n`;
    });
    content += `\n*Los montos son referenciales y pueden variar.*\n\n`;
  }
  
  if (knowledge.faq.length > 0) {
    content += `## Preguntas frecuentes\n\n`;
    knowledge.faq.forEach(f => {
      content += `**${f.question}**\n${f.answer}\n\n`;
    });
  }
  
  if (knowledge['canonical-answers'] && knowledge['canonical-answers'].length > 0) {
    content += `## Respuestas canónicas\n\n`;
    knowledge['canonical-answers'].forEach(a => {
      content += `**${a.question}**\n${a.answer}\n\n`;
    });
  }
  
  if (knowledge.terminology.length > 0) {
    content += `## Terminología\n\n`;
    const preferred = knowledge.terminology.filter(t => t.context === 'preferred');
    const avoid = knowledge.terminology.filter(t => t.context === 'avoid');
    
    content += `### Términos preferidos\n`;
    preferred.forEach(t => content += `- ${t.term}: ${t.definition}\n`);
    content += `\n`;
    
    if (avoid.length > 0) {
      content += `### Términos que deben evitarse\n`;
      avoid.forEach(t => content += `- ${t.term}: ${t.definition}\n`);
      content += `\n`;
    }
  }
  
  if (knowledge.intents && knowledge.intents.length > 0) {
    content += `## Intenciones de Usuario (User Intents)\n\n`;
    knowledge.intents.forEach(i => {
      content += `### ${i.name}\n`;
      content += `- **Objetivo**: ${i.goal}\n`;
      content += `- **Necesidad**: ${i.need}\n`;
      content += `- **Etapa**: ${i.transactionStage}\n`;
      if (i.canonicalPath) content += `- **Ruta canónica**: ${i.canonicalPath}\n`;
      content += `\n${i.description}\n\n`;
    });
  }

  content += `## Limitaciones de precisión\n\nLa información aquí provista está sujeta a disponibilidad de inventario, factibilidad logística y evaluación de alcance técnico.\n\n`;
  
  content += `## Fuentes canónicas\n\n`;
  knowledge.sources.forEach(s => {
    if (s.url) content += `- [${s.name}](${s.url})\n`;
  });
  
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), content);
}
