import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import prerender from 'vite-plugin-prerender-esm-fix';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths(),
    prerender({
      // Las rutas que queremos pre-renderizar
      staticDir: path.join(__dirname, 'dist'),
      routes: [
        '/',
        '/nosotros',
        '/soluciones/venta-renta',
        '/soluciones/oficinas',
        '/proyectos',
        '/contacto'
      ],
      // Opciones del renderer (basado en Puppeteer)
      rendererOptions: {
        maxConcurrentRoutes: 1,
        renderAfterTime: 500, // Esperar para asegurar que React hidrate
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    })
  ],
})
