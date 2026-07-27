import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');
const DOMAIN = 'https://www.creativosespacios.mx';

const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/nosotros', priority: '0.8', changefreq: 'monthly' },
  { url: '/soluciones/venta-renta', priority: '0.9', changefreq: 'weekly' },
  { url: '/soluciones/oficinas', priority: '0.9', changefreq: 'weekly' },
  { url: '/proyectos', priority: '0.9', changefreq: 'weekly' },
  { url: '/contacto', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
];

async function getPostRoutes() {
  return new Promise((resolve) => {
    https.get('https://creativosespacios.mx/blog-admin/wp-json/wp/v2/posts?per_page=100', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const posts = JSON.parse(data);
          resolve(posts.map(p => ({
            url: `/blog/${p.slug}`,
            priority: '0.6',
            changefreq: 'monthly'
          })));
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function generateSitemap() {
  const dynamicRoutes = await getPostRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully with blog posts.');
}

generateSitemap();
