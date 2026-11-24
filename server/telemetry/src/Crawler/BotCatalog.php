<?php
namespace Ce\Telemetry\Crawler;

/**
 * Catálogo VERSIONADO de familias de crawlers y feeds oficiales de rangos IP.
 *
 * Verificado contra documentación oficial el 2026-11-24 (ver docs/telemetry/crawlers.md): OpenAI
 * (developers.openai.com/api/docs/bots), Google (developers.google.com/crawling/docs/crawlers-fetchers/...),
 * Anthropic (support.claude.com, artículo 8896518) y Perplexity (docs.perplexity.ai/docs/resources/perplexity-crawlers).
 * Lo que no figura aquí no se verifica: se conserva como declared_unverified. Finalidad = clasificación por documentación
 * del proveedor, no evidencia de lo que hizo con una respuesta.
 */
class BotCatalog
{
    const RULES_VERSION = '2026-11-24.1';

    /** feed_id => [provider, url, hosts permitidos (incluye redirecciones)] */
    public static function feeds()
    {
        $g = 'https://developers.google.com/static/crawling/ipranges/';
        return [
            'openai_searchbot' => ['openai', 'https://openai.com/searchbot.json', ['openai.com']],
            'openai_gptbot' => ['openai', 'https://openai.com/gptbot.json', ['openai.com']],
            'openai_chatgpt_user' => ['openai', 'https://openai.com/chatgpt-user.json', ['openai.com']],
            'openai_adsbot' => ['openai', 'https://openai.com/adsbot.json', ['openai.com']],
            'anthropic_bots' => ['anthropic', 'https://claude.com/crawling/bots.json', ['claude.com']],
            'perplexity_bot' => ['perplexity', 'https://www.perplexity.ai/perplexitybot.json', ['www.perplexity.ai', 'perplexity.ai']],
            'perplexity_user' => ['perplexity', 'https://www.perplexity.ai/perplexity-user.json', ['www.perplexity.ai', 'perplexity.ai']],
            'google_common' => ['google', $g . 'common-crawlers.json', ['developers.google.com']],
            'google_special' => ['google', $g . 'special-crawlers.json', ['developers.google.com']],
            'google_user_triggered' => ['google', $g . 'user-triggered-fetchers.json', ['developers.google.com']],
            'google_user_triggered_google' => ['google', $g . 'user-triggered-fetchers-google.json', ['developers.google.com']],
            'google_user_triggered_agents' => ['google', $g . 'user-triggered-agents.json', ['developers.google.com']],
        ];
    }

    /**
     * Reglas en orden de prioridad: [familia, proveedor, regex del UA (sin delimitadores), finalidad, feeds].
     * Google-Extended NO aparece: es un token de control de robots.txt, no un user-agent que llegue a los logs.
     */
    public static function rules()
    {
        $gUser = ['google_user_triggered', 'google_user_triggered_google', 'google_user_triggered_agents'];
        return [
            ['oai-searchbot', 'openai', 'OAI-SearchBot', 'search', ['openai_searchbot']],
            ['oai-adsbot', 'openai', 'OAI-AdsBot', 'other', ['openai_adsbot']],
            ['gptbot', 'openai', 'GPTBot', 'training_crawl', ['openai_gptbot']],
            ['chatgpt-user', 'openai', 'ChatGPT-User', 'user_triggered', ['openai_chatgpt_user']],
            ['claude-searchbot', 'anthropic', 'Claude-SearchBot', 'search', ['anthropic_bots']],
            ['claude-user', 'anthropic', 'Claude-User', 'user_triggered', ['anthropic_bots']],
            ['claudebot', 'anthropic', 'ClaudeBot', 'training_crawl', ['anthropic_bots']],
            ['perplexitybot', 'perplexity', 'PerplexityBot', 'search', ['perplexity_bot']],
            ['perplexity-user', 'perplexity', 'Perplexity-User', 'user_triggered', ['perplexity_user']],
            ['googleother', 'google', 'GoogleOther', 'other', ['google_common']],
            ['google-cloudvertexbot', 'google', 'Google-CloudVertexBot', 'other', ['google_common']],
            ['google-inspectiontool', 'google', 'Google-InspectionTool', 'other', ['google_common']],
            ['storebot-google', 'google', 'Storebot-Google', 'other', ['google_common']],
            ['adsbot-google', 'google', 'AdsBot-Google', 'other', ['google_special']],
            ['google-agent', 'google', 'Google-Agent', 'user_triggered', $gUser],
            ['google-gemininotebook', 'google', 'Google-GeminiNotebook|Google-NotebookLM', 'user_triggered', $gUser],
            ['feedfetcher-google', 'google', 'FeedFetcher-Google', 'user_triggered', $gUser],
            ['apis-google', 'google', 'APIs-Google', 'user_triggered', $gUser],
            ['googlebot', 'google', 'Googlebot', 'search', ['google_common']],
        ];
    }

    /** Detección genérica: sin mecanismo oficial de verificación. */
    const GENERIC_REGEX = '(?:bot\b|crawler|spider|scraper|uptime|monitor|curl/|wget/|python-requests|go-http-client|headless|lighthouse|facebookexternalhit|slurp)';

    /**
     * @return array|null null si el UA no se declara como bot. Si no, ['declared_bot','provider','purpose','ua_family','feeds'].
     */
    public static function classify($userAgent)
    {
        if (!is_string($userAgent) || $userAgent === '' || $userAgent === '-') {
            return null;
        }
        $ua = substr($userAgent, 0, 512);
        foreach (self::rules() as $rule) {
            if (preg_match('~' . $rule[2] . '~i', $ua) === 1) {
                return ['declared_bot' => $rule[0], 'provider' => $rule[1], 'purpose' => $rule[3], 'ua_family' => $rule[0], 'feeds' => $rule[4]];
            }
        }
        if (preg_match('~' . self::GENERIC_REGEX . '~i', $ua) === 1) {
            return ['declared_bot' => 'generic_bot', 'provider' => null, 'purpose' => 'other', 'ua_family' => 'generic_bot', 'feeds' => []];
        }
        return null;
    }

    /** Tipo de recurso INFERIDO por ruta (el log de Apache no trae el Content-Type real). */
    public static function resourceType($path)
    {
        $p = strtolower($path);
        if ($p === '/robots.txt') {
            return 'robots';
        }
        if (preg_match('~^/sitemap[^/]*\.xml$~', $p) === 1) {
            return 'sitemap';
        }
        if ($p === '/llms.txt' || $p === '/llms-full.txt') {
            return 'llms';
        }
        if ($p === '/company.json' || $p === '/ai/company.json') {
            return 'company_json';
        }
        if (strpos($p, '/ai/') === 0 && substr($p, -3) === '.md') {
            return 'ai_markdown';
        }
        if (strpos($p, '/blog-admin/') === 0 || substr($p, -4) === '.php') {
            return 'api';
        }
        if (preg_match('~\.(png|jpe?g|gif|webp|avif|svg|ico)$~', $p) === 1) {
            return 'image';
        }
        if (preg_match('~\.(css|js|mjs|map|woff2?|ttf|otf|eot)$~', $p) === 1) {
            return 'asset';
        }
        if (substr($p, -1) === '/' || preg_match('~/[^/.]+$~', $p) === 1 || substr($p, -5) === '.html') {
            return 'html';
        }
        return 'other';
    }

    /** Rutas que no se importan (endpoint de telemetría, administración y salud). */
    public static function isExcludedPath($path)
    {
        $p = strtolower($path);
        foreach (['/telemetria/', '/telemetria-admin/', '/telemetry/', '/health', '/healthz', '/blog-admin/wp-admin/', '/blog-admin/wp-login.php'] as $x) {
            if (strpos($p, $x) === 0) {
                return true;
            }
        }
        return false;
    }
}
