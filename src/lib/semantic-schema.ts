import { Coverage } from '../types/semantic';

/**
 * Converts a Semantic Core Coverage entity to a Schema.org areaServed representation.
 */
export function coverageToAreaServed(coverage: Coverage | Coverage[]) {
  const coverages = Array.isArray(coverage) ? coverage : [coverage];
  
  if (coverages.length === 0) return undefined;
  
  // If we have multiple coverages, return an array of AreaServed objects
  if (coverages.length > 1) {
    return coverages.map(c => mapCoverageToSchema(c));
  }
  
  return mapCoverageToSchema(coverages[0]);
}

function mapCoverageToSchema(coverage: Coverage) {
  switch (coverage.type) {
    case 'national':
      return {
        "@type": "Country",
        "name": coverage.name.includes("México") ? "México" : coverage.name,
        "identifier": coverage.countryCode
      };
    case 'regional':
      return {
        "@type": "AdministrativeArea",
        "name": coverage.name,
        "addressCountry": coverage.countryCode
      };
    case 'local':
      return {
        "@type": "Place",
        "name": coverage.name,
        "addressCountry": coverage.countryCode
      };
    default:
      return {
        "@type": "Place",
        "name": coverage.name
      };
  }
}
