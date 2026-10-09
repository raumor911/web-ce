import { Knowledge } from './index';
import { ID, Organization, Service, Product, Configuration, UseCase, FAQ, Claim, Source, CommercialPolicy, Coverage, Industry, Case, Terminology, CanonicalAnswer, Intent } from '../types/semantic';

export const SemanticSelectors = {
  getOrganization: (): Organization => Knowledge.organization,
  
  getServiceById: (id: ID): Service | undefined => 
    Knowledge.services.find(s => s.id === id),
  
  getServices: (): Service[] => Knowledge.services,
  
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
    
  getFaqByCategory: (categoryId: string): FAQ[] => {
    // For legacy compat during wiring
    return Knowledge.faq.filter(f => f.tags && f.tags.includes(categoryId) && f.status === 'published');
  },
  
  getGeneralFaq: (): FAQ[] => {
    return Knowledge.faq.filter(f => f.tags && f.tags.includes('general') && f.status === 'published');
  }
};
