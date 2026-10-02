import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path configured for GitHub Pages target: https://danielshululu.github.io/daniel-tech/
  base: '/daniel-tech/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
