// Preferencia de medición. Base conservadora: unknown y denied no crean identificadores ni red.
import type { ConsentState, StorageLike } from './types.ts';

export const CONSENT_KEY = 'ce_telemetry_consent_v1';
export const EXCLUDE_KEY = 'ce_telemetry_exclude';

export interface Consent {
  get(): ConsentState;
  set(state: ConsentState): void;
  subscribe(fn: (state: ConsentState) => void): () => void;
}

export function createConsent(storage: StorageLike | null): Consent {
  const listeners = new Set<(s: ConsentState) => void>();
  const read = (): ConsentState => {
    try {
      const raw = storage?.getItem(CONSENT_KEY);
      if (!raw) return 'unknown';
      const doc = JSON.parse(raw);
      return doc && doc.v === 1 && (doc.state === 'granted' || doc.state === 'denied') ? doc.state : 'unknown';
    } catch { return 'unknown'; }
  };
  let state: ConsentState = read();
  return {
    get: () => state,
    set(next) {
      if (next !== 'granted' && next !== 'denied' && next !== 'unknown') return;
      if (next === state) return;
      state = next;
      try {
        if (next === 'unknown') storage?.removeItem(CONSENT_KEY);
        else storage?.setItem(CONSENT_KEY, JSON.stringify({ v: 1, state: next }));
      } catch { /* almacenamiento bloqueado: la preferencia vale solo en memoria */ }
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) { listeners.add(fn); return () => { listeners.delete(fn); }; },
  };
}
