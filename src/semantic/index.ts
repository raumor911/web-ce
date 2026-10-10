// Static imports in build-time. We don't fetch from network.
import organization from '../knowledge/organization.json';
import services from '../knowledge/services.json';
import products from '../knowledge/products.json';
import configurations from '../knowledge/configurations.json';
import useCases from '../knowledge/use-cases.json';
import faq from '../knowledge/faq.json';
import claims from '../knowledge/claims.json';
import sources from '../knowledge/sources.json';
import commercial from '../knowledge/commercial.json';
import coverage from '../knowledge/coverage.json';
import industries from '../knowledge/industries.json';
import cases from '../knowledge/cases.json';
import terminology from '../knowledge/terminology.json';
import canonicalAnswers from '../knowledge/canonical-answers.json';
import intents from '../knowledge/intents.json';
import locations from '../knowledge/locations.json';
import pricebook from '../knowledge/pricebook.json';

import { Organization, Service, Product, Configuration, UseCase, FAQ, Claim, Source, CommercialPolicy, Coverage, Industry, Case, Terminology, CanonicalAnswer, Intent, Location, PriceBookEntry } from '../types/semantic';

export const Knowledge = {
  organization: organization as unknown as Organization,
  services: services as unknown as Service[],
  products: products as unknown as Product[],
  configurations: configurations as unknown as Configuration[],
  useCases: useCases as unknown as UseCase[],
  faq: faq as unknown as FAQ[],
  claims: claims as unknown as Claim[],
  sources: sources as unknown as Source[],
  commercial: commercial as unknown as CommercialPolicy[],
  coverage: coverage as unknown as Coverage[],
  industries: industries as unknown as Industry[],
  cases: cases as unknown as Case[],
  terminology: terminology as unknown as Terminology[],
  canonicalAnswers: canonicalAnswers as unknown as CanonicalAnswer[],
  intents: intents as unknown as Intent[],
  locations: locations as unknown as Location[],
  pricebook: pricebook as unknown as PriceBookEntry[]
};
