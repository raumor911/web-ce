import fs from 'fs';
import path from 'path';
import { canonicalPath, canonicalUrl, CANONICAL_ORIGIN } from '../../../src/lib/canonicalUrl.mjs';

// Salidas públicas: rutas de página con barra final (regla de src/lib/canonicalUrl.mjs).
// Los datos fuente en src/knowledge conservan la ruta sin barra (clave de ruta interna).
function withCanonicalPaths(value) {
  if (Array.isArray(value)) return value.map(withCanonicalPaths);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => {
      if (k === 'canonicalPath' && typeof v === 'string') return [k, canonicalPath(v)];
      if (k === 'url' && typeof v === 'string' && v.startsWith(CANONICAL_ORIGIN + '/')) {
        return [k, canonicalUrl(new URL(v).pathname)];
      }
      return [k, withCanonicalPaths(v)];
    }));
  }
  return value;
}
const stringify = value => JSON.stringify(withCanonicalPaths(value), null, 2);

export function generateJSON(knowledge, kg, outDir) {
  const aiDir = path.join(outDir, 'ai');
  if (!fs.existsSync(aiDir)) fs.mkdirSync(aiDir, { recursive: true });

  fs.writeFileSync(path.join(aiDir, 'company.json'), stringify(knowledge.organization));
  fs.writeFileSync(path.join(aiDir, 'services.json'), stringify(knowledge.services));
  if (knowledge.intents) {
    fs.writeFileSync(path.join(aiDir, 'intents.json'), stringify(knowledge.intents));
  }
  if (knowledge.cases && knowledge.cases.length > 0) {
    fs.writeFileSync(path.join(aiDir, 'cases.json'), stringify(knowledge.cases));
  }
  fs.writeFileSync(path.join(aiDir, 'claims-register.json'), stringify(knowledge.claims));
  fs.writeFileSync(path.join(aiDir, 'sources.json'), stringify(knowledge.sources));
  if (knowledge.pricebook) {
    fs.writeFileSync(path.join(aiDir, 'pricebook.json'), stringify(knowledge.pricebook));
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

    fs.writeFileSync(path.join(aiDir, 'one-trip.json'), stringify(oneTrip));
  }

  fs.writeFileSync(path.join(aiDir, 'knowledge-graph.json'), stringify(kg));
}
