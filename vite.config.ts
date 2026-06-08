/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { createViteFileLogger } from './scripts/viteLogger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT) || 3001;

  return {
    plugins: [react()],
    customLogger: createViteFileLogger(mode),
    server: {
      port,
      host: true,
    },
    preview: {
      port,
      host: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return;
            }

            if (
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('/react/')
            ) {
              return 'react-vendor';
            }

            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'redux-vendor';
            }

            if (id.includes('framer-motion')) {
              return 'motion-vendor';
            }

            if (id.includes('react-datepicker') || id.includes('date-fns')) {
              return 'datepicker-vendor';
            }

            if (id.includes('@dnd-kit')) {
              return 'dnd-vendor';
            }
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setup.ts',
      env: {
        VITE_API_AUTH_PREFIX: 'http://localhost:8080',
        VITE_API_CONTENT_PREFIX: 'http://localhost:8081',
        VITE_APP_NAME: 'Srota Partner Test',
      },
    },
  };
});
