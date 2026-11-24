<?php
use Ce\Telemetry\Aggregator;
use Ce\Telemetry\Config;
use Ce\Telemetry\Migrator;
use Ce\Telemetry\RateLimiter;

T::test('migraciones: se separan sentencias y se ignoran comentarios', function () {
    $sql = "-- comentario\nCREATE TABLE a (x INT);\n\n-- otro\nCREATE TABLE b (\n  y INT\n);\n";
    T::eq(['CREATE TABLE a (x INT)', "CREATE TABLE b (\n  y INT\n)"], Migrator::splitStatements($sql));
});
T::test('migraciones: todos los archivos terminan sentencias con punto y coma y no usan tipos prohibidos', function () {
    foreach (glob(dirname(__DIR__) . '/schema/migrations/*.sql') as $f) {
        $sql = file_get_contents($f);
        T::ok(preg_match('~\b(JSON|GENERATED|CHECK\s*\()~i', preg_replace('~--[^\n]*~', '', $sql)) !== 1, basename($f) . ' usa JSON/GENERATED/CHECK');
        T::ok(preg_match('~\b(DROP|TRUNCATE)\b~i', preg_replace('~--[^\n]*~', '', $sql)) !== 1, basename($f) . ' es destructiva');
        T::ok(count(Migrator::splitStatements($sql)) >= 1);
    }
});

T::test('agregados: ventana UTC de un día local (CDMX sin horario de verano en 2026-11)', function () {
    list($from, $to) = Aggregator::window('2026-11-24');
    T::eq('2026-11-24 06:00:00.000', $from);
    T::eq('2026-11-25 06:00:00.000', $to);
});
T::test('agregados: fecha local de un instante UTC', function () {
    T::eq('2026-11-23', Aggregator::localDateOf(gmmktime(5, 59, 59, 11, 24, 2026)));
    T::eq('2026-11-24', Aggregator::localDateOf(gmmktime(6, 0, 0, 11, 24, 2026)));
});

T::test('configuración: valores por punto, captura apagada por defecto y archivo inexistente = null', function () {
    $c = new Config(['enabled' => false, 'db' => ['ingest' => ['dsn' => 'x']], 'allowed_origins' => ['https://creativosespacios.mx' => 'production']]);
    T::eq(false, $c->enabled());
    T::eq('x', $c->get('db.ingest.dsn'));
    T::eq('d', $c->get('db.nada.mas', 'd'));
    T::eq('production', $c->environmentForOrigin('https://creativosespacios.mx'));
    T::eq(null, $c->environmentForOrigin('https://otro.example'));
    T::eq(null, Config::load('/no/existe/telemetry-config.php'));
});
T::test('configuración: el ejemplo del repositorio trae enabled=false y solo marcadores', function () {
    $c = Config::load(dirname(__DIR__) . '/telemetry-config.example.php');
    T::ok($c !== null);
    T::eq(false, $c->enabled());
    T::ok(strpos((string) $c->get('hmac_key'), 'CAMBIAR') === 0);
});

T::test('antiabuso: la clave de minuto y Retry-After son coherentes', function () {
    $now = 1800000030;
    T::eq(gmdate('YmdHi', $now), RateLimiter::minuteStamp($now));
    $r = RateLimiter::retryAfter($now);
    T::ok($r >= 1 && $r <= 60);
});

T::test('base de datos (desechable): idempotencia de agregados y migraciones', function () {
    if (!getenv('CE_TEST_DSN')) {
        T::skip('define CE_TEST_DSN apuntando a una base DESECHABLE para ejecutarla');
    }
    $pdo = new \PDO(getenv('CE_TEST_DSN'), (string) getenv('CE_TEST_USER'), (string) getenv('CE_TEST_PASS'), [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION, \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC]);
    $m = new Migrator($pdo, dirname(__DIR__) . '/schema/migrations');
    $first = $m->migrate();
    T::eq(null, $first['error']);
    $second = $m->migrate();
    T::eq([], $second['applied'], 'segunda ejecución no aplica nada');
    $agg = new Aggregator($pdo, function () { return 1800000000; });
    $agg->recomputeWeb('2026-11-24');
    $a = $pdo->query('SELECT COUNT(*) AS n, COALESCE(SUM(page_views),0) AS pv FROM daily_web_metrics WHERE local_date = "2026-11-24"')->fetch();
    $agg->recomputeWeb('2026-11-24');
    $b = $pdo->query('SELECT COUNT(*) AS n, COALESCE(SUM(page_views),0) AS pv FROM daily_web_metrics WHERE local_date = "2026-11-24"')->fetch();
    T::eq($a, $b, 'recalcular el mismo día no duplica ni suma dos veces');
});
