<?php
namespace Ce\Telemetry;

/**
 * Validación estricta del contrato de ingesta. Gemelo de src/telemetry/event-schema.ts: ambos leen contract.json y
 * elements.json y se prueban con server/telemetry/tests/fixtures/validation-cases.json. Un cambio aquí exige el cambio
 * en TypeScript. Resultados: ['ok' => bool, 'error' => string, 'value' => mixed].
 */
class Contract
{
    private $c;
    private $elements;
    private $limits;

    public function __construct($contractJson, $elementsJson)
    {
        $this->c = json_decode($contractJson, true);
        $this->elements = json_decode($elementsJson, true);
        if (!is_array($this->c) || !is_array($this->elements)) {
            throw new \RuntimeException('contrato ilegible');
        }
        $this->limits = $this->c['limits'];
    }

    public static function fromDir($dir)
    {
        return new self(file_get_contents($dir . '/contract.json'), file_get_contents($dir . '/elements.json'));
    }

    public function limit($name)
    {
        return $this->limits[$name];
    }

    public function elements()
    {
        return $this->elements;
    }

    private function fail($error)
    {
        return ['ok' => false, 'error' => $error, 'value' => null];
    }

    private function matches($name, $value)
    {
        return is_string($value) && preg_match('~' . $this->c['patterns'][$name] . '~D', $value) === 1;
    }

    private static function isInt($v)
    {
        if (is_int($v)) {
            return true;
        }
        return is_float($v) && is_finite($v) && floor($v) == $v && abs($v) <= 9007199254740991;
    }

    // ---------- rutas ----------

    public function canonicalPath($path)
    {
        $clean = trim(trim((string) $path), '/');
        if ($clean === '') {
            return '/';
        }
        $parts = explode('/', $clean);
        $last = end($parts);
        return preg_match('/\.[A-Za-z0-9]+$/', $last) === 1 ? '/' . $clean : '/' . $clean . '/';
    }

    public function isExcludedPath($path)
    {
        $lower = strtolower($path);
        foreach ($this->c['excluded_path_prefixes'] as $x) {
            if (strpos($lower, $x) === 0 || $lower === rtrim($x, '/') . '/') {
                return true;
            }
        }
        return false;
    }

    /** Devuelve el pathname normalizado o null si no es admisible. */
    public function normalizePath($raw)
    {
        $max = $this->limits['max_path_length'];
        if (!is_string($raw) || $raw === '' || strlen($raw) > $max + 64) {
            return null;
        }
        $p = $raw;
        $cut = strcspn($p, '?#');
        if ($cut < strlen($p)) {
            $p = substr($p, 0, $cut);
        }
        if ($p === '' || $p[0] !== '/' || preg_match('/[\x00-\x1f\x7f]/', $p) === 1) {
            return null;
        }
        if (preg_match('~^[A-Za-z0-9._~%/-]+$~D', $p) !== 1 || strpos($p, '//') !== false) {
            return null;
        }
        if (preg_match('/%(?![0-9A-Fa-f]{2})/', $p) === 1) {
            return null;
        }
        $bad = false;
        $p = preg_replace_callback('/%([0-9A-Fa-f]{2})/', function ($m) use (&$bad) {
            $n = hexdec($m[1]);
            if ($n < 0x20 || $n === 0x7f || $n === 0x2f || $n === 0x5c || $n === 0x25) {
                $bad = true;
            }
            return '%' . strtoupper($m[1]);
        }, $p);
        if ($bad) {
            return null;
        }
        foreach (explode('/', $p) as $seg) {
            if ($seg === '.' || $seg === '..') {
                return null;
            }
        }
        $p = $this->canonicalPath($p);
        if (strlen($p) > $max || $this->isExcludedPath($p)) {
            return null;
        }
        return $p;
    }

    public function routeIdFor($path)
    {
        if (isset($this->c['routes'][$path])) {
            return $this->c['routes'][$path];
        }
        foreach ($this->c['route_prefixes'] as $prefix => $id) {
            if (strpos($path, $prefix) === 0 && strlen($path) > strlen($prefix)) {
                return $id;
            }
        }
        return null;
    }

    // ---------- propiedades ----------

    private function digitRunTooLong($s)
    {
        if (preg_match_all('/[0-9]+/', $s, $m) === 0) {
            return false;
        }
        foreach ($m[0] as $run) {
            if (strlen($run) > $this->limits['utm_max_digit_run']) {
                return true;
            }
        }
        return false;
    }

    /** @return string|null código de error o null si la propiedad es válida */
    private function checkProp($kind, $value)
    {
        if (strpos($kind, 'enum:') === 0) {
            $list = isset($this->c['enums'][substr($kind, 5)]) ? $this->c['enums'][substr($kind, 5)] : [];
            foreach ($list as $item) {
                // Comparación estricta de tipo: "50" no equivale a 50.
                if ($item === $value || (self::isInt($value) && is_int($item) && $item === (int) $value)) {
                    return null;
                }
            }
            return 'enum';
        }
        switch ($kind) {
            case 'id':
                return $this->matches('id', $value) ? null : 'id';
            case 'element':
                return is_string($value) && isset($this->elements[$value]) ? null : 'element';
            case 'path':
                return is_string($value) && $this->normalizePath($value) === $value ? null : 'path';
            case 'host':
                return is_string($value) && strlen($value) <= $this->limits['max_host_length'] && $this->matches('host', $value) ? null : 'host';
            case 'utm':
                return $this->matches('utm', $value) && !$this->digitRunTooLong($value) && strpos($value, '@') === false ? null : 'utm';
            case 'count':
                return self::isInt($value) && $value >= 0 && $value <= $this->limits['max_result_count'] ? null : 'count';
            case 'active_ms':
                return self::isInt($value) && $value >= 1 && $value <= $this->limits['engagement_max_ms'] ? null : 'active_ms';
        }
        return 'kind';
    }

    // ---------- evento y lote ----------

    /** @param mixed $ev objeto decodificado con json_decode(..., false) */
    public function validateEvent($ev)
    {
        if (!($ev instanceof \stdClass)) {
            return $this->fail('event_not_object');
        }
        $top = ['event_id', 'session_id', 'page_view_id', 'sequence', 'name', 'occurred_at', 'page_path', 'route_id', 'release_id', 'properties'];
        $vars = get_object_vars($ev);
        foreach (array_keys($vars) as $k) {
            if (!in_array((string) $k, $top, true)) {
                return $this->fail('unknown_field:' . $k);
            }
        }
        foreach (['event_id', 'session_id', 'page_view_id'] as $k) {
            if (!isset($vars[$k]) || !$this->matches('uuid', $vars[$k])) {
                return $this->fail('bad_' . $k);
            }
        }
        $seq = isset($vars['sequence']) ? $vars['sequence'] : null;
        if (!self::isInt($seq) || $seq < 0 || $seq > $this->limits['max_sequence']) {
            return $this->fail('bad_sequence');
        }
        $name = isset($vars['name']) ? $vars['name'] : null;
        if (!is_string($name) || !isset($this->c['events'][$name])) {
            return $this->fail('bad_name');
        }
        $spec = $this->c['events'][$name];
        $ts = isset($vars['occurred_at']) ? $vars['occurred_at'] : null;
        if (!$this->matches('timestamp', $ts) || $this->parseTimestamp($ts) === null) {
            return $this->fail('bad_occurred_at');
        }
        $path = $this->normalizePath(isset($vars['page_path']) ? $vars['page_path'] : null);
        if ($path === null || $path !== $vars['page_path']) {
            return $this->fail('bad_page_path');
        }
        if (!isset($vars['release_id']) || !$this->matches('release', $vars['release_id'])) {
            return $this->fail('bad_release_id');
        }
        if (array_key_exists('route_id', $vars) && !$this->matches('id', $vars['route_id'])) {
            return $this->fail('bad_route_id');
        }
        if (!isset($vars['properties']) || !($vars['properties'] instanceof \stdClass)) {
            return $this->fail('bad_properties');
        }
        $props = get_object_vars($vars['properties']);
        $required = is_array($spec['required']) ? $spec['required'] : [];
        $allowed = array_merge($spec['optional'], $required);
        foreach ($props as $k => $v) {
            $k = (string) $k;
            if (!array_key_exists($k, $allowed)) {
                return $this->fail('unknown_property:' . $k);
            }
            if ($this->checkProp($allowed[$k], $v) !== null) {
                return $this->fail('bad_property:' . $k);
            }
        }
        foreach (array_keys($required) as $k) {
            if (!array_key_exists($k, $props)) {
                return $this->fail('missing_property:' . $k);
            }
        }
        if (isset($props['element_id'])) {
            $el = $this->elements[$props['element_id']];
            if ($el['event'] !== $name) {
                return $this->fail('element_event_mismatch');
            }
            if (!isset($props['placement']) || $el['placement'] !== $props['placement']) {
                return $this->fail('element_placement_mismatch');
            }
            if (isset($el['channel']) && (!isset($props['channel']) || $el['channel'] !== $props['channel'])) {
                return $this->fail('element_channel_mismatch');
            }
            if (isset($el['intent']) && (!isset($props['intent']) || $el['intent'] !== $props['intent'])) {
                return $this->fail('element_intent_mismatch');
            }
        }
        $clean = [];
        foreach ($props as $k => $v) {
            $clean[(string) $k] = is_float($v) ? (int) $v : $v;
        }
        return ['ok' => true, 'error' => null, 'value' => [
            'event_id' => $vars['event_id'], 'session_id' => $vars['session_id'], 'page_view_id' => $vars['page_view_id'],
            'sequence' => (int) $seq, 'name' => $name, 'occurred_at' => $ts, 'page_path' => $path,
            'route_id' => $this->routeIdFor($path), 'release_id' => $vars['release_id'], 'properties' => $clean,
        ]];
    }

    /** Valida un cuerpo JSON completo. Devuelve ok + lista de eventos normalizados, o el código del primer error. */
    public function validateBatch($body)
    {
        if (!is_string($body) || strlen($body) > $this->limits['max_body_bytes']) {
            return $this->fail('too_large');
        }
        $doc = json_decode($body, false, 16);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->fail('bad_json');
        }
        if (!($doc instanceof \stdClass)) {
            return $this->fail('bad_envelope');
        }
        $vars = get_object_vars($doc);
        foreach (array_keys($vars) as $k) {
            if ($k !== 'schema_version' && $k !== 'events') {
                return $this->fail('bad_envelope');
            }
        }
        if (!isset($vars['schema_version']) || !self::isInt($vars['schema_version']) || (int) $vars['schema_version'] !== 1
            || !isset($vars['events']) || !is_array($vars['events'])) {
            return $this->fail('bad_envelope');
        }
        $events = $vars['events'];
        if (count($events) === 0) {
            return $this->fail('empty_batch');
        }
        if (count($events) > $this->limits['max_events_per_request']) {
            return $this->fail('too_many_events');
        }
        $out = [];
        $seen = [];
        foreach ($events as $i => $ev) {
            $r = $this->validateEvent($ev);
            if (!$r['ok']) {
                return $this->fail('event_' . $i . ':' . $r['error']);
            }
            if (isset($seen[$r['value']['event_id']])) {
                return $this->fail('duplicate_in_batch');
            }
            $seen[$r['value']['event_id']] = true;
            $out[] = $r['value'];
        }
        return ['ok' => true, 'error' => null, 'value' => $out];
    }

    /** 'YYYY-MM-DDTHH:MM:SS.mmmZ' -> 'YYYY-MM-DD HH:MM:SS.mmm' (UTC) y epoch en ms; null si no es una fecha real. */
    public function parseTimestamp($ts)
    {
        if (!is_string($ts) || preg_match('/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/', $ts, $m) !== 1) {
            return null;
        }
        if (!checkdate((int) $m[2], (int) $m[3], (int) $m[1]) || (int) $m[4] > 23 || (int) $m[5] > 59 || (int) $m[6] > 59) {
            return null;
        }
        $epoch = gmmktime((int) $m[4], (int) $m[5], (int) $m[6], (int) $m[2], (int) $m[3], (int) $m[1]);
        return ['sql' => $m[1] . '-' . $m[2] . '-' . $m[3] . ' ' . $m[4] . ':' . $m[5] . ':' . $m[6] . '.' . $m[7], 'ms' => $epoch * 1000 + (int) $m[7]];
    }
}
