import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LIMITS } from './event-schema';
import { getRuntime } from './runtime';

const ENABLED = import.meta.env.VITE_TELEMETRY_ENABLED === 'true';

/**
 * Observa el pathname asentado (independiente de ScrollToTop). Espera route_settle_ms para no registrar como vista
 * final una redirección transitoria de React Router; la limpieza del efecto evita duplicados en StrictMode.
 */
const ActiveRouteObserver = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const runtime = getRuntime();
    if (!runtime) return undefined;
    const timer = window.setTimeout(() => runtime.observePath(pathname), LIMITS.route_settle_ms);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
};

export const RouteObserver = ENABLED ? ActiveRouteObserver : () => null;
