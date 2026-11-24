// Ensamblaje del recolector con el entorno real del navegador. Solo se importa si la bandera de cliente está encendida.
import { createCollector } from './collector.ts';
import type { Collector } from './collector.ts';
import { createConsent, CONSENT_KEY, EXCLUDE_KEY } from './consent.ts';
import type { Consent } from './consent.ts';
import { attachDom } from './dom.ts';
import { createQueue } from './queue.ts';
import { deviceClass } from './sanitize.ts';
import { browserRandom, createSession } from './session.ts';
import { createTransport } from './transport.ts';
import { telemetryBridge } from './bridge.ts';
import type { ConsentState, StorageLike } from './types.ts';

export interface Runtime {
  collector: Collector;
  consent: Consent;
  observePath(pathname: string): void;
}

declare global {
  interface Window {
    __CE_TELEMETRY_DISABLED__?: boolean;
    ceTelemetry?: { getConsent(): ConsentState; setConsent(state: 'granted' | 'denied' | 'unknown'): void };
  }
}

const safeStorage = (kind: 'localStorage' | 'sessionStorage'): StorageLike | null => {
  try { const s = window[kind]; s.getItem(CONSENT_KEY); return s; } catch { return null; }
};

let runtime: Runtime | null = null;

export function getRuntime(): Runtime | null {
  if (runtime) return runtime;
  if (typeof window === 'undefined') return null;
  const endpoint = import.meta.env.VITE_TELEMETRY_ENDPOINT || '/telemetria/collect.php';
  const local = safeStorage('localStorage');
  const consent = createConsent(local);
  const now = () => Date.now();
  const random = browserRandom;
  const session = createSession({ storage: safeStorage('sessionStorage'), now, random });
  const queue = createQueue();
  const transport = createTransport({
    endpoint,
    fetchImpl: (url, init) => window.fetch(url, init as RequestInit),
    beaconImpl: typeof navigator.sendBeacon === 'function' ? (u, d) => navigator.sendBeacon(u, d as BodyInit) : null,
    makeBlob: (body) => new Blob([body], { type: 'text/plain;charset=UTF-8' }),
    sleep: (ms) => new Promise((r) => window.setTimeout(r, ms)),
    random: Math.random,
    now,
  });
  const collector = createCollector({
    env: {
      now, mono: () => window.performance.now(), random,
      releaseId: String(import.meta.env.VITE_TELEMETRY_RELEASE_ID || 'dev').replace(/[^A-Za-z0-9._-]/g, '').slice(0, 64) || 'dev',
      ownHost: window.location.hostname,
      referrer: document.referrer,
      landing: { path: window.location.pathname, search: window.location.search },
      device: deviceClass(navigator.userAgent, navigator.maxTouchPoints, navigator.platform),
      // Exclusiones explícitas: desarrollo, prerender y automatización propia (bandera o llave local), no solo webdriver.
      excluded: () => import.meta.env.DEV === true || window.__CE_TELEMETRY_DISABLED__ === true || local?.getItem(EXCLUDE_KEY) === '1',
      setTimeout: (fn, ms) => window.setTimeout(fn, ms), clearTimeout: (h) => window.clearTimeout(h as number),
      setInterval: (fn, ms) => window.setInterval(fn, ms), clearInterval: (h) => window.clearInterval(h as number),
      attach: (c) => attachDom(c, window, document),
    },
    consent, session, queue, transport,
  });
  telemetryBridge.setHandler((name, props, once) => collector.track(name, props, once));
  let first = true;
  runtime = {
    collector, consent,
    observePath(pathname) {
      collector.setPath(pathname, { documentLoad: first });
      first = false;
    },
  };
  // API mínima para la interfaz de preferencias aprobada (no hay banner todavía: ver docs/telemetry/operations.md).
  window.ceTelemetry = { getConsent: () => consent.get(), setConsent: (s) => consent.set(s) };
  return runtime;
}
