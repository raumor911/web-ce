-- 003_aggregates: agregados diarios (fecha local America/Mexico_City), marcas de agua y fechas por reconstruir.
-- Los agregados se REEMPLAZAN al recalcular (UPSERT determinista); nunca se suman de nuevo.

CREATE TABLE IF NOT EXISTS daily_web_metrics (
  local_date DATE NOT NULL,
  dimension_set VARCHAR(24) CHARACTER SET ascii NOT NULL,
  dimension_key VARCHAR(128) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  sessions INT UNSIGNED NOT NULL DEFAULT 0,
  page_views INT UNSIGNED NOT NULL DEFAULT 0,
  contact_sessions INT UNSIGNED NOT NULL DEFAULT 0,
  contacts INT UNSIGNED NOT NULL DEFAULT 0,
  active_ms BIGINT UNSIGNED NOT NULL DEFAULT 0,
  computed_at DATETIME(3) NOT NULL,
  UNIQUE KEY uk_daily_web (local_date, dimension_set, dimension_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS daily_crawler_metrics (
  local_date DATE NOT NULL,
  source_id VARCHAR(40) CHARACTER SET ascii NOT NULL,
  bot_family VARCHAR(40) CHARACTER SET ascii NOT NULL,
  verification_status VARCHAR(24) CHARACTER SET ascii NOT NULL,
  resource_type VARCHAR(16) CHARACTER SET ascii NOT NULL,
  requests INT UNSIGNED NOT NULL DEFAULT 0,
  responses_2xx INT UNSIGNED NOT NULL DEFAULT 0,
  responses_304 INT UNSIGNED NOT NULL DEFAULT 0,
  responses_3xx INT UNSIGNED NOT NULL DEFAULT 0,
  responses_4xx INT UNSIGNED NOT NULL DEFAULT 0,
  responses_5xx INT UNSIGNED NOT NULL DEFAULT 0,
  computed_at DATETIME(3) NOT NULL,
  UNIQUE KEY uk_daily_crawler (local_date, source_id, bot_family, verification_status, resource_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS aggregate_dirty (
  scope VARCHAR(8) CHARACTER SET ascii NOT NULL,
  source_id VARCHAR(40) CHARACTER SET ascii NOT NULL,
  local_date DATE NOT NULL,
  marked_at DATETIME(3) NOT NULL,
  PRIMARY KEY (scope, source_id, local_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS aggregate_watermarks (
  scope VARCHAR(8) CHARACTER SET ascii NOT NULL,
  source_id VARCHAR(40) CHARACTER SET ascii NOT NULL,
  local_date DATE NOT NULL,
  confirmed_at DATETIME(3) NOT NULL,
  PRIMARY KEY (scope, source_id, local_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
