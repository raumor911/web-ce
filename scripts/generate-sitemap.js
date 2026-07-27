import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');
const SITE_URL = 'https://www.creativosespacios.mx';

const routes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/nosotros', priority: '0.5', changefreq: 'monthly' },
  { path: '/soluciones/venta-renta', priority: '0.8', changefreq: 'monthly' },
  { path: '/soluciones/oficinas', priority: '0.8', changefreq: 'monthly' },
  { path: '/proyectos', priority: '0.8', changefreq: 'monthly' },
  { path: '/contacto', priority: '0.5', changefreq: 'monthly' },
  { path: '/blog', priority: '0.5', changefreq: 'monthly' },
];

const generateSitemap = () => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
  
  console.log('Sitemap generated successfully.');
};

generateSitemap();