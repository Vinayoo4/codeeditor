import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        short_name: "EcoMealHub",
        name: "EcoWise Wealth & Meal Prep Hub",
        icons: [
          {
            src: "/icons/icon-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        start_url: "/",
        background_color: "#f3f4f6",
        theme_color: "#10b981",
        display: "standalone",
        orientation: "portrait"
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        navigateFallback: "/offline.html",
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff2?)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'asset-cache',
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
