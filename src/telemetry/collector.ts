// Núcleo del recolector: vistas, sesión, atribución, engagement, scroll y cola. Sin dependencias de React ni del DOM
// (todo el entorno entra por `env`) para poder probarlo con reloj controlado.
import { ELEMENTS, LIMITS, normalizePath, routeIdFor, validateEvent } from './event-schema.ts';
import { utmFromSearch, referrerHost } from './sanitize.ts';
import { uuidV4, randomId128 } from './session.ts';
import type { RandomBytes, SessionManager } from './session.ts';
import type { Consent } from './consent.ts';
import type { Queue } from './queue.ts';
import type { Transport } from './transport.ts';
import type { EventName, Props, TelemetryEvent } from './types.ts';

export interface CollectorEnv {
  now: () => number;            // reloj de pared (ms)
  mono: () => number;           // reloj monotónico (ms)
  random: RandomBytes;
  releaseId: string;
  ownHost: string;
  referrer: string;
  landing: { path: string; search: string };
  device: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  excluded: () => boolean;      // prerender, automatización propia, DEV
  setTimeout: (fn: () => void, ms: number) => unknown;
  clearTimeout: (h: unknown) => void;
  setInterval: (fn: () => void, ms: number) => unknown;
  clearInterval: (h: unknown) => void;
  attach: (collector: Collector) => () => void;     // registra los listeners del DOM; devuelve la función que los retira
  debug?: (msg: string) => void;
}

interface View {
  id: string; path: string;
  thresholds: Set<number>; once: Set<string>; inventory: Set<string>;
  active: number; lastAccrue: number; activeUntil: number; visible: boolean;
}

export interface Collector {
  setPath(pathname: string, opts?: { documentLoad?: boolean }): void;
  track(name: EventName, props: Props, onceKey?: string): void;
  trackElement(id: string, extra?: { product?: string; destination?: string }): void;
  scrollProgress(percent: number): void;
  inventoryVisible(productId: string, categoryId?: string): void;
  activity(): void;
  setVisible(visible: boolean): void;
  hide(): void;
  pageHide(): void;
  pageRestored(): void;
  flush(): Promise<void>;
  dispose(): void;
  readonly isActive: boolean;
  readonly currentViewId: string | null;
  readonly dropped: number;
}

export function createCollector(deps: {
  env: CollectorEnv; consent: Consent; session: SessionManager; queue: Queue; transport: Transport;
}): Collector {
  const { env, consent, session, queue, transport } = deps;
  let active = false;
  let detach: (() => void) | null = null;
  let view: View | null = null;
  let currentPath: string | null = null; // última ruta observada, aunque no haya captura
  let closed = false;                    // la vista se cerró por pagehide (bfcache)
  let flushTimer: unknown = null;
  let engagementTimer: unknown = null;
  let invalid = 0;

  const isExcluded = () => { try { return env.excluded(); } catch { return true; } };

  // ---------- engagement (reloj monotónico, intervalos sin superposición) ----------
  const accrue = (t: number) => {
    if (!view) return;
    if (view.visible && view.lastAccrue < view.activeUntil) {
      view.active += Math.max(0, Math.min(t, view.activeUntil) - view.lastAccrue);
    }
    view.lastAccrue = t;
  };
  const emitEngagement = () => {
    if (!view) return;
    accrue(env.mono());
    let ms = Math.floor(view.active);
    view.active = 0;
    while (ms > 0) {
      const chunk = Math.min(ms, LIMITS.engagement_max_ms);
      emit('engagement', { active_ms: chunk });
      ms -= chunk;
    }
  };

  // ---------- emisión ----------
  function scheduleFlush() {
    if (queue.size >= LIMITS.flush_events) {
      if (flushTimer) { env.clearTimeout(flushTimer); flushTimer = null; }
      void transport.flush(queue);
    } else if (!flushTimer) {
      flushTimer = env.setTimeout(() => { flushTimer = null; void transport.flush(queue); }, LIMITS.flush_interval_ms);
    }
  }

  function emit(name: EventName, props: Props): void {
    if (!active || !view) return;
    const s = session.touch();
    if (s.isNew && name !== 'page_view') {
      // La sesión se renovó por inactividad: la vista continúa en una sesión nueva, que arranca con su page_view.
      const path = view.path;
      view = newView(path);
      writeEvent('page_view', {}, s.sessionId);
      if (name === 'engagement') return;
    }
    writeEvent(name, props, s.sessionId);
  }

  function writeEvent(name: EventName, props: Props, sessionId: string): void {
    if (!view) return;
    const ev: TelemetryEvent = {
      event_id: uuidV4(env.random),
      session_id: sessionId,
      page_view_id: view.id,
      sequence: session.nextSequence(),
      name,
      occurred_at: new Date(env.now()).toISOString(),
      page_path: view.path,
      release_id: env.releaseId,
      properties: props,
    };
    const route = routeIdFor(view.path);
    if (route) ev.route_id = route;
    const check = validateEvent(ev);
    if (!check.ok) { invalid++; env.debug?.('descartado:' + check.error); return; }
    queue.push(ev, env.now());
    scheduleFlush();
  }

  function newView(path: string): View {
    const t = env.mono();
    return {
      id: randomId128(env.random), path, thresholds: new Set(), once: new Set(), inventory: new Set(),
      active: 0, lastAccrue: t, activeUntil: t + LIMITS.engagement_idle_ms, visible: true,
    };
  }

  function closeView() {
    if (view) emitEngagement();
    view = null;
  }

  // ---------- activación según la preferencia ----------
  function activate() {
    if (active || isExcluded()) return;
    active = true;
    detach = env.attach(api);
    engagementTimer = env.setInterval(() => { if (view && view.visible) emitEngagement(); }, LIMITS.engagement_flush_ms);
    if (currentPath !== null) api.setPath(currentPath, { documentLoad: false });
  }

  function deactivate() {
    if (!active) return;
    active = false;
    view = null;
    if (detach) { detach(); detach = null; }
    if (flushTimer) { env.clearTimeout(flushTimer); flushTimer = null; }
    if (engagementTimer) { env.clearInterval(engagementTimer); engagementTimer = null; }
    queue.clear();
    session.clear();
  }

  const unsubscribe = consent.subscribe((state) => { if (state === 'granted') activate(); else deactivate(); });
  const api: Collector = {
    setPath(pathname, opts = {}) {
      currentPath = pathname;
      closed = false;
      if (!active) return;
      const path = normalizePath(pathname);
      if (path === null) { closeView(); return; }
      if (view && view.path === path && !opts.documentLoad) return;
      const prev = view ? view.path : null;
      closeView();
      view = newView(path);
      const s = session.touch();
      const props: Props = {};
      if (prev) props.previous_path = prev;
      const onLanding = env.landing.path === path;
      if (s.isNew && (opts.documentLoad || onLanding)) {
        const utm = onLanding ? utmFromSearch(env.landing.search) : {};
        Object.assign(props, utm);
        const host = onLanding ? referrerHost(env.referrer, env.ownHost) : null;
        if (host) props.landing_source = host;
        props.device_class = env.device;
      } else if (s.isNew) {
        props.device_class = env.device;
      }
      writeEvent('page_view', props, s.sessionId);
    },

    track(name, props, onceKey) {
      if (!active || !view) return;
      if (onceKey) {
        if (view.once.has(onceKey)) return;
        view.once.add(onceKey);
      }
      emit(name, props);
    },

    trackElement(id, extra = {}) {
      const spec = ELEMENTS[id];
      if (!spec || !active || !view) return;
      const props: Props = { element_id: id, placement: spec.placement };
      if (spec.event === 'contact_click') { props.channel = spec.channel as string; props.intent = spec.intent as string; }
      if (spec.event === 'navigation_click') {
        const dest = extra.destination ? normalizePath(extra.destination) : null;
        if (!dest) return;
        props.destination_path = dest;
      }
      if (extra.product && spec.event !== 'navigation_click') props.product_id = extra.product;
      emit(spec.event, props);
    },

    scrollProgress(percent) {
      if (!active || !view) return;
      for (const t of [25, 50, 75, 90]) {
        if (percent >= t && !view.thresholds.has(t)) {
          view.thresholds.add(t);
          emit('scroll_depth', { percent: t });
        }
      }
    },

    inventoryVisible(productId, categoryId) {
      if (!active || !view || view.inventory.has(productId)) return;
      view.inventory.add(productId);
      const props: Props = { product_id: productId };
      if (categoryId && /^[a-z0-9][a-z0-9:_.-]{0,63}$/.test(categoryId)) props.category_id = categoryId;
      emit('inventory_view', props);
    },

    activity() {
      if (!active || !view) return;
      const t = env.mono();
      accrue(t);
      view.activeUntil = t + LIMITS.engagement_idle_ms;
    },

    setVisible(visible) {
      if (!view) return;
      accrue(env.mono());
      view.visible = visible;
      if (visible) { view.lastAccrue = env.mono(); view.activeUntil = Math.max(view.activeUntil, view.lastAccrue + LIMITS.engagement_idle_ms); }
    },

    hide() {
      if (!active) return;
      if (view) { emitEngagement(); view.visible = false; }
      if (flushTimer) { env.clearTimeout(flushTimer); flushTimer = null; }
      transport.flushOnHide(queue);
    },

    pageHide() {
      if (!active) return;
      closed = true;
      closeView();
      if (flushTimer) { env.clearTimeout(flushTimer); flushTimer = null; }
      transport.flushOnHide(queue);
    },

    pageRestored() {
      if (!active) return;
      if (closed && currentPath !== null) api.setPath(currentPath, { documentLoad: true });
    },

    flush: () => transport.flush(queue),

    dispose() { unsubscribe(); deactivate(); },
    get isActive() { return active; },
    get currentViewId() { return view ? view.id : null; },
    get dropped() { return queue.dropped + invalid; },
  };
  // La activación inicial va DESPUÉS de construir `api` (antes provocaba un error de inicialización con preferencia ya concedida).
  if (consent.get() === 'granted') activate();
  return api;
}
