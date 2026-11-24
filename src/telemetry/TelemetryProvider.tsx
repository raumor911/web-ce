import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ConsentState } from './types';
import { getRuntime } from './runtime';

interface TelemetryContextValue {
  enabled: boolean;
  consent: ConsentState;
  setConsent: (state: 'granted' | 'denied' | 'unknown') => void;
}

const Ctx = createContext<TelemetryContextValue>({ enabled: false, consent: 'unknown', setConsent: () => undefined });

export const useTelemetry = (): TelemetryContextValue => useContext(Ctx);

const ENABLED = import.meta.env.VITE_TELEMETRY_ENABLED === 'true';

const ActiveProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const runtime = useMemo(() => getRuntime(), []);
  const [consent, setConsentState] = useState<ConsentState>(runtime ? runtime.consent.get() : 'unknown');
  useEffect(() => {
    if (!runtime) return undefined;
    setConsentState(runtime.consent.get());
    return runtime.consent.subscribe(setConsentState);
  }, [runtime]);
  const value = useMemo<TelemetryContextValue>(
    () => ({ enabled: !!runtime, consent, setConsent: (s) => runtime?.consent.set(s) }),
    [runtime, consent],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

const Passthrough: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;

/** Con VITE_TELEMETRY_ENABLED distinto de 'true' este componente no hace nada y el recolector no entra al bundle. */
export const TelemetryProvider = ENABLED ? ActiveProvider : Passthrough;
