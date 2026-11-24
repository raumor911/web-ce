<?php
use Ce\Telemetry\Crawler\BotCatalog;
use Ce\Telemetry\Crawler\Cidr;
use Ce\Telemetry\Crawler\FeedUpdater;
use Ce\Telemetry\Crawler\LogParser;
use Ce\Telemetry\Crawler\Verifier;

T::test('cidr: IPv4 dentro, fuera y límites', function () {
    T::ok(Cidr::inAny('203.0.113.77', ['203.0.113.0/24']));
    T::ok(!Cidr::inAny('203.0.114.1', ['203.0.113.0/24']));
    T::ok(Cidr::inAny('203.0.113.130', ['203.0.113.128/25']));
    T::ok(!Cidr::inAny('203.0.113.127', ['203.0.113.128/25']));
    T::ok(Cidr::inAny('198.51.100.9', ['198.51.100.9/32']));
});
T::test('cidr: IPv6 y mapeada a IPv4', function () {
    T::ok(Cidr::inAny('2001:db8::1', ['2001:db8::/32']));
    T::ok(!Cidr::inAny('2001:db9::1', ['2001:db8::/32']));
    T::ok(Cidr::inAny('::ffff:203.0.113.5', ['203.0.113.0/24']));
});
T::test('cidr: entradas inválidas no coinciden ni fallan', function () {
    T::ok(!Cidr::inAny('no-es-ip', ['203.0.113.0/24']));
    T::eq(null, Cidr::parse('203.0.113.0/33'));
    T::eq(null, Cidr::parse('203.0.113.0'));
    T::eq(null, Cidr::parse('x/24'));
});

T::test('bots: reglas por UA y finalidad; Google-Extended no es UA', function () {
    T::eq('search', BotCatalog::classify('Mozilla/5.0; compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot')['purpose']);
    T::eq('training_crawl', BotCatalog::classify('Mozilla/5.0 AppleWebKit/537.36; compatible; GPTBot/1.3')['purpose']);
    T::eq('user_triggered', BotCatalog::classify('Mozilla/5.0 ChatGPT-User/1.0')['purpose']);
    T::eq('claude-searchbot', BotCatalog::classify('Claude-SearchBot/1.0')['declared_bot']);
    T::eq('claudebot', BotCatalog::classify('Mozilla/5.0 (compatible; ClaudeBot/1.0)')['declared_bot']);
    T::eq('perplexity-user', BotCatalog::classify('Mozilla/5.0 Perplexity-User/1.0')['declared_bot']);
    T::eq('googlebot', BotCatalog::classify('Mozilla/5.0 (compatible; Googlebot/2.1)')['declared_bot']);
    T::eq(null, BotCatalog::classify('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15'));
    T::eq(null, BotCatalog::classify('Google-Extended'));
    T::eq('generic_bot', BotCatalog::classify('SomeCrawler/2.0')['declared_bot']);
});
T::test('bots: tipo de recurso inferido y rutas excluidas', function () {
    T::eq('robots', BotCatalog::resourceType('/robots.txt'));
    T::eq('llms', BotCatalog::resourceType('/llms.txt'));
    T::eq('sitemap', BotCatalog::resourceType('/sitemap.xml'));
    T::eq('ai_markdown', BotCatalog::resourceType('/ai/home.md'));
    T::eq('html', BotCatalog::resourceType('/soluciones/venta-renta/'));
    T::eq('asset', BotCatalog::resourceType('/assets/index-abc.js'));
    T::ok(BotCatalog::isExcludedPath('/telemetria/collect.php'));
    T::ok(!BotCatalog::isExcludedPath('/robots.txt'));
});

T::test('verificación: verified / mismatch / no disponible / declarada', function () {
    $now = 1800000000;
    $v = new Verifier(['openai_gptbot' => ['snapshot_id' => 5, 'ranges' => ['203.0.113.0/24'], 'valid_until' => $now + 3600]]);
    $c = BotCatalog::classify('GPTBot/1.3');
    T::eq('verified', $v->verify($c, '203.0.113.9', true, $now)['status']);
    T::eq('mismatch', $v->verify($c, '198.51.100.9', true, $now)['status']);
    T::eq('verification_unavailable', $v->verify($c, '203.0.113.9', false, $now)['status']);
    T::eq('verification_unavailable', $v->verify($c, '203.0.113.9', true, $now + 7200)['status'], 'snapshot vencido');
    T::eq('declared_unverified', $v->verify(BotCatalog::classify('SomeCrawler/2.0'), '203.0.113.9', true, $now)['status']);
    T::eq('unknown', $v->verify(null, '203.0.113.9', true, $now)['status']);
    $none = new Verifier([]);
    T::eq('verification_unavailable', $none->verify($c, '203.0.113.9', true, $now)['status']);
});

T::test('feeds: JSON válido, inválido y CIDR inválido', function () {
    $ok = json_encode(['prefixes' => [['ipv4Prefix' => '203.0.113.0/24'], ['ipv6Prefix' => '2001:db8::/32']]]);
    T::eq(['203.0.113.0/24', '2001:db8::/32'], FeedUpdater::parseFeed($ok));
    T::eq(null, FeedUpdater::parseFeed('{}'));
    T::eq(null, FeedUpdater::parseFeed('no json'));
    T::eq(null, FeedUpdater::parseFeed(json_encode(['prefixes' => [['ipv4Prefix' => '999.1.1.1/24']]])));
    T::eq(null, FeedUpdater::parseFeed(json_encode(['prefixes' => []])));
});
T::test('feeds: solo HTTPS a hosts de la lista; redirección fuera de lista se rechaza', function () {
    $calls = [];
    $u = new FeedUpdater(null, function ($url) use (&$calls) {
        $calls[] = $url;
        return ['status' => 302, 'location' => 'https://evil.example/feed.json', 'body' => null];
    });
    T::eq(null, $u->download('openai_gptbot'));
    T::eq(1, count($calls), 'no se sigue la redirección a un host no permitido');
    $u2 = new FeedUpdater(null, function ($url) {
        return ['status' => 200, 'location' => null, 'body' => str_repeat('x', 1048577)];
    });
    T::eq(null, $u2->download('openai_gptbot'), 'más de 1 MiB');
    T::eq(null, $u2->download('no_existe'));
});

$combined = '203.0.113.9 - - [24/Nov/2026:10:15:30 -0600] "GET /robots.txt HTTP/1.1" 200 1234 "-" "Mozilla/5.0 (compatible; GPTBot/1.3; +https://openai.com/gptbot)"';
T::test('parser: línea combined, hora con zona y consulta eliminada', function () use ($combined) {
    $r = LogParser::parseLine($combined);
    T::eq('/robots.txt', $r['path']);
    T::eq(200, $r['status']);
    T::eq(1234, $r['bytes']);
    T::eq(gmmktime(16, 15, 30, 11, 24, 2026), $r['at']);
    $q = LogParser::parseLine(str_replace('/robots.txt', '/contacto/?email=a@b.c&utm_source=x', $combined));
    T::eq('/contacto/', $q['path']);
    T::eq(null, LogParser::parseLine('basura'));
    T::eq(null, LogParser::parseLine(str_replace('/robots.txt', '/' . str_repeat('a', 600), $combined)));
});
T::test('parser: fecha local America/Mexico_City', function () {
    T::eq('2026-11-23', LogParser::localDate(gmmktime(3, 0, 0, 11, 24, 2026))); // 21:00 del día 23 en CDMX
    T::eq('2026-11-24', LogParser::localDate(gmmktime(7, 0, 0, 11, 24, 2026)));
});
