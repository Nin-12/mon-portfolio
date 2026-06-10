import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
  if (!id.includes('node_modules')) return;

  // React ecosystem STRICT
  if (
    id.includes('/react/') ||
    id.includes('\\react\\') ||
    id.includes('/react-dom/') ||
    id.includes('\\react-dom/') ||
    id.includes('react-is') ||
    id.includes('scheduler')
  ) {
    return 'react-core';
  }

  // Router strict
  if (id.includes('react-router-dom') || id.includes('react-router')) {
    return 'router';
  }

  // Motion
  if (id.includes('framer-motion')) {
    return 'motion';
  }

  // Supabase
  if (id.includes('@supabase')) {
    return 'supabase';
  }

  // Icons
  if (id.includes('lucide-react')) {
    return 'icons';
  }

  // HTTP libs
  if (id.includes('axios')) {
    return 'http';
  }

  // fallback intelligent
  return 'vendor';
}
      },
    },

    // Minification moderne (Vite 7)
    minify: 'oxc',

    target: 'es2020',

    chunkSizeWarningLimit: 400,

    sourcemap: false,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
    ],
  },
});