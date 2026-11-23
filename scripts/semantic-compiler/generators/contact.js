import { canonicalUrl } from '../../../src/lib/canonicalUrl.mjs';

// Datos de contacto para las salidas de IA, tomados solo de organization.contact
// (fuente: src/knowledge/organization.json). No incluye horario: el JSON-LD y la
// página de contacto discrepan y está pendiente de confirmar por Raúl.
// Teléfono y WhatsApp son líneas distintas a propósito (confirmado por Raúl).
function whatsappDisplay(url) {
  const digits = String(url || '').match(/wa\.me\/(\d+)/)?.[1];
  const m = digits?.match(/^52(\d{3})(\d{3})(\d{4})$/);
  return m ? `+52 ${m[1]} ${m[2]} ${m[3]}` : null;
}

export function contactLines(org) {
  const c = org.contact || {};
  const lines = [];
  if (c.address?.formattedAddress) lines.push(`- Dirección: ${c.address.formattedAddress}`);
  if (c.telephone) lines.push(`- Teléfono: ${c.telephone}`);
  if (c.whatsapp) {
    const shown = whatsappDisplay(c.whatsapp);
    lines.push(`- WhatsApp (línea distinta del teléfono): ${shown ? `${shown}, ` : ''}${c.whatsapp}`);
  }
  if (c.email) lines.push(`- Correo: ${c.email}`);
  lines.push(`- Formulario de contacto y cotización: ${canonicalUrl('/contacto')}`);
  return lines;
}
