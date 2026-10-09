export function normalizeKnowledge(knowledge) {
  // Ensure arrays exist
  const collections = ['intents', 'services', 'products', 'configurations', 'use-cases', 'faq', 'claims', 'sources', 'commercial', 'coverage', 'industries', 'cases', 'terminology', 'canonical-answers'];
  collections.forEach(c => {
    if (!knowledge[c]) knowledge[c] = [];
  });
  return knowledge;
}
