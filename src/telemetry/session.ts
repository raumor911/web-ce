// Sesión de pestaña: identificador aleatorio de 128 bits en sessionStorage (o memoria).
// No es una persona ni un visitante único: otras pestañas y visitas posteriores crean sesiones distintas.
import { LIMITS } from './event-schema.ts';
import type { Clock, StorageLike } from './types.ts';

export const SESSION_KEY = 'ce_telemetry_session_v1';

export type RandomBytes = (n: number) => Uint8Array;

export const browserRandom: RandomBytes = (n) => {
  const out = new Uint8Array(n);
  globalThis.crypto.getRandomValues(out);
  return out;
};

const hex = (b: Uint8Array): string => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');

/** 128 bits aleatorios con forma de UUID (no fija bits de versión: conserva los 128 bits de entropía). */
export function randomId128(random: RandomBytes): string {
  const h = hex(random(16));
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** UUID v4 (event_id). */
export function uuidV4(random: RandomBytes): string {
  const b = random(16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = hex(b);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

interface Stored { id: string; last: number; seq: number }

export interface SessionManager {
  /** Devuelve la sesión vigente; crea o renueva si pasaron 30 min sin actividad. Registra la actividad. */
  touch(): { sessionId: string; isNew: boolean };
  nextSequence(): number;
  /** Borra el identificador (revocación). */
  clear(): void;
  readonly persistent: boolean;
}

export function createSession(opts: { storage: StorageLike | null; now: Clock; random: RandomBytes }): SessionManager {
  const { storage, now, random } = opts;
  let persistent = !!storage;
  let mem: Stored | null = null;
  const load = (): Stored | null => {
    if (persistent) {
      try {
        const raw = storage!.getItem(SESSION_KEY);
        if (!raw) return mem;
        const d = JSON.parse(raw);
        if (d && typeof d.id === 'string' && Number.isFinite(d.last) && Number.isInteger(d.seq)) return d as Stored;
      } catch { persistent = false; }
    }
    return mem;
  };
  const save = (s: Stored) => {
    mem = s;
    if (persistent) {
      try { storage!.setItem(SESSION_KEY, JSON.stringify(s)); } catch { persistent = false; }
    }
  };
  return {
    touch() {
      const t = now();
      let cur = load();
      let isNew = false;
      if (!cur || t - cur.last > LIMITS.session_idle_ms || t < cur.last - LIMITS.session_idle_ms) {
        cur = { id: randomId128(random), last: t, seq: 0 };
        isNew = true;
      } else {
        cur = { ...cur, last: t };
      }
      save(cur);
      return { sessionId: cur.id, isNew };
    },
    nextSequence() {
      const cur = load();
      if (!cur) return 0;
      const next = Math.min(cur.seq + 1, LIMITS.max_sequence);
      save({ ...cur, seq: next });
      return next;
    },
    clear() {
      mem = null;
      try { storage?.removeItem(SESSION_KEY); } catch { /* sin acción */ }
    },
    get persistent() { return persistent; },
  };
}
