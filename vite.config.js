import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // Project root
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
