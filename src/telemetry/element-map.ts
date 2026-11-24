// Mapa versionado de IDs comerciales (elements.json). `ce('id')` devuelve los atributos data-ce-* del marcado.
// Con la bandera de cliente apagada devuelve {} y el registro no entra al bundle.
import elements from './elements.json';

const ENABLED = import.meta.env.VITE_TELEMETRY_ENABLED === 'true';
type Spec = { event: string; placement: string; channel?: string; intent?: string };
const EMPTY: Record<string, string> = {};

export type ElementId = keyof typeof elements;

export function ce(id: ElementId, opts?: { product?: string }): Record<string, string> {
  if (!ENABLED) return EMPTY;
  const spec = (elements as Record<string, Spec>)[id];
  if (!spec) return EMPTY;
  const attrs: Record<string, string> = { 'data-ce-event': spec.event, 'data-ce-id': id, 'data-ce-placement': spec.placement };
  if (spec.channel) attrs['data-ce-channel'] = spec.channel;
  if (spec.intent) attrs['data-ce-intent'] = spec.intent;
  if (opts?.product) attrs['data-ce-product'] = opts.product;
  return attrs;
}

/** Enlaces de navegación: el ID se arma con la ubicación y la ruta destino (`navbar-nav-proyectos`). */
export function ceNav(placement: 'navbar' | 'footer', href: string): Record<string, string> {
  if (!ENABLED) return EMPTY;
  const slug = href.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  const id = `${placement}-nav-${slug}`;
  return (elements as Record<string, Spec>)[id] ? ce(id as ElementId) : EMPTY;
}

/** Ficha de inventario visible: atributos para inventory_view. */
export function ceInventory(productId: string, categoryId?: string): Record<string, string> {
  if (!ENABLED) return EMPTY;
  const attrs: Record<string, string> = { 'data-ce-inventory': productId };
  if (categoryId) attrs['data-ce-category'] = categoryId;
  return attrs;
}
