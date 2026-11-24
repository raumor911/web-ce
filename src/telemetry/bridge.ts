// Puente mínimo entre las páginas y el recolector. Vive en el bundle principal (pocos bytes) y no hace nada
// mientras el recolector no esté activo, de modo que los componentes no dependen de la telemetría.
import type { EventName, Props } from './types.ts';

type Handler = (name: EventName, props: Props, onceKey?: string) => void;

let handler: Handler | null = null;

export const telemetryBridge = {
  setHandler(fn: Handler | null): void { handler = fn; },
  track(name: EventName, props: Props, onceKey?: string): void {
    if (handler) { try { handler(name, props, onceKey); } catch { /* la medición nunca rompe la página */ } }
  },
};
