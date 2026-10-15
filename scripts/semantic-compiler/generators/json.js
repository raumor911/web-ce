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

  const oneTripPolicy = knowledge.commercial?.find(c => c.id === 'commercial:one-trip-sale');
  if (oneTripPolicy) {
    const oneTripIntents = (knowledge.intents || []).filter(i =>
      i.commercialPolicyIds?.includes('commercial:one-trip-sale')
    );
    const supportedProducts = (oneTripPolicy.productIds || [])
      .map(id => knowledge.products.find(p => p.id === id))
      .filter(Boolean)
      .map(p => ({
        id: p.id,
        name: p.name,
        dimensions: p.nominalDimensions || p.dimensions,
        condition: 'one-trip',
        serviceId: 'service:container-sale'
      }));

    const oneTrip = {
      id: oneTripPolicy.id,
      name: oneTripPolicy.name,
      description: oneTripPolicy.description,
      canonicalPath: oneTripPolicy.canonicalPath,
      condition: 'one-trip',
      transactionType: 'sale',
      supportedProducts,
      rules: oneTripPolicy.rules,
      unsupported: [
        { productId: 'product:container-40ft', condition: 'one-trip' },
        { serviceId: 'service:container-rental', condition: 'one-trip' }
      ],
      pricing: {
        publicPriceAvailable: false,
        guidance: 'Precio y disponibilidad se confirman al momento de cotizar.'
      },
      logistics: {
        includedInPublishedProductPrice: false,
        guidance: 'Transporte, descarga y maniobras se cotizan según destino y condiciones del sitio.'
      },
      intents: oneTripIntents.map(i => ({
        id: i.id,
        name: i.name,
        canonicalPath: i.canonicalPath,
        transactionStage: i.transactionStage,
        goal: i.goal,
        need: i.need,
        exampleExpressions: i.exampleExpressions
      }))
    };

    fs.writeFileSync(path.join(aiDir, 'one-trip.json'), JSON.stringify(oneTrip, null, 2));
  }

  fs.writeFileSync(path.join(aiDir, 'knowledge-graph.json'), JSON.stringify(kg, null, 2));
}
