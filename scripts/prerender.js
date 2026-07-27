import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import http from 'http';
import https from 'https';
import handler from 'serve-handler';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');
const routes = ['/', '/nosotros', '/soluciones/venta-renta', '/soluciones/oficinas', '/proyectos', '/contacto', '/blog', '/404'];

async function prerender() {
  console.log('Starting manual prerender...');
  
  // Start a temporary server to serve the dist folder
  const server = http.createServer((request, response) => {
    // Proxy WordPress API requests to the real server during prerender
    if (request.url.startsWith('/blog/wp-json')) {
      const options = {
        hostname: 'creativosespacios.mx',
        port: 443,
        path: request.url,
        method: request.method,
        headers: {
          ...request.headers,
          host: 'creativosespacios.mx'
        }
      };

      const proxyReq = https.request(options, (proxyRes) => {
        response.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(response, { end: true });
      });

      proxyReq.on('error', (e) => {
        console.error(`Proxy error: ${e.message}`);
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

  const port = 8080;
  server.listen(port);
  console.log(`Server listening on port ${port}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const route of routes) {
    console.log(`Prerendering ${route}...`);
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    
    await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
    
    // Wait for a bit more just in case
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = await page.content();
    
    let filePath;
    if (route === '/404') {
      filePath = path.join(DIST_DIR, '404.html');
    } else {
      const routePath = route === '/' ? '' : route;
      filePath = path.join(DIST_DIR, routePath, 'index.html');
    }
    
    const dirPath = path.dirname(filePath);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Saved ${filePath}`);
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Manual prerender finished.');
}

prerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});