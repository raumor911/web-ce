export type ID = string;

export interface AddressInfo {
  streetAddress: string;
  addressLocality: string;
  borough?: string;
  postalCode: string;
  addressRegion: string;
  addressCountry: string;
  formattedAddress: string;
}

export interface ContactInfo {
  telephone: string;
  email: string;
  whatsapp: string;
  address: AddressInfo;
}

export interface Organization {
  id: ID;
  name: string;
  legalName: string;
  description: string;
  preferredPositioning: string;
  coreProposition: string;
  country: string;
  language: string;
  contact: ContactInfo;
  canonicalUrl: string;
}

export type TransactionType = 'sale' | 'rental' | 'sale-or-rental' | 'custom-project';
export type AvailabilityPolicy = 'subject-to-confirmation' | 'immediate' | 'made-to-order';

export interface Service {
  id: ID;
  name: string;
  description: string;
  canonicalPath: string;
  transactionType: TransactionType;
  availabilityPolicy: AvailabilityPolicy;
  requiresAssessment: boolean;
  productIds?: ID[];
  configurationIds?: ID[];
  useCaseIds?: ID[];
  industryIds?: ID[];
  coverageIds?: ID[];
  claimIds?: ID[];
  sourceIds?: ID[];
  status: 'active' | 'deprecated';
}

export interface Product {
  id: ID;
  name: string;
  description: string;
  category: string;
  dimensions: string;
  features: string[];
  serviceIds?: ID[];
  useCaseIds?: ID[];
  claimIds?: ID[];
  sourceIds?: ID[];
}

export interface Configuration {
  id: ID;
  name: string;
  description: string;
  features: string[];
  serviceIds?: ID[];
  useCaseIds?: ID[];
}

export interface UseCase {
  id: ID;
  name: string;
  description: string;
  serviceIds?: ID[];
  productIds?: ID[];
}

export interface CommercialPolicy {
  id: ID;
  name: string;
  description: string;
  rules: string[];
  originType?: 'explicit' | 'derived' | 'internal';
  sourceIds?: ID[];
}

export interface Coverage {
  id: ID;
  name: string;
  type: 'national' | 'regional' | 'local';
  countryCode: string;
}

export interface Industry {
  id: ID;
  name: string;
  description: string;
}

export interface FAQ {
  id: ID;
  question: string;
  answer: string;
  serviceIds?: ID[];
  sourceIds?: ID[];
  claimIds?: ID[];
  tags?: string[];
  status: 'draft' | 'published' | 'deprecated';
}

export type ClaimStatus = 'verified' | 'pending' | 'deprecated' | 'rejected' | 'verify-wording';
export type ClaimVisibility = 'public' | 'internal';
export type ClaimVolatility = 'stable' | 'periodic' | 'dynamic' | 'project-specific';

export type TransactionStage = 
  | 'discovery'
  | 'exploration'
  | 'selection'
  | 'comparison'
  | 'transactional'
  | 'validation'
  | 'logistics'
  | 'conversion';

export interface Terminology {
  id: ID;
  term: string;
  definition: string;
  context: 'preferred' | 'neutral' | 'incomplete' | 'avoid';
}

export interface CanonicalAnswer {
  id: ID;
  question: string;
  answer: string;
}

export interface Intent {
  id: ID;
  name: string;
  description: string;
  goal: string;
  need: string;
  transactionStage: TransactionStage;
  timeHorizon?: string;
  useCaseIds?: ID[];
  serviceIds?: ID[];
  productIds?: ID[];
  configurationIds?: ID[];
  industryIds?: ID[];
  coverageIds?: ID[];
  exampleExpressions: string[];
  sourceIds?: ID[];
  status: 'draft' | 'published' | 'deprecated';
  visibility: 'public' | 'internal';
}

export interface Claim {
  id: ID;
  subjectId: ID;
  status: ClaimStatus;
  visibility: ClaimVisibility;
  volatility: ClaimVolatility;
  sourceIds: ID[];
  verifiedAt?: string;
  reviewAfter?: string;
  notes?: string;
}

export type SourceType = 'webpage' | 'internal-analysis' | 'case' | 'document' | 'customer-evidence' | 'image' | 'external-source';

export interface Source {
  id: ID;
  type: SourceType;
  url?: string;
  name: string;
  status: 'canonical' | 'reference' | 'deprecated';
}

export interface Case {
  id: ID;
  status: 'published' | 'draft';
  title: string;
  serviceIds?: ID[];
  productIds?: ID[];
  configurationIds?: ID[];
  useCaseIds?: ID[];
  industryIds?: ID[];
  location?: string;
  application?: string;
  operationalStatus?: string;
  imageIds?: ID[];
  claimIds?: ID[];
  sourceIds?: ID[];
  canonicalPath?: string;
  publishedAt?: string;
  lastVerifiedAt?: string;
}

export interface TerminologyEntry {
  id: ID;
  term: string;
  definition: string;
  context: string;
  avoid?: string[];
}
