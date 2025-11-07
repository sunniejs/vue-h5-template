/**
 * @name ConfigPwaPlugin
 * @description 按需加载，自动引入
 */

import { VitePWA } from 'vite-plugin-pwa';

export const ConfigPwaPlugin = () => {
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
    devOptions: {
      enabled: true,
      type: 'module',
    },
    manifest: {
      name: 'Vue-H5-Template',
      short_name: 'Vue-H5-Template',
      description: '一个使用 Vite 和 Vue3构建的应用',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      screenshots: [
        {
          src: 'logo-320.png',
          sizes: '320x320',
          type: 'image/png',
        },
        {
          src: 'logo-512.png',
          sizes: '512x512',
          type: 'image/png',
          form_factor: 'wide',
        },
      ],
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
      // 全局模式匹配
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'], // 运行时缓存配置
      runtimeCaching: [
        {
          // API 请求缓存
          urlPattern: ({ url }) => url.pathname.startsWith('/api'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24, // 1天
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          // 图片缓存
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30天
            },
          },
        },
      ],
    },
  });
};
