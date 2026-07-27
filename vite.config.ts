import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/blog/wp-json': {
        target: 'https://creativosespacios.mx',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2018',
    sourcemap: 'hidden',
  },
  plugins: [
    react(),
    tsconfigPaths(),
  ],
})
