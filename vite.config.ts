import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    // PERFORMANCE: Optimize chunking for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          vendor: ['react', 'react-dom', 'framer-motion'],
          ui: ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // PERFORMANCE: Enable HTTP/2 for faster asset loading
  preview: {
    port: 3001,
    https: false,
  },
});