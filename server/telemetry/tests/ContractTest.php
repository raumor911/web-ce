<?php
// Casos COMPARTIDOS con la prueba TypeScript (fixtures/validation-cases.json): ambos lados deben dar el mismo veredicto.
use Ce\Telemetry\Contract;

$fx = json_decode(file_get_contents(__DIR__ . '/fixtures/validation-cases.json'), true);
$contract = Contract::fromDir(dirname(__DIR__, 3) . '/src/telemetry');

$build = function ($case) use ($fx) {
    $ev = array_merge([
        'event_id' => $fx['ids']['event'], 'session_id' => $fx['ids']['session'], 'page_view_id' => $fx['ids']['view'],
        'sequence' => 7, 'occurred_at' => '2026-11-24T20:15:10.000Z', 'release_id' => 'abc1234',
    ], $fx['bases'][$case['base']]);
    foreach (isset($case['patch']) ? $case['patch'] : [] as $path => $value) {
        $parts = explode('.', $path);
        $ref = &$ev;
        while (count($parts) > 1) {
            $ref = &$ref[array_shift($parts)];
        }
        if ($value === null) {
            unset($ref[$parts[0]]);
        } else {
            $ref[$parts[0]] = $value;
        }
        unset($ref);
    }
    return json_decode(json_encode($ev)); // objeto stdClass, como llega del cuerpo real
};

foreach ($fx['event_cases'] as $case) {
    T::test('contrato/evento: ' . $case['id'], function () use ($contract, $build, $case) {
        $r = $contract->validateEvent($build($case));
        if ($case['expect'] === 'ok') {
            T::eq(true, $r['ok'], json_encode($r));
        } else {
            T::eq(false, $r['ok']);
            T::eq($case['expect'], $r['error']);
        }
    });
}
foreach ($fx['path_cases'] as $case) {
    T::test('contrato/ruta: ' . json_encode($case['input']), function () use ($contract, $case) {
        T::eq($case['expect'], $contract->normalizePath($case['input']));
    });
}
foreach ($fx['batch_cases'] as $case) {
    T::test('contrato/lote: ' . $case['id'], function () use ($contract, $case) {
        $r = $contract->validateBatch($case['body']);
        T::eq(false, $r['ok']);
        T::eq($case['expect'], $r['error']);
    });
}
T::test('contrato/lote: 20 eventos pasan y 21 se rechazan; duplicado interno se rechaza', function () use ($contract, $build) {
    $mk = function ($n) use ($build) {
        $out = [];
        for ($i = 0; $i < $n; $i++) {
            $e = $build(['base' => 'page_view']);
            $e->event_id = sprintf('11111111-1111-4111-8111-%012d', $i);
            $out[] = $e;
        }
        return $out;
    };
    T::eq(true, $contract->validateBatch(json_encode(['schema_version' => 1, 'events' => $mk(20)]))['ok']);
    T::eq('too_many_events', $contract->validateBatch(json_encode(['schema_version' => 1, 'events' => $mk(21)]))['error']);
    $e = $build(['base' => 'page_view']);
    T::eq('duplicate_in_batch', $contract->validateBatch(json_encode(['schema_version' => 1, 'events' => [$e, $e]]))['error']);
});
T::test('contrato/lote: cuerpo mayor a 32 KiB se rechaza antes de parsear', function () use ($contract) {
    T::eq('too_large', $contract->validateBatch(json_encode(['schema_version' => 1, 'events' => [], 'pad' => str_repeat('é', 17000)]))['error']);
});
T::test('contrato/route_id', function () use ($contract) {
    T::eq('home', $contract->routeIdFor('/'));
    T::eq('contacto', $contract->routeIdFor('/contacto/'));
});
