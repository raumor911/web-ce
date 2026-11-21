import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { canonicalUrl } from '../src/lib/canonicalUrl.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');
const DIST_DIR = path.join(__dirname, '../dist');
const BLOG_SNAPSHOT = path.join(DIST_DIR, '.ce-build-posts.json');
const DOMAIN = 'https://creativosespacios.mx';

const routesConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/config/routes.json'), 'utf-8'));
const staticRoutes = routesConfig.filter(r => r.sitemap).map(r => ({
  url: r.path,
  priority: r.priority || '0.8',
  changefreq: r.changefreq || 'monthly'
}));

async function generateSitemap() {
  console.log('--- Generating dynamic sitemap ---');
  
  try {
    // Use exactly the posts captured for prerendering; never query WordPress twice.
    const snapshot = JSON.parse(fs.readFileSync(BLOG_SNAPSHOT, 'utf-8'));
    if (!snapshot || !Array.isArray(snapshot.posts)) {
      throw new Error('Missing or invalid WordPress build snapshot');
    }
    const posts = snapshot.posts;
    const dynamicRoutes = posts.map(post => {
      if (!post || typeof post.slug !== 'string' ||
          !post.slug || /[\\/?#\s]/.test(post.slug) || /^\.+$/.test(post.slug) ||
          typeof post.modified !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(post.modified)) {
        throw new Error('Invalid WordPress post in build snapshot');
      }
      const htmlPath = path.join(DIST_DIR, 'blog', post.slug, 'index.html');
      if (!fs.existsSync(htmlPath)) {
        throw new Error(`Missing prerendered article: /blog/${post.slug}`);
      }
      return {
      url: `/blog/${post.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: post.modified.split('T')[0]
      };
    });

    // sitemap.xml lista solo páginas estáticas. Los artículos viven en
    // /sitemap-blog.xml (cron PHP en el servidor, fuera de dist). Aquí solo se
    // valida que cada artículo del snapshot esté prerenderizado.
    const allRoutes = [...staticRoutes];
    const today = new Date().toISOString().split('T')[0];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => {
  // Regla única de URLs (barra final): src/lib/canonicalUrl.mjs
  const loc = canonicalUrl(route.url);
  
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    // Also write to dist if it exists, to ensure it's available after build
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
    fs.rmSync(BLOG_SNAPSHOT);
    
    console.log(`✓ Sitemap generated successfully with ${allRoutes.length} static URLs (${dynamicRoutes.length} WordPress articles validated as prerendered, listed in sitemap-blog.xml, not here).`);
  } catch (error) {
    console.error('✗ Sitemap generation failed:', error.message);
    process.exit(1);
  }
}

generateSitemap();
