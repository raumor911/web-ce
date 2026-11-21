import { CANONICAL_ORIGIN, canonicalUrl } from './canonicalUrl.mjs';

export const CANONICAL_DOMAIN = CANONICAL_ORIGIN;

export const ORG_ID = `${CANONICAL_DOMAIN}/#organization`;
export const WEBSITE_ID = `${CANONICAL_DOMAIN}/#website`;

/** URL canónica: ruta de página con barra final; archivos con extensión sin barra. */
export function getCanonicalUrl(path: string): string {
  return canonicalUrl(path);
}

export function getWebPageId(path: string): string {
  return `${getCanonicalUrl(path)}#webpage`;
}

export function getEntityId(path: string, typeId: string): string {
  return `${getCanonicalUrl(path)}#${typeId}`;
}
