/**
 * @name ConfigPwaPlugin
 * @description 按需加载，自动引入
 */

import { VitePWA } from 'vite-plugin-pwa';

export const ConfigPwaPlugin = () => {
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'logo-320.png', 'logo-512.png'],
    devOptions: {
      enabled: false,
    },
    manifest: {
      name: 'Vue-H5-Template',
      short_name: 'Vue-H5-Template',
      description: 'Modern Vue 3 mobile H5 application template',
      theme_color: '#4f46e5',
      background_color: '#f6f7fb',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'logo-320.png',
          sizes: '320x320',
          type: 'image/png',
        },
        {
          src: 'logo-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,webp,ico,txt,woff2}'],
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api\//],
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
    },
  });
};
