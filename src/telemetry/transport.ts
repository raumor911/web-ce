// Transporte: fetch con reintentos acotados, sendBeacon/keepalive al ocultar. Mantiene event_id en reintentos.
import { LIMITS, utf8Length } from './event-schema.ts';
import type { Queue } from './queue.ts';

export interface TransportDeps {
  endpoint: string;
  fetchImpl: (url: string, init: Record<string, unknown>) => Promise<{ status: number; headers?: { get(name: string): string | null } }>;
  beaconImpl?: ((url: string, data: unknown) => boolean) | null;
  makeBlob?: (body: string) => unknown;
  sleep: (ms: number) => Promise<void>;
  random: () => number;
  now: () => number;
}

export type SendOutcome = 'accepted' | 'dropped' | 'gave_up';

export interface Transport {
  /** Vacía la cola en lotes. Devuelve cuando no queda nada por enviar o se agotó el presupuesto de reintentos. */
  flush(queue: Queue): Promise<void>;
  /** Al ocultarse: envía lo que quede con sendBeacon (o fetch keepalive). Sincrónico en lo posible. */
  flushOnHide(queue: Queue): void;
  readonly stats: { sent: number; dropped: number; retries: number; beaconQueued: number };
}

export function buildBody(events: unknown[]): string {
  return JSON.stringify({ schema_version: 1, events });
}

export function createTransport(deps: TransportDeps): Transport {
  const stats = { sent: 0, dropped: 0, retries: 0, beaconQueued: 0 };
  let flushing = false;

  const retryAfterMs = (res: { headers?: { get(name: string): string | null } }): number => {
    const v = res.headers?.get('Retry-After');
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) && n >= 0 ? Math.min(n * 1000, LIMITS.retry_max_age_ms) : 0;
  };

  async function sendOne(items: ReturnType<Queue['take']>): Promise<SendOutcome> {
    const body = buildBody(items.map((x) => x.ev));
    for (let attempt = 0; attempt <= LIMITS.retry_max; attempt++) {
      let status = 0;
      let wait = 0;
      try {
        const res = await deps.fetchImpl(deps.endpoint, {
          method: 'POST', body, headers: { 'Content-Type': 'application/json' },
          credentials: 'omit', cache: 'no-store', mode: 'same-origin', referrerPolicy: 'no-referrer',
        });
        status = res.status;
        if (status >= 200 && status < 300) return 'accepted';
        wait = retryAfterMs(res);
      } catch { status = 0; }
      const retriable = status === 0 || status === 429 || status === 503;
      if (!retriable) return 'dropped';
      if (attempt === LIMITS.retry_max) return 'gave_up';
      const backoff = 1000 * 2 ** attempt * (0.5 + deps.random());
      const delay = Math.max(wait, backoff);
      const oldest = Math.min(...items.map((x) => x.queuedAt));
      if (deps.now() - oldest + delay > LIMITS.retry_max_age_ms) return 'gave_up';
      stats.retries++;
      await deps.sleep(delay);
    }
    return 'gave_up';
  }

  return {
    stats,
    async flush(queue) {
      if (flushing) return;
      flushing = true;
      try {
        while (queue.size > 0) {
          const items = queue.take(LIMITS.max_events_per_request, LIMITS.max_body_bytes);
          if (!items.length) break;
          const outcome = await sendOne(items);
          if (outcome === 'accepted') stats.sent += items.length;
          else { stats.dropped += items.length; if (outcome === 'gave_up') break; }
        }
      } finally { flushing = false; }
    },
    flushOnHide(queue) {
      // Una sola vaciada: take() saca los eventos de la cola, así que un segundo evento de ocultamiento no reenvía.
      while (queue.size > 0) {
        const items = queue.take(LIMITS.max_events_per_request, LIMITS.max_body_bytes);
        if (!items.length) break;
        const body = buildBody(items.map((x) => x.ev));
        if (utf8Length(body) > LIMITS.max_body_bytes) { stats.dropped += items.length; continue; }
        let queued = false;
        if (deps.beaconImpl && deps.makeBlob) {
          try { queued = deps.beaconImpl(deps.endpoint, deps.makeBlob(body)); } catch { queued = false; }
        }
        if (queued) { stats.beaconQueued += items.length; continue; }
        try {
          void deps.fetchImpl(deps.endpoint, {
            method: 'POST', body, headers: { 'Content-Type': 'application/json' },
            credentials: 'omit', cache: 'no-store', keepalive: true, mode: 'same-origin', referrerPolicy: 'no-referrer',
          }).catch(() => undefined);
          stats.beaconQueued += items.length;
        } catch { stats.dropped += items.length; }
      }
    },
  };
}
