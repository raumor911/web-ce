// Saneamiento de datos de navegador antes de que entren a un evento. Nada de esto se envía sin pasar por event-schema.
import { LIMITS, normalizePath } from './event-schema.ts';

export { normalizePath };

/** Limpia un valor UTM: minúsculas, sin caracteres fuera de la lista, sin correos ni números largos. Devuelve null si no es admisible. */
export function sanitizeUtm(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  let v = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (v.includes('@')) return null;
  v = v.replace(/[^a-z0-9 _.:+/-]/g, '').slice(0, LIMITS.max_utm_length).trim();
  if (!v) return null;
  const runs = v.match(/[0-9]+/g);
  if (runs && runs.some((r) => r.length > LIMITS.utm_max_digit_run)) return null;
  return v;
}

/** Solo los tres parámetros UTM permitidos; ignora gclid, fbclid, utm_term, correos y el resto de la query. */
export function utmFromSearch(search: string): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  const out: { utm_source?: string; utm_medium?: string; utm_campaign?: string } = {};
  let params: URLSearchParams;
  try { params = new URLSearchParams(search); } catch { return out; }
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
    const v = sanitizeUtm(params.get(key));
    if (v) out[key] = v;
  }
  return out;
}

/** Hostname del referrer externo (nunca la URL). null si es vacío, inválido o del propio sitio. */
export function referrerHost(referrer: string, ownHost: string): string | null {
  if (!referrer) return null;
  let u: URL;
  try { u = new URL(referrer); } catch { return null; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  const host = u.hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
  const own = ownHost.toLowerCase().replace(/^www\./, '');
  if (!host || host === own || host.length > LIMITS.max_host_length) return null;
  return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(host) ? host : null;
}

/** Clase de dispositivo con reglas simples. El user-agent no sale del navegador. */
export function deviceClass(userAgent: string, maxTouchPoints = 0, platform = ''): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  const ua = userAgent || '';
  if (!ua) return 'unknown';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet';
  if (platform === 'MacIntel' && maxTouchPoints > 1) return 'tablet';
  if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) return 'mobile';
  return 'desktop';
}
