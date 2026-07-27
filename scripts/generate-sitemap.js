import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');
const DOMAIN = 'https://creativosespacios.mx';

const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/nosotros', priority: '0.8', changefreq: 'monthly' },
  { url: '/soluciones/venta-renta', priority: '0.9', changefreq: 'weekly' },
  { url: '/soluciones/oficinas', priority: '0.9', changefreq: 'weekly' },
  { url: '/proyectos', priority: '0.9', changefreq: 'weekly' },
  { url: '/contacto', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
];

/**
 * Fetch all posts from WordPress with pagination support
 */
async function getAllPosts() {
  const allPosts = [];
  let page = 1;
  let totalPages = 1;

  async function fetchPage(p) {
    return new Promise((resolve) => {
      https.get(`https://creativosespacios.mx/blog-admin/wp-json/wp/v2/posts?per_page=100&page=${p}&status=publish`, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const totalP = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
            const posts = JSON.parse(data);
            resolve({ posts, totalPages: totalP });
          } catch (e) {
            console.error(`Error parsing posts for sitemap on page ${p}:`, e.message);
            resolve({ posts: [], totalPages: 1 });
          }
        });
      }).on('error', (e) => {
        console.error(`Error fetching posts for sitemap on page ${p}:`, e.message);
        resolve({ posts: [], totalPages: 1 });
      });
    });
  }

  const firstResult = await fetchPage(1);
  allPosts.push(...firstResult.posts);
  totalPages = firstResult.totalPages;

  for (let p = 2; p <= totalPages; p++) {
    const result = await fetchPage(p);
    allPosts.push(...result.posts);
  }

  return allPosts;
}

async function generateSitemap() {
  console.log('--- Generating dynamic sitemap ---');
  
  try {
    const posts = await getAllPosts();
    const dynamicRoutes = posts.map(post => ({
      url: `/blog/${post.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: post.modified.split('T')[0]
    }));

    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    const today = new Date().toISOString().split('T')[0];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    // Also write to dist if it exists, to ensure it's available after build
    const DIST_DIR = path.join(__dirname, '../dist');
    if (fs.existsSync(DIST_DIR)) {
      fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
    }
    
    console.log(`✓ Sitemap generated successfully with ${allRoutes.length} URLs.`);
  } catch (error) {
    console.error('✗ Sitemap generation failed:', error.message);
    process.exit(1);
  }
}

generateSitemap();
