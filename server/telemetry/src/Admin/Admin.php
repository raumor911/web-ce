<?php
namespace Ce\Telemetry\Admin;

use Ce\Telemetry\Config;
use Ce\Telemetry\Db;
use Ce\Telemetry\Health;

/**
 * Tablero privado de solo lectura (rol de BD «query»). Un solo punto de entrada público (public/telemetria-admin/index.php)
 * que delega aquí. Sin PII: solo agregados. Nunca indexable, nunca en caché.
 *   ?a=page (por defecto) HTML · ?a=data JSON · ?a=csv&set=web|crawler CSV
 */
class Admin
{
    private $config;
    private $server;
    private $get;

    public function __construct(Config $config, array $server, array $get)
    {
        $this->config = $config;
        $this->server = $server;
        $this->get = $get;
    }

    public static function headers($type, $nonce = null)
    {
        header('Content-Type: ' . $type);
        header('Cache-Control: no-store');
        header('X-Robots-Tag: noindex, nofollow, noarchive');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Referrer-Policy: no-referrer');
        header("Content-Security-Policy: default-src 'none'; style-src 'nonce-" . $nonce . "'; script-src 'nonce-" . $nonce . "'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
    }

    /** Autenticación. 'server' = cPanel Directory Privacy (REMOTE_USER obligatorio). Cualquier otro valor = cerrado. */
    public function authorized()
    {
        $mode = $this->config->get('admin.auth', 'server');
        if ($mode !== 'server') {
            return false; // el modo 'app' no está implementado en v1: queda cerrado por defecto
        }
        $user = isset($this->server['REMOTE_USER']) ? $this->server['REMOTE_USER'] : (isset($this->server['REDIRECT_REMOTE_USER']) ? $this->server['REDIRECT_REMOTE_USER'] : '');
        return is_string($user) && $user !== '';
    }

    public function handle()
    {
        $nonce = base64_encode(random_bytes(12));
        if (!$this->authorized()) {
            http_response_code(403);
            self::headers('text/plain; charset=utf-8', $nonce);
            echo "Acceso no autorizado.\n";
            return;
        }
        $action = isset($this->get['a']) && is_string($this->get['a']) ? $this->get['a'] : 'page';
        if ($action === 'page') {
            self::headers('text/html; charset=utf-8', $nonce);
            echo $this->page($nonce);
            return;
        }
        try {
            $pdo = Db::connect($this->config, 'query');
        } catch (\Throwable $e) {
            http_response_code(503);
            self::headers('application/json; charset=utf-8', $nonce);
            echo '{"error":"db_unavailable"}';
            return;
        }
        $days = isset($this->get['days']) ? (int) $this->get['days'] : 7;
        $days = max(1, min(90, $days));
        if ($action === 'data') {
            self::headers('application/json; charset=utf-8', $nonce);
            echo json_encode($this->data($pdo, $days));
            return;
        }
        if ($action === 'csv') {
            $set = isset($this->get['set']) && $this->get['set'] === 'crawler' ? 'crawler' : 'web';
            header('Content-Disposition: attachment; filename="telemetria-' . $set . '-' . gmdate('Ymd') . '.csv"');
            self::headers('text/csv; charset=utf-8', $nonce);
            echo $this->csv($pdo, $set, $days);
            return;
        }
        http_response_code(404);
        self::headers('application/json; charset=utf-8', $nonce);
        echo '{"error":"not_found"}';
    }

    private function since($days)
    {
        $d = new \DateTime('now', new \DateTimeZone('America/Mexico_City'));
        $d->modify('-' . ($days - 1) . ' days');
        return $d->format('Y-m-d');
    }

    public function data(\PDO $pdo, $days)
    {
        $since = $this->since($days);
        $st = $pdo->prepare('SELECT dimension_set AS d, dimension_key AS k, SUM(sessions) AS sessions, SUM(page_views) AS page_views, SUM(contact_sessions) AS contact_sessions, SUM(contacts) AS contacts, SUM(active_ms) AS active_ms FROM daily_web_metrics WHERE local_date >= ? GROUP BY dimension_set, dimension_key ORDER BY dimension_set, page_views DESC, contacts DESC');
        $st->execute([$since]);
        $web = ['total' => null, 'route' => [], 'source' => [], 'element' => []];
        foreach ($st->fetchAll() as $r) {
            $row = ['key' => $r['k'], 'sessions' => (int) $r['sessions'], 'page_views' => (int) $r['page_views'], 'contact_sessions' => (int) $r['contact_sessions'], 'contacts' => (int) $r['contacts'], 'active_ms' => (int) $r['active_ms']];
            if ($r['d'] === 'total') {
                $web['total'] = $row;
            } elseif (isset($web[$r['d']])) {
                $web[$r['d']][] = $row;
            }
        }
        $st = $pdo->prepare('SELECT bot_family, verification_status, resource_type, SUM(requests) AS requests, SUM(responses_2xx) AS r2, SUM(responses_304) AS r304, SUM(responses_3xx) AS r3, SUM(responses_4xx) AS r4, SUM(responses_5xx) AS r5 FROM daily_crawler_metrics WHERE local_date >= ? GROUP BY bot_family, verification_status, resource_type ORDER BY requests DESC LIMIT 200');
        $st->execute([$since]);
        $crawlers = [];
        foreach ($st->fetchAll() as $r) {
            $crawlers[] = ['bot' => $r['bot_family'], 'verification' => $r['verification_status'], 'resource' => $r['resource_type'], 'requests' => (int) $r['requests'], '2xx' => (int) $r['r2'], '304' => (int) $r['r304'], '3xx' => (int) $r['r3'], '4xx' => (int) $r['r4'], '5xx' => (int) $r['r5']];
        }
        $cov = [];
        foreach ($pdo->query('SELECT source_id, layer, coverage_scope, available_from, last_request_at, last_success_at, status FROM import_sources')->fetchAll() as $r) {
            $cov[] = $r;
        }
        $health = (new Health($pdo, $this->config))->checks();
        return ['days' => $days, 'since_local' => $since, 'web' => $web, 'crawlers' => $crawlers, 'coverage' => $cov, 'health' => $health, 'generated_at' => gmdate('c')];
    }

    /** Neutraliza fórmulas de hojas de cálculo (=, +, -, @, tab, CR al inicio). */
    public static function csvCell($v)
    {
        $s = (string) $v;
        if ($s !== '' && strpos("=+-@\t\r", $s[0]) !== false) {
            $s = "'" . $s;
        }
        return '"' . str_replace('"', '""', $s) . '"';
    }

    public function csv(\PDO $pdo, $set, $days)
    {
        $since = $this->since($days);
        if ($set === 'crawler') {
            $st = $pdo->prepare('SELECT local_date, source_id, bot_family, verification_status, resource_type, requests, responses_2xx, responses_304, responses_3xx, responses_4xx, responses_5xx FROM daily_crawler_metrics WHERE local_date >= ? ORDER BY local_date, bot_family');
        } else {
            $st = $pdo->prepare('SELECT local_date, dimension_set, dimension_key, sessions, page_views, contact_sessions, contacts, active_ms FROM daily_web_metrics WHERE local_date >= ? ORDER BY local_date, dimension_set, dimension_key');
        }
        $st->execute([$since]);
        $rows = $st->fetchAll();
        $out = '';
        if ($rows) {
            $out .= implode(',', array_map([__CLASS__, 'csvCell'], array_keys($rows[0]))) . "\n";
            foreach ($rows as $r) {
                $out .= implode(',', array_map([__CLASS__, 'csvCell'], array_values($r))) . "\n";
            }
        }
        return $out;
    }

    private function page($nonce)
    {
        $js = <<<'JS'
const $ = (s) => document.querySelector(s);
const el = (t, txt, cls) => { const e = document.createElement(t); if (txt !== undefined) e.textContent = String(txt); if (cls) e.className = cls; return e; };
function table(target, head, rows) {
  const t = $(target); t.replaceChildren();
  const h = el('tr'); head.forEach((x) => h.append(el('th', x))); t.append(h);
  rows.forEach((r) => { const tr = el('tr'); r.forEach((c) => tr.append(el('td', c))); t.append(tr); });
  if (!rows.length) { const tr = el('tr'); const td = el('td', 'Sin datos en el periodo (no es lo mismo que cero: puede faltar captura o importación)'); td.colSpan = head.length; tr.append(td); t.append(tr); }
}
async function load() {
  const days = $('#days').value;
  $('#status').textContent = 'Cargando…';
  try {
    const r = await fetch('?a=data&days=' + encodeURIComponent(days), { credentials: 'same-origin', cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    $('#status').textContent = 'Desde ' + d.since_local + ' (fecha local CDMX). Generado ' + d.generated_at;
    const t = d.web.total || { sessions: 0, page_views: 0, contact_sessions: 0, contacts: 0, active_ms: 0 };
    table('#total', ['Sesiones-día', 'Vistas', 'Sesiones con contacto', 'Contactos', 'Tiempo activo (s)'], [[t.sessions, t.page_views, t.contact_sessions, t.contacts, Math.round(t.active_ms / 1000)]]);
    table('#routes', ['Ruta', 'Vistas'], d.web.route.map((x) => [x.key, x.page_views]));
    table('#sources', ['Fuente', 'Sesiones-día'], d.web.source.map((x) => [x.key, x.sessions]));
    table('#elements', ['Elemento', 'Contactos', 'Sesiones con contacto'], d.web.element.map((x) => [x.key, x.contacts, x.contact_sessions]));
    table('#crawlers', ['Bot declarado', 'Verificación', 'Recurso (inferido)', 'Solicitudes', '2xx', '304', '3xx', '4xx', '5xx'], d.crawlers.map((x) => [x.bot, x.verification, x.resource, x.requests, x['2xx'], x['304'], x['3xx'], x['4xx'], x['5xx']]));
    table('#coverage', ['Fuente', 'Capa', 'Alcance', 'Disponible desde', 'Última solicitud', 'Último éxito', 'Estado'], d.coverage.map((x) => [x.source_id, x.layer, x.coverage_scope, x.available_from || 'unknown', x.last_request_at || 'unknown', x.last_success_at || 'unknown', x.status]));
    table('#health', ['Comprobación', 'Estado', 'Detalle'], d.health.map((x) => [x.name, x.status, x.detail]));
    $('#csvw').href = '?a=csv&set=web&days=' + encodeURIComponent(days);
    $('#csvc').href = '?a=csv&set=crawler&days=' + encodeURIComponent(days);
  } catch (e) { $('#status').textContent = 'No se pudo cargar (' + e.message + ')'; }
}
$('#days').addEventListener('change', load);
load();
JS;
        return '<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Telemetría — Creativos Espacios</title>'
            . '<style nonce="' . $nonce . '">body{font:14px/1.45 system-ui,sans-serif;margin:1.5rem;color:#111}table{border-collapse:collapse;margin:.5rem 0 1.5rem;min-width:50%}th,td{border:1px solid #ccc;padding:.3rem .6rem;text-align:left}th{background:#f3f3f3}h2{margin-top:1.5rem;font-size:1.05rem}.note{color:#444;max-width:70ch}</style></head><body>'
            . '<h1>Telemetría de Creativos Espacios</h1>'
            . '<p class="note">Solo agregados, sin datos personales. «Sesiones-día» cuenta una sesión una vez por cada día local en que aparece. El estado «mismatch» de un bot significa que la IP no coincide con los rangos oficiales vigentes: no prueba que sea falso. «Finalidad» y «tipo de recurso» son inferencias por la documentación del proveedor y por la ruta. La visita a una página de IA (ai_referred_observed) no es atribución causal. Las solicitudes de bots (logs de origen) y los eventos del navegador son conjuntos distintos y no se suman.</p>'
            . '<label>Periodo <select id="days"><option value="1">1 día</option><option value="7" selected>7 días</option><option value="30">30 días</option><option value="90">90 días</option></select></label> <span id="status"></span>'
            . '<h2>Total web</h2><table id="total"></table><h2>Rutas</h2><table id="routes"></table><h2>Fuentes</h2><table id="sources"></table><h2>Contactos por elemento</h2><table id="elements"></table>'
            . '<h2>Solicitudes de bots (origen)</h2><table id="crawlers"></table><h2>Cobertura de importación</h2><table id="coverage"></table><h2>Salud</h2><table id="health"></table>'
            . '<p><a id="csvw" href="#">CSV web</a> · <a id="csvc" href="#">CSV bots</a></p>'
            . '<script nonce="' . $nonce . '">' . $js . '</script></body></html>';
    }
}
