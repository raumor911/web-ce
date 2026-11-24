// Listeners del DOM. Delegación por data-ce-*: no lee innerText, valores de inputs ni HTML, no usa preventDefault
// y no retrasa la navegación. Devuelve la función que retira todo (revocación y limpieza de StrictMode).
import { ELEMENTS, LIMITS } from './event-schema.ts';
import type { Collector } from './collector.ts';

const ID_RE = /^[a-z0-9][a-z0-9:_.-]{0,63}$/;

export function attachDom(collector: Collector, win: Window & typeof globalThis, doc: Document): () => void {
  const cleanups: Array<() => void> = [];
  const on = (target: Document | Window, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions) => {
    target.addEventListener(type, fn as EventListener, opts);
    cleanups.push(() => target.removeEventListener(type, fn as EventListener, opts));
  };

  // --- clics (click normal y teclado; auxclick solo para el botón central) ---
  const onActivate = (e: MouseEvent) => {
    collector.activity();
    const target = e.target as Element | null;
    const el = target && typeof target.closest === 'function' ? target.closest('[data-ce-event][data-ce-id]') : null;
    if (!el) return;
    const id = el.getAttribute('data-ce-id') || '';
    const spec = ELEMENTS[id];
    if (!spec || el.getAttribute('data-ce-event') !== spec.event) return;
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
    const product = el.getAttribute('data-ce-product');
    collector.trackElement(id, {
      product: product && ID_RE.test(product) ? product : undefined,
      destination: el instanceof win.HTMLAnchorElement ? (el as HTMLAnchorElement).pathname : undefined,
    });
  };
  on(doc, 'click', onActivate, { capture: true });
  on(doc, 'auxclick', (e: MouseEvent) => { if (e.button === 1) onActivate(e); }, { capture: true });

  // --- actividad (para engagement), sin registrar qué se tocó ---
  let lastActivity = 0;
  const onActivity = () => {
    const t = win.performance.now();
    if (t - lastActivity < 1000) return;
    lastActivity = t;
    collector.activity();
  };
  for (const type of ['pointerdown', 'keydown', 'touchstart']) on(doc, type, onActivity, { passive: true, capture: true });

  // --- scroll: porcentaje máximo = borde inferior del viewport / altura del documento ---
  let raf = 0;
  const measure = () => {
    raf = 0;
    const de = doc.documentElement;
    const height = Math.max(de.scrollHeight, doc.body ? doc.body.scrollHeight : 0);
    if (height <= win.innerHeight + 1) return; // sin desplazamiento: no se emite nada
    const bottom = (win.scrollY || de.scrollTop || 0) + win.innerHeight;
    collector.scrollProgress(Math.min(100, (bottom / height) * 100));
  };
  on(win, 'scroll', () => { onActivity(); if (!raf) raf = win.requestAnimationFrame(measure); }, { passive: true });
  cleanups.push(() => { if (raf) win.cancelAnimationFrame(raf); });

  // --- visibilidad, cierre y bfcache ---
  on(doc, 'visibilitychange', () => {
    if (doc.visibilityState === 'hidden') collector.hide();
    else collector.setVisible(true);
  });
  on(win, 'pagehide', () => collector.pageHide());
  on(win, 'pageshow', (e: PageTransitionEvent) => { if (e.persisted) collector.pageRestored(); });

  // --- inventory_view: ficha visible al 50% durante 1 s ---
  if (typeof win.IntersectionObserver === 'function') {
    const timers = new Map<Element, number>();
    const io = new win.IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target;
        const t = timers.get(el);
        if (entry.isIntersecting && entry.intersectionRatio >= LIMITS.inventory_visible_ratio) {
          if (t === undefined) {
            timers.set(el, win.setTimeout(() => {
              timers.delete(el);
              const product = el.getAttribute('data-ce-inventory') || '';
              if (ID_RE.test(product)) collector.inventoryVisible(product, el.getAttribute('data-ce-category') || undefined);
              io.unobserve(el);
            }, LIMITS.inventory_visible_ms));
          }
        } else if (t !== undefined) {
          win.clearTimeout(t);
          timers.delete(el);
        }
      }
    }, { threshold: [0, LIMITS.inventory_visible_ratio] });
    const scan = (root: ParentNode) => {
      if (root instanceof win.Element && (root as Element).matches('[data-ce-inventory]')) io.observe(root as Element);
      root.querySelectorAll('[data-ce-inventory]').forEach((el) => io.observe(el));
    };
    scan(doc);
    const mo = new win.MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => { if (n.nodeType === 1) scan(n as Element); });
    });
    mo.observe(doc.body || doc.documentElement, { childList: true, subtree: true });
    cleanups.push(() => { mo.disconnect(); io.disconnect(); timers.forEach((t) => win.clearTimeout(t)); timers.clear(); });
  }

  return () => { cleanups.splice(0).forEach((fn) => fn()); };
}
