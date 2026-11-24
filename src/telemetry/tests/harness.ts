/* eslint-disable @typescript-eslint/no-explicit-any */
// Entorno controlado para pruebas: reloj, temporizadores, almacenamiento, red y listeners falsos. Sin datos reales.
import { createCollector } from '../collector.ts';
import { createConsent } from '../consent.ts';
import { createQueue } from '../queue.ts';
import { createSession } from '../session.ts';
import { createTransport } from '../transport.ts';
import type { StorageLike } from '../types.ts';

export class MemStorage implements StorageLike {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? (this.m.get(k) as string) : null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

export interface FetchCall { url: string; body: any; raw: string }

export function harness(opts: {
  path?: string; search?: string; referrer?: string; consent?: 'granted' | 'denied' | 'unknown';
  local?: MemStorage; session?: MemStorage; fetchPlan?: Array<number | 'throw' | { status: number; retryAfter?: number }>;
  excluded?: boolean; beacon?: boolean; startMs?: number; seed?: number;
} = {}) {
  let wall = opts.startMs ?? Date.UTC(2026, 10, 24, 20, 0, 0);
  let mono = 5000;
  let seed = opts.seed ?? 1;
  const timers: Array<{ id: number; at: number; fn: () => void; every?: number }> = [];
  let tid = 0;
  const local = opts.local ?? new MemStorage();
  const sess = opts.session ?? new MemStorage();
  if (opts.consent) local.setItem('ce_telemetry_consent_v1', JSON.stringify({ v: 1, state: opts.consent }));
  const calls: FetchCall[] = [];
  const beacons: FetchCall[] = [];
  const plan = [...(opts.fetchPlan ?? [])];
  const random = (n: number) => { const o = new Uint8Array(n); for (let i = 0; i < n; i++) o[i] = (seed = (seed * 1103515245 + 12345) & 0x7fffffff) >> 8; return o; };
  const consent = createConsent(local);
  const session = createSession({ storage: sess, now: () => wall, random });
  const queue = createQueue();
  const transport = createTransport({
    endpoint: '/telemetria/collect.php',
    fetchImpl: async (url, init) => {
      const raw = String(init.body);
      calls.push({ url, body: JSON.parse(raw), raw });
      const step = plan.length ? plan.shift() : 200;
      if (step === 'throw') throw new Error('offline');
      if (typeof step === 'object') return { status: step.status, headers: { get: (n: string) => (n === 'Retry-After' && step.retryAfter !== undefined ? String(step.retryAfter) : null) } };
      return { status: step as number, headers: { get: () => null } };
    },
    beaconImpl: opts.beacon === false ? null : (url, data) => { const raw = String(data); beacons.push({ url, body: JSON.parse(raw), raw }); return true; },
    makeBlob: (b) => b,
    sleep: (ms) => new Promise<void>((resolve) => { timers.push({ id: ++tid, at: mono + ms, fn: resolve }); }),
    random: () => 0.5,
    now: () => wall,
  });
  let attached = 0, detached = 0;
  const collector = createCollector({
    env: {
      now: () => wall, mono: () => mono, random, releaseId: 'test-sha', ownHost: 'creativosespacios.mx',
      referrer: opts.referrer ?? '', landing: { path: opts.path ?? '/', search: opts.search ?? '' }, device: 'desktop',
      excluded: () => !!opts.excluded,
      setTimeout: (fn, ms) => { const id = ++tid; timers.push({ id, at: mono + ms, fn }); return id; },
      clearTimeout: (h) => { const i = timers.findIndex((t) => t.id === h); if (i >= 0) timers.splice(i, 1); },
      setInterval: (fn, ms) => { const id = ++tid; timers.push({ id, at: mono + ms, fn, every: ms }); return id; },
      clearInterval: (h) => { const i = timers.findIndex((t) => t.id === h); if (i >= 0) timers.splice(i, 1); },
      attach: () => { attached++; return () => { detached++; }; },
    },
    consent, session, queue, transport,
  });
  const settle = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
  async function advance(ms: number) {
    const end = mono + ms;
    for (;;) {
      timers.sort((a, b) => a.at - b.at);
      const next = timers[0];
      if (!next || next.at > end) break;
      const d = Math.max(0, next.at - mono);
      wall += d; mono += d;
      if (next.every) next.at += next.every; else timers.shift();
      next.fn();
      await settle();
    }
    wall += end - mono; mono = end;
    await settle();
  }
  const events = () => [...calls, ...beacons].flatMap((c) => c.body.events);
  return { collector, consent, queue, transport, calls, beacons, events, advance, settle, local, sess, timers,
    get attached() { return attached; }, get detached() { return detached; }, tick: (ms: number) => { wall += ms; mono += ms; } };
}
