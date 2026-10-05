import { readFileSync } from 'node:fs';
import { VitePWA } from 'vite-plugin-pwa';
import { escapeRegex } from '../../utils';

export function ConfigPwaRetirementPlugin() {
  return {
    name: 'lite:retire-pwa',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: readFileSync(new URL('./retire-sw.js', import.meta.url), 'utf8'),
      });
    },
  };
}

export const ConfigPwaPlugin = (env) => {
  const apiPaths = [env.VITE_API_BASE_URL, env.VITE_AI_API_BASE_URL, '/mock-api']
    .filter((value) => value.startsWith('/'))
    .map((value) => new RegExp(`^${escapeRegex(value)}(?:/|\\?|$)`));
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
      navigateFallbackDenylist: apiPaths,
    },
  });
};
