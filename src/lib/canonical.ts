export const CANONICAL_DOMAIN = 'https://creativosespacios.mx';

export const ORG_ID = `${CANONICAL_DOMAIN}/#organization`;
export const WEBSITE_ID = `${CANONICAL_DOMAIN}/#website`;

export function getCanonicalUrl(path: string): string {
  // Remove leading and trailing slashes for consistent generation
  const cleanPath = path.replace(/^\/|\/$/g, '');
  return cleanPath ? `${CANONICAL_DOMAIN}/${cleanPath}` : CANONICAL_DOMAIN;
}

export function getWebPageId(path: string): string {
  return `${getCanonicalUrl(path)}/#webpage`;
}

export function getEntityId(path: string, typeId: string): string {
  return `${getCanonicalUrl(path)}/#${typeId}`;
}
