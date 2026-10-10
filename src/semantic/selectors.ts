import { Knowledge } from './index';
import { ID, Organization, Service, Product, Configuration, UseCase, FAQ, Claim, Source, CommercialPolicy, Coverage, Industry, Case, Terminology, CanonicalAnswer, Intent, Location, PriceBookEntry, Condition } from '../types/semantic';

export const SemanticSelectors = {
  getOrganization: (): Organization => Knowledge.organization,
  
  getServiceById: (id: ID): Service | undefined => 
    Knowledge.services.find(s => s.id === id),
  
  getServices: (): Service[] => Knowledge.services,
  
  getServiceByPath: (path: string): Service | undefined => {
    // Normalize path to match canonicalPath format (slashless except home)
    const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
    return Knowledge.services.find(s => s.canonicalPath === normalizedPath);
  },

  getProductById: (id: ID): Product | undefined =>
    Knowledge.products.find(p => p.id === id),

  getUseCaseById: (id: ID): UseCase | undefined =>
    Knowledge.useCases.find(u => u.id === id),

  getConfigurationById: (id: ID): Configuration | undefined =>
    Knowledge.configurations.find(c => c.id === id),

  getLocationById: (id: ID): Location | undefined =>
    Knowledge.locations.find(l => l.id === id),

  getLocations: (): Location[] => Knowledge.locations,

  getProductsForService: (serviceId: ID): Product[] => {
    const service = Knowledge.services.find(s => s.id === serviceId);
    if (!service || !service.productIds) return [];
    return Knowledge.products.filter(p => service.productIds!.includes(p.id));
  },
  
  getConfigurationsForService: (serviceId: ID): Configuration[] => {
    const service = Knowledge.services.find(s => s.id === serviceId);
    if (!service || !service.configurationIds) return [];
    return Knowledge.configurations.filter(c => service.configurationIds!.includes(c.id));
  },
  
  getUseCasesForService: (serviceId: ID): UseCase[] => {
    const service = Knowledge.services.find(s => s.id === serviceId);
    if (!service || !service.useCaseIds) return [];
    return Knowledge.useCases.filter(u => service.useCaseIds!.includes(u.id));
  },

  getProductsForUseCase: (useCaseId: ID): Product[] => {
    const useCase = Knowledge.useCases.find(u => u.id === useCaseId);
    if (!useCase || !useCase.supportedProductIds) return [];
    return Knowledge.products.filter(p => useCase.supportedProductIds!.includes(p.id));
  },

  getUseCasesForProduct: (productId: ID): UseCase[] => {
    return Knowledge.useCases.filter(u => u.supportedProductIds?.includes(productId));
  },
  
  getFaqForService: (serviceId: ID): FAQ[] => {
    return Knowledge.faq.filter(f => f.serviceIds && f.serviceIds.includes(serviceId) && f.status === 'published');
  },
  
  getIndustriesForService: (serviceId: ID): Industry[] => {
    const service = Knowledge.services.find(s => s.id === serviceId);
    if (!service || !service.industryIds) return [];
    return Knowledge.industries.filter(i => service.industryIds!.includes(i.id));
  },
  
  getIntentsForService: (serviceId: ID): Intent[] => {
    return Knowledge.intents.filter(i => i.serviceIds && i.serviceIds.includes(serviceId) && i.status === 'published' && i.visibility === 'public');
  },
  
  getCoverageForService: (serviceId: ID): Coverage[] => {
    const service = Knowledge.services.find(s => s.id === serviceId);
    if (!service || !service.coverageIds) return [];
    return Knowledge.coverage.filter(c => service.coverageIds!.includes(c.id));
  },
  
  getCanonicalAnswers: (): CanonicalAnswer[] => Knowledge.canonicalAnswers,
  
  getVerifiedClaims: (): Claim[] => 
    Knowledge.claims.filter(c => c.status === 'verified' && c.visibility === 'public'),
    
  getFaqByCategory: (category: string): FAQ[] => {
    return Knowledge.faq.filter(f => 
      f.status === 'published' && (
        (f as any).category === category || 
        (! (f as any).category && f.tags?.includes(category))
      )
    );
  },
  
  getGeneralFaq: (): FAQ[] => {
    return SemanticSelectors.getFaqByCategory('general');
  },

  getLocationHierarchy: (locationId: ID): Location[] => {
    const hierarchy: Location[] = [];
    let currentId: ID | undefined = locationId;
    
    while (currentId) {
      const loc = Knowledge.locations.find(l => l.id === currentId);
      if (!loc) break;
      hierarchy.push(loc);
      currentId = loc.parentId;
    }
    
    return hierarchy;
  },

  getOrganizationLocation: (): Location | undefined => {
    const org = Knowledge.organization;
    if (!org.locationId) return undefined;
    return SemanticSelectors.getLocationById(org.locationId);
  },

  // PriceBook Selectors
  getPrices: (): PriceBookEntry[] => Knowledge.pricebook,

  getPricesForProduct: (productId: ID): PriceBookEntry[] =>
    Knowledge.pricebook.filter(p => p.productId === productId),

  getActivePricesForProduct: (productId: ID): PriceBookEntry[] => {
    const now = new Date().toISOString().split('T')[0];
    return Knowledge.pricebook.filter(p => 
      p.productId === productId && 
      p.status === 'active' &&
      p.effectiveFrom <= now &&
      (!p.effectiveTo || p.effectiveTo >= now)
    );
  },

  getActivePrice: (query: { productId: ID, serviceId: ID, condition: Condition }): PriceBookEntry | undefined => {
    const now = new Date().toISOString().split('T')[0];
    return Knowledge.pricebook.find(p => 
      p.productId === query.productId &&
      p.serviceId === query.serviceId &&
      p.condition === query.condition &&
      p.status === 'active' &&
      p.effectiveFrom <= now &&
      (!p.effectiveTo || p.effectiveTo >= now)
    );
  }
};
