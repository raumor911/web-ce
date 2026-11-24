<?php
// Ejecutor de pruebas PHP sin dependencias. Uso: php server/telemetry/tests/run.php
// Las pruebas con base de datos real se omiten salvo que se defina CE_TEST_DSN (BD DESECHABLE, nunca producción).
require dirname(__DIR__) . '/bootstrap.php';

final class T
{
    public static $tests = [];
    public static $failed = 0;
    public static $passed = 0;
    public static $skipped = 0;

    public static function test($name, $fn)
    {
        self::$tests[] = [$name, $fn];
    }

    public static function eq($expected, $actual, $msg = '')
    {
        if ($expected !== $actual) {
            throw new \Exception(($msg !== '' ? $msg . ': ' : '') . 'esperado ' . var_export($expected, true) . ' obtenido ' . var_export($actual, true));
        }
    }

    public static function ok($cond, $msg = 'condición falsa')
    {
        if (!$cond) {
            throw new \Exception($msg);
        }
    }

    public static function skip($why)
    {
        throw new \SkipTest($why);
    }
}

class SkipTest extends \Exception
{
}

foreach (glob(__DIR__ . '/*Test.php') as $file) {
    require $file;
}
foreach (T::$tests as $t) {
    try {
        call_user_func($t[1]);
        T::$passed++;
        echo "ok   {$t[0]}\n";
    } catch (SkipTest $e) {
        T::$skipped++;
        echo "skip {$t[0]} ({$e->getMessage()})\n";
    } catch (\Throwable $e) {
        T::$failed++;
        echo "FAIL {$t[0]}: {$e->getMessage()}\n";
    }
}
echo sprintf("\n%d ok, %d fallan, %d omitidas\n", T::$passed, T::$failed, T::$skipped);
exit(T::$failed === 0 ? 0 : 1);
