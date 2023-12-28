import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Inspect from 'vite-plugin-inspect';
const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  build: {
    rollupOptions: {
      external: ['typescript'],
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
        fs: {
          fileExists: fs.existsSync,
          readFile: (file) => fs.readFileSync(file, 'utf-8'),
        },
      },
    }),
    Inspect(),
  ],
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
});
