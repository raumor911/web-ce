import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';
import handler from 'serve-handler';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');

/**
 * Fetch all post slugs from WordPress with pagination support
 */
async function getAllPostSlugs() {
  const slugs = [];
  let page = 1;
  let totalPages = 1;

  async function fetchPage(p) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'creativosespacios.mx',
        port: 443,
        path: `/blog-admin/index.php?rest_route=/wp/v2/posts&per_page=100&page=${p}&status=publish`,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json'
        }
      };

      https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode !== 200) {
              console.error(`HTTP ${res.statusCode} on page ${p}`);
              resolve({ posts: [], totalPages: 1 });
              return;
            }
            const totalP = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
            const posts = JSON.parse(data);
            resolve({ posts, totalPages: totalP });
          } catch (e) {
            console.error(`Error parsing posts on page ${p}:`, e.message);
            resolve({ posts: [], totalPages: 1 });
          }
        });
      }).on('error', (e) => {
        console.error(`Error fetching posts on page ${p}:`, e.message);
        resolve({ posts: [], totalPages: 1 });
      });
    });
  }

  const firstResult = await fetchPage(1);
  if (Array.isArray(firstResult.posts)) {
    slugs.push(...firstResult.posts.map(post => `/blog/${post.slug}`));
  }
  totalPages = firstResult.totalPages || 1;

  for (let p = 2; p <= totalPages; p++) {
    const result = await fetchPage(p);
    if (Array.isArray(result.posts)) {
      slugs.push(...result.posts.map(post => `/blog/${post.slug}`));
    }
  }

  return slugs;
}

async function prerender() {
  console.log('--- Starting manual prerender pipeline ---');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist directory does not exist. Run vite build first.');
    process.exit(1);
  }

  const routesConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/config/routes.json'), 'utf-8'));
  const staticRoutes = routesConfig.filter(r => r.prerender).map(r => r.path);
  const dynamicRoutes = await getAllPostSlugs();
  const routes = [...staticRoutes, ...dynamicRoutes];
  
  console.log(`Routes identified for prerendering: ${routes.length}`);
  
  const server = http.createServer((request, response) => {
    // Proxy WordPress API requests to the real server during prerender
    if (request.url.startsWith('/blog-admin')) {
      const options = {
        hostname: 'creativosespacios.mx',
        port: 443,
        path: request.url,
        method: request.method,
        headers: {
          ...request.headers,
          host: 'creativosespacios.mx',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      };

      const proxyReq = https.request(options, (proxyRes) => {
        // Add CORS headers to the proxied response to satisfy Puppeteer
        const headers = { ...proxyRes.headers };
        headers['Access-Control-Allow-Origin'] = '*';
        
        response.writeHead(proxyRes.statusCode, headers);
        proxyRes.pipe(response, { end: true });
      });

      proxyReq.on('error', (e) => {
        console.error(`Proxy error during prerender: ${e.message}`);
        response.statusCode = 500;
        response.end();
      });

      request.pipe(proxyReq, { end: true });
      return;
    }

    return handler(request, response, {
      public: DIST_DIR,
      rewrites: [
        { source: '!(/assets/**|/images/**|/favicon*)', destination: '/index.html' }
      ]
    });
  });

  const port = 8090;
  const failedRoutes = [];
  let browser;

  try {
    // Wait for the temporary server to be ready before Puppeteer navigates.
    await new Promise((resolve, reject) => {
      const onError = (error) => {
        server.off('listening', onListening);
        reject(error);
      };
      const onListening = () => {
        server.off('error', onError);
        resolve();
      };
      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port);
    });
    console.log(`Prerender server running at http://localhost:${port}`);

    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    for (const route of routes) {
      const startTime = Date.now();
      let page;

      try {
        page = await browser.newPage();
        page.on('console', msg => console.log(`BROWSER [${msg.type()}]:`, msg.text()));
        page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message));
        page.on('requestfailed', request => console.log('BROWSER REQ FAILED:', request.url(), request.failure().errorText));
        await page.setViewport({ width: 1440, height: 900 });

        console.log(`Rendering: ${route}...`);
        const response = await page.goto(`http://localhost:${port}${route}`, {
          waitUntil: 'networkidle2',
          timeout: 90000
        });
        const status = response && response.status();
        if (typeof status !== 'number' || status < 200 || status >= 300) {
          throw new Error(`Invalid HTTP response: ${status ?? 'none'}`);
        }

        // Preserve the current render wait; reject only clearly incomplete captures.
        await new Promise(resolve => setTimeout(resolve, 3000));
        const metadata = await page.evaluate(() => {
          const h1 = document.querySelector('h1');
          const canonical = document.querySelector('link[rel="canonical"]');
          return {
            title: (document.title || '').trim(),
            h1: h1 ? (h1.textContent || '').trim() : '',
            canonical: canonical ? canonical.getAttribute('href') || '' : ''
          };
        });
        const expectedCanonical = new URL(
          route === '/' ? '/' : route.replace(/\/+$/, ''),
          'https://creativosespacios.mx/'
        ).toString();
        if (!metadata.h1) {
          throw new Error('Missing or empty H1');
        }
        if (metadata.canonical !== expectedCanonical) {
          throw new Error(`Invalid canonical: ${metadata.canonical || 'missing'} (expected ${expectedCanonical})`);
        }
        if (!metadata.title || metadata.title === 'Creativos Espacios | Infraestructura Modular') {
          throw new Error('Generic or missing document title');
        }
        if (route !== '/404' && /^404(?:\s|\b)/i.test(metadata.title)) {
          throw new Error('Rendered the 404 page instead of the requested route');
        }

        const content = await page.content();
        const filePath = route === '/404'
          ? path.join(DIST_DIR, '404.html')
          : path.join(DIST_DIR, route === '/' ? '' : route, 'index.html');
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(filePath, content);
        console.log(`\u2713 Saved ${route} (${Date.now() - startTime}ms)`);
      } catch (err) {
        failedRoutes.push({ route, reason: err.message });
        console.error(`\u2717 Failed to prerender ${route}:`, err.message);
      } finally {
        if (page && !page.isClosed()) {
          try {
            await page.close();
          } catch (err) {
            if (!failedRoutes.some(item => item.route === route)) {
              failedRoutes.push({ route, reason: `Page close failed: ${err.message}` });
            }
            console.error(`\u2717 Failed to close ${route}:`, err.message);
          }
        }
      }
    }
  } finally {
    // Always release the browser and the temporary server, including on startup errors.
    try {
      if (browser) await browser.close();
    } finally {
      if (server.listening) {
        await new Promise((resolve, reject) => {
          server.close(error => error ? reject(error) : resolve());
        });
      }
    }
  }

  console.log(`--- Prerender summary: ${routes.length - failedRoutes.length}/${routes.length} saved; ${failedRoutes.length} failed ---`);
  if (failedRoutes.length > 0) {
    throw new Error(`Prerender incomplete: ${failedRoutes.length} route(s) failed (${failedRoutes.map(item => item.route).join(', ')})`);
  }
  console.log('--- Prerender pipeline finished successfully ---');
}

prerender().catch(err => {
  console.error('Prerender pipeline critical failure:', err);
  process.exitCode = 1;
});
