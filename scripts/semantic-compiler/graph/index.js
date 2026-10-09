export function resolveRelationships(knowledge) {
  // We can build lookup maps here if needed
  return knowledge;
}

export function filterPublicationScope(knowledge) {
  // Remove items that shouldn't be public
  const publicKnowledge = { ...knowledge };
  
  if (publicKnowledge.intents) {
    publicKnowledge.intents = publicKnowledge.intents.filter(i => i.status === 'published' && i.visibility !== 'internal');
  }

  if (publicKnowledge.claims) {
    // Only 'verified' claims become public facts
    // 'verify-wording', 'pending', 'rejected', etc. remain internal
    publicKnowledge.claims = publicKnowledge.claims.filter(c => c.status === 'verified');
  }
  
  if (publicKnowledge.cases) {
    publicKnowledge.cases = publicKnowledge.cases.filter(c => c.status === 'published');
  }

  if (publicKnowledge.faq) {
    publicKnowledge.faq = publicKnowledge.faq.filter(f => f.status === 'published');
  }

  return publicKnowledge;
}

export function buildKnowledgeGraph(knowledge, fingerprint) {
  const nodes = [];
  const edges = [];

  const addNode = (item, type) => {
    if (!item || !item.id) return;
    nodes.push({
      id: item.id,
      type,
      name: item.name || item.term || item.question || item.statement || item.title || item.id,
      ...item
    });
  };

  const addEdge = (source, target, relation) => {
    edges.push({ source, target, relation });
  };

  // Organization
  if (knowledge.organization) {
    addNode(knowledge.organization, 'Organization');
    
    knowledge.services.forEach(s => {
      addEdge(knowledge.organization.id, s.id, 'offers');
    });
    
    knowledge.coverage.forEach(c => {
      addEdge(knowledge.organization.id, c.id, 'servesArea');
    });
  }

  // Services
  knowledge.services.forEach(s => {
    addNode(s, 'Service');
    if (s.productIds) s.productIds.forEach(pId => addEdge(s.id, pId, 'offersProduct'));
    if (s.configurationIds) s.configurationIds.forEach(cId => addEdge(s.id, cId, 'offersConfiguration'));
    if (s.useCaseIds) s.useCaseIds.forEach(uId => addEdge(s.id, uId, 'supportsUseCase'));
    if (s.industryIds) s.industryIds.forEach(iId => addEdge(s.id, iId, 'servesIndustry'));
    if (s.coverageIds) s.coverageIds.forEach(cId => addEdge(s.id, cId, 'servesArea'));
  });

  // Products
  knowledge.products.forEach(p => {
    addNode(p, 'Product');
    if (p.useCaseIds) p.useCaseIds.forEach(uId => addEdge(p.id, uId, 'supportsUseCase'));
  });

  // Configurations
  knowledge.configurations.forEach(c => {
    addNode(c, 'Configuration');
    if (c.useCaseIds) c.useCaseIds.forEach(uId => addEdge(c.id, uId, 'supportsUseCase'));
  });

  // UseCases
  knowledge['use-cases'].forEach(u => addNode(u, 'UseCase'));
  
  // Industries
  knowledge.industries.forEach(i => addNode(i, 'Industry'));
  
  // Coverage
  knowledge.coverage.forEach(c => addNode(c, 'Coverage'));
  
  // Cases
  knowledge.cases.forEach(c => {
    addNode(c, 'Case');
    if (c.serviceIds) c.serviceIds.forEach(sId => addEdge(c.id, sId, 'demonstrates'));
    if (c.useCaseIds) c.useCaseIds.forEach(uId => addEdge(c.id, uId, 'demonstrates'));
  });

  // FAQ
  knowledge.faq.forEach(f => {
    addNode(f, 'FAQ');
    if (f.serviceIds) f.serviceIds.forEach(sId => addEdge(f.id, sId, 'about'));
  });

  // Claims
  knowledge.claims.forEach(c => {
    addNode(c, 'Claim');
    if (c.subjectId) addEdge(c.id, c.subjectId, 'about');
    if (c.sourceIds) c.sourceIds.forEach(sId => addEdge(c.id, sId, 'supportedBy'));
  });

  // Sources
  knowledge.sources.forEach(s => {
    if (s.type !== 'internal-only') {
      addNode(s, 'Source');
    }
  });

  // Intents
  knowledge.intents.forEach(i => {
    addNode(i, 'Intent');
    if (i.useCaseIds) i.useCaseIds.forEach(uId => addEdge(i.id, uId, 'resolvesTo'));
    if (i.serviceIds) i.serviceIds.forEach(sId => addEdge(i.id, sId, 'mayRequire'));
    if (i.productIds) i.productIds.forEach(pId => addEdge(i.id, pId, 'mayUseProduct'));
    if (i.configurationIds) i.configurationIds.forEach(cId => addEdge(i.id, cId, 'mayUseConfiguration'));
    if (i.industryIds) i.industryIds.forEach(iId => addEdge(i.id, iId, 'occursIn'));
    if (i.coverageIds) i.coverageIds.forEach(cId => addEdge(i.id, cId, 'appliesTo'));
    if (i.sourceIds) i.sourceIds.forEach(sId => addEdge(i.id, sId, 'supportedBy'));
  });

  return {
    name: "Creativos Espacios Knowledge Graph",
    version: "2.0.0",
    knowledgeFingerprint: fingerprint,
    generatedAt: new Date().toISOString(),
    nodes,
    edges
  };
}
