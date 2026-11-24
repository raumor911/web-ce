// Validación estricta de eventos. Mismo algoritmo que server/telemetry/src/Contract.php
// (ambos leen contract.json y elements.json). Cualquier cambio aquí exige el cambio gemelo en PHP.
import contract from './contract.json' with { type: 'json' };
import elements from './elements.json' with { type: 'json' };
import { canonicalPath } from '../lib/canonicalUrl.mjs';
import type { ElementSpec } from './types.ts';

export const SCHEMA_VERSION = 1;
export const LIMITS = contract.limits;
export const CONTRACT = contract;
export const ELEMENTS = elements as Record<string, ElementSpec>;

const P = Object.fromEntries(Object.entries(contract.patterns).map(([k, v]) => [k, new RegExp(v)])) as Record<string, RegExp>;
const ENUMS = contract.enums as Record<string, Array<string | number>>;

export interface Result<T> { ok: boolean; value?: T; error?: string }
const fail = <T = never>(error: string): Result<T> => ({ ok: false, error });

export function hasControlChars(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x20 || c === 0x7f) return true;
  }
  return false;
}

/** Normaliza un pathname. Devuelve null si no es admisible (control, charset, %2F, dot-segments, rutas sensibles). */
export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > LIMITS.max_path_length + 64) return null;
  let p = raw;
  const cut = p.search(/[?#]/);
  if (cut >= 0) p = p.slice(0, cut);
  if (p.length === 0 || p[0] !== '/' || hasControlChars(p)) return null;
  if (!/^[A-Za-z0-9._~%/-]+$/.test(p)) return null;
  if (p.includes('//')) return null;
  let bad = false;
  p = p.replace(/%([0-9A-Fa-f]{2})/g, (_m, h: string) => {
    const n = parseInt(h, 16);
    if (n < 0x20 || n === 0x7f || n === 0x2f || n === 0x5c || n === 0x25) bad = true;
    return '%' + h.toUpperCase();
  });
  if (bad || /%(?![0-9A-F]{2})/.test(p)) return null;
  if (p.split('/').some((seg) => seg === '.' || seg === '..')) return null;
  p = canonicalPath(p);
  if (p.length > LIMITS.max_path_length) return null;
  if (isExcludedPath(p)) return null;
  return p;
}

export function isExcludedPath(path: string): boolean {
  const lower = path.toLowerCase();
  return contract.excluded_path_prefixes.some((x) => lower.startsWith(x) || lower === x.replace(/\/$/, '') + '/');
}

export function routeIdFor(path: string): string | null {
  const routes = contract.routes as Record<string, string>;
  if (routes[path]) return routes[path];
  for (const [prefix, id] of Object.entries(contract.route_prefixes as Record<string, string>)) {
    if (path.startsWith(prefix) && path.length > prefix.length) return id;
  }
  return null;
}

function digitRunTooLong(s: string): boolean {
  const m = s.match(/[0-9]+/g);
  return !!m && m.some((x) => x.length > LIMITS.utm_max_digit_run);
}

function checkProp(kind: string, value: unknown): string | null {
  if (kind.startsWith('enum:')) {
    const list = ENUMS[kind.slice(5)];
    return list && list.includes(value as string | number) ? null : 'enum';
  }
  switch (kind) {
    case 'id': return typeof value === 'string' && P.id.test(value) ? null : 'id';
    case 'element': return typeof value === 'string' && Object.prototype.hasOwnProperty.call(ELEMENTS, value) ? null : 'element';
    case 'path': return typeof value === 'string' && normalizePath(value) === value ? null : 'path';
    case 'host': return typeof value === 'string' && value.length <= LIMITS.max_host_length && P.host.test(value) ? null : 'host';
    case 'utm': return typeof value === 'string' && P.utm.test(value) && !digitRunTooLong(value) && !value.includes('@') ? null : 'utm';
    case 'count': return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= LIMITS.max_result_count ? null : 'count';
    case 'active_ms': return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= LIMITS.engagement_max_ms ? null : 'active_ms';
    default: return 'kind';
  }
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;

const TOP_KEYS = ['event_id', 'session_id', 'page_view_id', 'sequence', 'name', 'occurred_at', 'page_path', 'route_id', 'release_id', 'properties'];

export interface ValidEvent {
  event_id: string; session_id: string; page_view_id: string; sequence: number; name: string;
  occurred_at: string; page_path: string; route_id: string | null; release_id: string;
  properties: Record<string, string | number>;
}

export function validateEvent(ev: unknown): Result<ValidEvent> {
  if (!isPlainObject(ev)) return fail('event_not_object');
  for (const k of Object.keys(ev)) if (!TOP_KEYS.includes(k)) return fail('unknown_field:' + k);
  for (const k of ['event_id', 'session_id', 'page_view_id']) {
    if (typeof ev[k] !== 'string' || !P.uuid.test(ev[k] as string)) return fail('bad_' + k);
  }
  if (!Number.isInteger(ev.sequence) || (ev.sequence as number) < 0 || (ev.sequence as number) > LIMITS.max_sequence) return fail('bad_sequence');
  const spec = (contract.events as unknown as Record<string, { required: Record<string, string> | never[]; optional: Record<string, string> }>)[ev.name as string];
  if (typeof ev.name !== 'string' || !spec) return fail('bad_name');
  if (typeof ev.occurred_at !== 'string' || !P.timestamp.test(ev.occurred_at) || Number.isNaN(Date.parse(ev.occurred_at))) return fail('bad_occurred_at');
  const path = normalizePath(ev.page_path);
  if (path === null || path !== ev.page_path) return fail('bad_page_path');
  if (typeof ev.release_id !== 'string' || !P.release.test(ev.release_id)) return fail('bad_release_id');
  if (ev.route_id !== undefined && (typeof ev.route_id !== 'string' || !P.id.test(ev.route_id))) return fail('bad_route_id');
  if (!isPlainObject(ev.properties)) return fail('bad_properties');
  const required = Array.isArray(spec.required) ? {} : (spec.required as Record<string, string>);
  const allowed: Record<string, string> = { ...spec.optional, ...required };
  const props = ev.properties as Record<string, unknown>;
  for (const k of Object.keys(props)) {
    if (!(k in allowed)) return fail('unknown_property:' + k);
    const bad = checkProp(allowed[k], props[k]);
    if (bad) return fail('bad_property:' + k);
  }
  for (const k of Object.keys(required)) if (!(k in props)) return fail('missing_property:' + k);
  // Coherencia con el registro de elementos: el evento y los atributos deben coincidir con el ID.
  if (typeof props.element_id === 'string') {
    const el = ELEMENTS[props.element_id];
    if (!el || el.event !== ev.name) return fail('element_event_mismatch');
    if (el.placement !== props.placement) return fail('element_placement_mismatch');
    if (el.channel && el.channel !== props.channel) return fail('element_channel_mismatch');
    if (el.intent && el.intent !== props.intent) return fail('element_intent_mismatch');
  }
  return {
    ok: true,
    value: {
      event_id: ev.event_id as string, session_id: ev.session_id as string, page_view_id: ev.page_view_id as string,
      sequence: ev.sequence as number, name: ev.name, occurred_at: ev.occurred_at, page_path: path,
      route_id: routeIdFor(path), release_id: ev.release_id, properties: props as Record<string, string | number>,
    },
  };
}

export function utf8Length(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xd800 && c <= 0xdbff) { n += 4; i++; }
    else n += 3;
  }
  return n;
}

export type BatchError = 'bad_json' | 'too_large' | 'bad_envelope' | 'too_many_events' | 'empty_batch' | 'duplicate_in_batch' | string;

export function validateBatch(body: string): Result<ValidEvent[]> {
  if (utf8Length(body) > LIMITS.max_body_bytes) return fail('too_large');
  let doc: unknown;
  try { doc = JSON.parse(body); } catch { return fail('bad_json'); }
  if (!isPlainObject(doc) || Object.keys(doc).some((k) => k !== 'schema_version' && k !== 'events')) return fail('bad_envelope');
  if (doc.schema_version !== SCHEMA_VERSION || !Array.isArray(doc.events)) return fail('bad_envelope');
  if (doc.events.length === 0) return fail('empty_batch');
  if (doc.events.length > LIMITS.max_events_per_request) return fail('too_many_events');
  const out: ValidEvent[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < doc.events.length; i++) {
    const r = validateEvent(doc.events[i]);
    if (!r.ok) return fail(`event_${i}:${r.error}`);
    const v = r.value as ValidEvent;
    if (seen.has(v.event_id)) return fail('duplicate_in_batch');
    seen.add(v.event_id);
    out.push(v);
  }
  return { ok: true, value: out };
}
