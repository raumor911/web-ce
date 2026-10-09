import fs from 'fs';
import path from 'path';

export function generateJSONLD(knowledge, outDir) {
  const schemaDir = path.join(outDir, 'ai', 'schema');
  if (!fs.existsSync(schemaDir)) fs.mkdirSync(schemaDir, { recursive: true });

  const orgId = "https://creativosespacios.mx/#organization";
  const websiteId = "https://creativosespacios.mx/#website";

  const org = knowledge.organization;

  // OfferCatalog
  const offerCatalog = {
    "@type": "OfferCatalog",
    "name": "Catálogo de Servicios",
    "itemListElement": knowledge.services.map(s => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "@id": `https://creativosespacios.mx${s.canonicalPath}#${s.id.split(':')[1]}`,
        "name": s.name,
        "description": s.description
      }
    }))
  };

  const organizationJSONLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    "name": org.name,
    "legalName": org.legalName,
    "description": org.description,
    "url": org.canonicalUrl,
    "telephone": org.contact.telephone,
    "email": org.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": org.contact.address,
      "addressCountry": org.country
    },
    "hasOfferCatalog": offerCatalog
  };

  fs.writeFileSync(path.join(schemaDir, 'organization.jsonld'), JSON.stringify(organizationJSONLD, null, 2));

  const websiteJSONLD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    "url": org.canonicalUrl,
    "name": org.name,
    "publisher": { "@id": orgId },
    "inLanguage": org.language
  };

  fs.writeFileSync(path.join(schemaDir, 'website.jsonld'), JSON.stringify(websiteJSONLD, null, 2));

  const servicesJSONLD = {
    "@context": "https://schema.org",
    ...offerCatalog
  };

  fs.writeFileSync(path.join(schemaDir, 'services.jsonld'), JSON.stringify(servicesJSONLD, null, 2));
}
