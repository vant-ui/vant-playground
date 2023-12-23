import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": pathSrc,
    },
  },
  build: {
    rollupOptions: {
      external: ["typescript"],
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  plugins: [vue()],
  optimizeDeps: {
    exclude: ["@vue/repl"],
  },
});
