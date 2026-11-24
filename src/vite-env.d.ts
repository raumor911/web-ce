/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'true' enciende el recolector de telemetría en el cliente. Cualquier otro valor lo deja apagado (valor por defecto). */
  readonly VITE_TELEMETRY_ENABLED?: string;
  /** Ruta del endpoint de ingesta. Por defecto /telemetria/collect.php */
  readonly VITE_TELEMETRY_ENDPOINT?: string;
  /** Identificador de la compilación (p. ej. SHA corto de Git). Nunca un secreto. */
  readonly VITE_TELEMETRY_RELEASE_ID?: string;
}
