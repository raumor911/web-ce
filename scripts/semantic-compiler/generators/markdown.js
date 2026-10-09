import fs from 'fs';
import path from 'path';

export function generateMarkdown(knowledge, outDir) {
  const aiDir = path.join(outDir, 'ai');
  if (!fs.existsSync(aiDir)) fs.mkdirSync(aiDir, { recursive: true });

  // company.md
  let company = `# ${knowledge.organization.name}\n\n${knowledge.organization.description}\n\n`;
  company += `## Identidad\n- Nombre legal: ${knowledge.organization.legalName}\n- País: ${knowledge.organization.country}\n\n`;
  fs.writeFileSync(path.join(aiDir, 'company.md'), company);

  // services.md
  let services = `# Catálogo de Servicios\n\n`;
  knowledge.services.forEach(s => {
    services += `## ${s.name}\n${s.description}\n\n`;
    // Find related products
    const relatedProducts = knowledge.products.filter(p => s.productIds?.includes(p.id));
    if (relatedProducts.length > 0) {
      services += `### Unidades estándar\n`;
      relatedProducts.forEach(p => {
        services += `- **${p.name}** (${p.dimensions}): ${p.description}\n`;
      });
      services += `\n`;
    }
    const relatedConfigs = knowledge.configurations.filter(c => s.configurationIds?.includes(c.id));
    if (relatedConfigs.length > 0) {
      services += `### Configuraciones\n`;
      relatedConfigs.forEach(c => {
        services += `- **${c.name}**: ${c.description}\n`;
      });
      services += `\n`;
    }
  });
  fs.writeFileSync(path.join(aiDir, 'services.md'), services);

  // use-cases.md
  let usecases = `# Casos de Uso y Aplicaciones\n\n`;
  knowledge['use-cases'].forEach(u => {
    usecases += `## ${u.name}\n${u.description}\n\n`;
  });
  fs.writeFileSync(path.join(aiDir, 'use-cases.md'), usecases);

  // industries.md
  let industries = `# Sectores atendidos\n\n`;
  knowledge.industries.forEach(i => {
    industries += `- **${i.name}**: ${i.description}\n`;
  });
  fs.writeFileSync(path.join(aiDir, 'industries.md'), industries);

  // terminology.md
  let term = `# Terminología de Creativos Espacios\n\n`;
  knowledge.terminology.filter(t => t.context !== 'avoid').forEach(t => {
    term += `## ${t.term}\n${t.definition}\n\n`;
  });
  const avoid = knowledge.terminology.filter(t => t.context === 'avoid');
  if (avoid.length > 0) {
    term += `## Términos que deben evitarse\n\n`;
    avoid.forEach(t => {
      term += `- ${t.term}: ${t.definition}\n`;
    });
  }
  fs.writeFileSync(path.join(aiDir, 'terminology.md'), term);

  // glossary.md (can be a copy or slightly different representation of terminology)
  fs.writeFileSync(path.join(aiDir, 'glossary.md'), term);

  // canonical-answers.md
  let answers = `# Respuestas Canónicas\n\n`;
  knowledge['canonical-answers'].forEach(a => {
    answers += `## ${a.question}\n${a.answer}\n\n`;
  });
  fs.writeFileSync(path.join(aiDir, 'canonical-answers.md'), answers);

  // faq.md
  if (knowledge.faq && knowledge.faq.length > 0) {
    let faq = `# Preguntas Frecuentes\n\n`;
    knowledge.faq.forEach(f => {
      faq += `## ${f.question}\n${f.answer}\n\n`;
    });
    fs.writeFileSync(path.join(aiDir, 'faq.md'), faq);
  }

  // intents.md
  if (knowledge.intents && knowledge.intents.length > 0) {
    let intentsMd = `# Intenciones de Usuario (User Intents)\n\n`;
    knowledge.intents.forEach(i => {
      intentsMd += `## ${i.name}\n`;
      intentsMd += `- **Objetivo**: ${i.goal}\n`;
      intentsMd += `- **Necesidad**: ${i.need}\n`;
      intentsMd += `- **Etapa**: ${i.transactionStage}\n\n`;
      intentsMd += `${i.description}\n\n`;
      if (i.exampleExpressions && i.exampleExpressions.length > 0) {
        intentsMd += `### Ejemplos de expresiones\n`;
        i.exampleExpressions.forEach(e => {
          intentsMd += `- "${e}"\n`;
        });
        intentsMd += `\n`;
      }
    });
    fs.writeFileSync(path.join(aiDir, 'intents.md'), intentsMd);
  }
}
