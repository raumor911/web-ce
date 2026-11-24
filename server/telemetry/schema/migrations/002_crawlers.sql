-- 002_crawlers: fuentes de logs, ejecuciones de importación, solicitudes HTTP de bots y snapshots de rangos oficiales.
-- Las solicitudes HTTP y los eventos de navegador son conjuntos distintos: no comparten tablas ni se suman.

CREATE TABLE IF NOT EXISTS import_sources (
  source_id VARCHAR(40) CHARACTER SET ascii NOT NULL,
  source_type VARCHAR(16) CHARACTER SET ascii NOT NULL,
  host VARCHAR(100) CHARACTER SET ascii NOT NULL,
  layer VARCHAR(8) CHARACTER SET ascii NOT NULL,
  coverage_scope VARCHAR(40) CHARACTER SET ascii NOT NULL DEFAULT 'origin_only',
  available_from DATETIME(3) NULL,
  last_success_at DATETIME(3) NULL,
  last_request_at DATETIME(3) NULL,
  cursor_json TEXT CHARACTER SET ascii NULL,
  status VARCHAR(16) CHARACTER SET ascii NOT NULL DEFAULT 'new',
  PRIMARY KEY (source_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS import_runs (
  run_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_id VARCHAR(40) CHARACTER SET ascii NOT NULL,
  started_at DATETIME(3) NOT NULL,
  finished_at DATETIME(3) NULL,
  records_read INT UNSIGNED NOT NULL DEFAULT 0,
  records_inserted INT UNSIGNED NOT NULL DEFAULT 0,
  records_duplicate INT UNSIGNED NOT NULL DEFAULT 0,
  records_rejected INT UNSIGNED NOT NULL DEFAULT 0,
  records_discarded INT UNSIGNED NOT NULL DEFAULT 0,
  gaps INT UNSIGNED NOT NULL DEFAULT 0,
  last_error_code VARCHAR(40) CHARACTER SET ascii NULL,
  PRIMARY KEY (run_id),
  KEY idx_runs_source_started (source_id, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bot_range_snapshots (
  snapshot_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider VARCHAR(24) CHARACTER SET ascii NOT NULL,
  bot_family VARCHAR(40) CHARACTER SET ascii NOT NULL,
  fetched_at DATETIME(3) NOT NULL,
  valid_until DATETIME(3) NOT NULL,
  source_url VARCHAR(200) CHARACTER SET ascii NOT NULL,
  content_hash CHAR(64) CHARACTER SET ascii NOT NULL,
  ranges_json MEDIUMTEXT CHARACTER SET ascii NOT NULL,
  PRIMARY KEY (snapshot_id),
  KEY idx_snap_family (provider, bot_family, fetched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS crawler_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_id VARCHAR(40) CHARACTER SET ascii NOT NULL,
  source_record_key BINARY(32) NOT NULL,
  requested_at DATETIME(3) NOT NULL,
  imported_at DATETIME(3) NOT NULL,
  host VARCHAR(100) CHARACTER SET ascii NULL,
  method VARCHAR(8) CHARACTER SET ascii NOT NULL,
  path VARCHAR(512) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  resource_type VARCHAR(16) CHARACTER SET ascii NOT NULL,
  status SMALLINT UNSIGNED NOT NULL,
  bytes BIGINT UNSIGNED NULL,
  duration_ms INT UNSIGNED NULL,
  declared_bot VARCHAR(40) CHARACTER SET ascii NULL,
  provider VARCHAR(24) CHARACTER SET ascii NULL,
  purpose VARCHAR(16) CHARACTER SET ascii NOT NULL DEFAULT 'unknown',
  verification_status VARCHAR(24) CHARACTER SET ascii NOT NULL DEFAULT 'unknown',
  verification_method VARCHAR(32) CHARACTER SET ascii NULL,
  range_snapshot_id BIGINT UNSIGNED NULL,
  rules_version VARCHAR(16) CHARACTER SET ascii NOT NULL,
  coverage_layer VARCHAR(8) CHARACTER SET ascii NOT NULL,
  ua_family VARCHAR(40) CHARACTER SET ascii NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_crawler_source_key (source_id, source_record_key),
  KEY idx_crawler_requested (requested_at),
  KEY idx_crawler_bot (declared_bot, requested_at),
  KEY idx_crawler_path (path(191), requested_at),
  KEY idx_crawler_status (status, requested_at),
  KEY idx_crawler_snapshot (range_snapshot_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
