-- 001_core: sesiones, eventos de navegador, buckets antiabuso y trabajos.
-- Compatible con MySQL 5.7+ y MariaDB 10.3+ (InnoDB, utf8mb4). Sin CHECK, sin tipo JSON, sin columnas generadas.
-- Idempotente (IF NOT EXISTS) y no destructivo. Los identificadores y rutas son ASCII por contrato.
-- Cada sentencia termina con punto y coma al final de línea; no usar punto y coma dentro de textos.

CREATE TABLE IF NOT EXISTS telemetry_sessions (
  session_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  first_received_at DATETIME(3) NOT NULL,
  last_received_at DATETIME(3) NOT NULL,
  landing_path VARCHAR(512) CHARACTER SET ascii COLLATE ascii_bin NULL,
  source VARCHAR(100) CHARACTER SET ascii NULL,
  medium VARCHAR(100) CHARACTER SET ascii NULL,
  campaign VARCHAR(100) CHARACTER SET ascii NULL,
  referrer_host VARCHAR(100) CHARACTER SET ascii NULL,
  attribution_basis VARCHAR(16) CHARACTER SET ascii NULL,
  ai_referred_observed TINYINT(1) NOT NULL DEFAULT 0,
  device_class VARCHAR(12) CHARACTER SET ascii NULL,
  environment VARCHAR(24) CHARACTER SET ascii NOT NULL,
  PRIMARY KEY (session_id),
  KEY idx_sessions_first (first_received_at),
  KEY idx_sessions_source_first (source, first_received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS telemetry_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  session_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  page_view_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  seq INT UNSIGNED NOT NULL,
  name VARCHAR(24) CHARACTER SET ascii NOT NULL,
  occurred_at DATETIME(3) NULL,
  received_at DATETIME(3) NOT NULL,
  effective_at DATETIME(3) NOT NULL,
  clock_status VARCHAR(8) CHARACTER SET ascii NOT NULL,
  page_path VARCHAR(512) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  route_id VARCHAR(48) CHARACTER SET ascii NULL,
  element_id VARCHAR(64) CHARACTER SET ascii NULL,
  product_id VARCHAR(64) CHARACTER SET ascii NULL,
  release_id VARCHAR(64) CHARACTER SET ascii NOT NULL,
  properties TEXT CHARACTER SET ascii NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_event_id (event_id),
  KEY idx_events_received (received_at),
  KEY idx_events_session (session_id, effective_at, seq),
  KEY idx_events_name (name, effective_at),
  KEY idx_events_path (page_path(191), effective_at),
  KEY idx_events_element (element_id, effective_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS telemetry_rate_buckets (
  bucket_key VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  hits INT UNSIGNED NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (bucket_key),
  KEY idx_rate_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS telemetry_job_runs (
  job_name VARCHAR(40) CHARACTER SET ascii NOT NULL,
  last_start DATETIME(3) NULL,
  last_success DATETIME(3) NULL,
  status VARCHAR(16) CHARACTER SET ascii NOT NULL DEFAULT 'never',
  counters_json TEXT CHARACTER SET ascii NULL,
  PRIMARY KEY (job_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
