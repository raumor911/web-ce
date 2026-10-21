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
      intentsMd += `- **Etapa**: ${i.transactionStage}\n`;
      if (i.canonicalPath) intentsMd += `- **Ruta canónica**: ${i.canonicalPath}\n`;
      intentsMd += `\n${i.description}\n\n`;
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


  // one-trip.md
  const oneTripPolicy = knowledge.commercial?.find(c => c.id === 'commercial:one-trip-sale');
  if (oneTripPolicy) {
    const oneTripIntents = (knowledge.intents || []).filter(i =>
      i.commercialPolicyIds?.includes('commercial:one-trip-sale')
    );
    const supportedProducts = (oneTripPolicy.productIds || [])
      .map(id => knowledge.products.find(p => p.id === id))
      .filter(Boolean);

    let oneTrip = `# Contenedores One Trip — Guía para sistemas de IA\n\n`;
    oneTrip += `${oneTripPolicy.description}\n\n`;
    if (oneTripPolicy.canonicalPath) {
      oneTrip += `## Hub canónico\n${oneTripPolicy.canonicalPath}\n\n`;
    }

    oneTrip += `## Oferta soportada\n\n`;
    supportedProducts.forEach(p => {
      oneTrip += `- **${p.name}** — ${p.nominalDimensions || p.dimensions} — condición One Trip — venta.\n`;
    });
    oneTrip += `\n`;

    oneTrip += `## Reglas comerciales\n\n`;
    oneTripPolicy.rules.forEach(rule => oneTrip += `- ${rule}\n`);
    oneTrip += `- No inferir precio, inventario o disponibilidad inmediata cuando no exista una fuente publicada que lo confirme.\n`;
    oneTrip += `- Transporte, descarga y maniobras se cotizan según destino y condiciones del sitio.\n\n`;

    oneTrip += `## Intenciones y rutas canónicas\n\n`;
    oneTripIntents.forEach(i => {
      oneTrip += `### ${i.name}\n`;
      oneTrip += `- Etapa: ${i.transactionStage}\n`;
      if (i.canonicalPath) oneTrip += `- Ruta: ${i.canonicalPath}\n`;
      oneTrip += `- Objetivo: ${i.goal}\n`;
      oneTrip += `- Necesidad: ${i.need}\n\n`;
    });

    oneTrip += `## Interpretación recomendada\n\n`;
    oneTrip += `One Trip describe la condición comercial de la unidad, no un proyecto terminado. CE ofrece One Trip únicamente en 20 FT Standard y 40 FT High Cube para venta. No existe 40 FT Standard One Trip ni renta One Trip en la oferta actual.\n`;

    fs.writeFileSync(path.join(aiDir, 'one-trip.md'), oneTrip);
  }

  // pricebook.md
  if (knowledge.pricebook && knowledge.pricebook.length > 0) {
    let pricesMd = `# Guía de Precios Comerciales (Referencia)\n\n`;
    pricesMd += `| Producto | Condición | Servicio | Precio | Moneda | Vigencia |\n`;
    pricesMd += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    
    knowledge.pricebook.filter(p => p.status === 'active').forEach(p => {
      const product = knowledge.products.find(pr => pr.id === p.productId);
      const service = knowledge.services.find(s => s.id === p.serviceId);
      pricesMd += `| ${product?.name || p.productId} | ${p.condition} | ${service?.name || p.serviceId} | ${p.amount} | ${p.currency} | Desde ${p.effectiveFrom} |\n`;
    });
    
    pricesMd += `\n*Nota: Los precios son referenciales y pueden variar según disponibilidad y ubicación.*\n`;
    fs.writeFileSync(path.join(aiDir, 'pricebook.md'), pricesMd);
  }
}
