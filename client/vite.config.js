import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'StartupForge - AI Startup Ecosystem',
        short_name: 'StartupForge',
        description: 'Build Your Dream Team, Launch Your Vision',
        theme_color: '#07090F',
        background_color: '#07090F',
        display: 'standalone',
        icons: [
          {
            src: 'https://api.dicebear.com/7.x/identicon/svg?seed=StartupForge',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'https://api.dicebear.com/7.x/identicon/svg?seed=StartupForge',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
