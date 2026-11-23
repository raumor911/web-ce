import { canonicalUrl } from '../../../src/lib/canonicalUrl.mjs';

// Datos de contacto para las salidas de IA, tomados solo de organization.contact
// (fuente: src/knowledge/organization.json). No incluye dirección ni horario: hoy
// hay fuentes del sitio que se contradicen y no deben propagarse a las salidas de IA.
export function contactLines(org) {
  const c = org.contact || {};
  const lines = [];
  if (c.telephone) lines.push(`- Teléfono: ${c.telephone}`);
  if (c.email) lines.push(`- Correo: ${c.email}`);
  if (c.whatsapp) lines.push(`- WhatsApp: ${c.whatsapp}`);
  lines.push(`- Formulario de contacto y cotización: ${canonicalUrl('/contacto')}`);
  return lines;
}
