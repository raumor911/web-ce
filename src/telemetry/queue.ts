// Cola en memoria con tope de eventos y bytes. Descarta primero engagement y scroll. Nunca bloquea la UI.
import { LIMITS, utf8Length } from './event-schema.ts';
import type { TelemetryEvent } from './types.ts';

const LOW_PRIORITY = new Set(['engagement', 'scroll_depth']);

interface Item { ev: TelemetryEvent; bytes: number; queuedAt: number }

export interface Queue {
  push(ev: TelemetryEvent, now: number): boolean;
  /** Extrae hasta maxEvents y maxBytes de cuerpo (el cuerpo real incluye el sobre). */
  take(maxEvents: number, maxBytes: number): Item[];
  requeue(items: Item[]): void;
  clear(): void;
  readonly size: number;
  readonly bytes: number;
  readonly dropped: number;
}

export function createQueue(): Queue {
  let items: Item[] = [];
  let bytes = 0;
  let dropped = 0;
  const remove = (i: number) => { bytes -= items[i].bytes; items.splice(i, 1); dropped++; };
  const makeRoom = (needed: number, incomingLow: boolean): boolean => {
    while (items.length + 1 > LIMITS.queue_max_events || bytes + needed > LIMITS.queue_max_bytes) {
      const low = items.findIndex((x) => LOW_PRIORITY.has(x.ev.name));
      if (low >= 0) { remove(low); continue; }
      if (incomingLow) return false;
      if (items.length === 0) return false;
      remove(0);
    }
    return true;
  };
  return {
    push(ev, now) {
      const b = utf8Length(JSON.stringify(ev));
      if (b > LIMITS.queue_max_bytes) { dropped++; return false; }
      if (!makeRoom(b, LOW_PRIORITY.has(ev.name))) { dropped++; return false; }
      items.push({ ev, bytes: b, queuedAt: now });
      bytes += b;
      return true;
    },
    take(maxEvents, maxBytes) {
      const out: Item[] = [];
      let used = 64; // sobre {"schema_version":1,"events":[]}
      while (items.length && out.length < maxEvents) {
        const next = items[0];
        if (used + next.bytes + 1 > maxBytes && out.length > 0) break;
        items.shift(); bytes -= next.bytes; used += next.bytes + 1; out.push(next);
      }
      return out;
    },
    requeue(back) {
      const keep = back.filter((x) => !items.some((y) => y.ev.event_id === x.ev.event_id));
      items = [...keep, ...items];
      bytes = items.reduce((a, x) => a + x.bytes, 0);
      while (items.length > LIMITS.queue_max_events || bytes > LIMITS.queue_max_bytes) { remove(0); }
    },
    clear() { items = []; bytes = 0; },
    get size() { return items.length; },
    get bytes() { return bytes; },
    get dropped() { return dropped; },
  };
}
