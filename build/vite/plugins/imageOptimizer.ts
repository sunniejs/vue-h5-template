import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export function ConfigImageOptimizerPlugin() {
  return ViteImageOptimizer({
    includePublic: true,
    cache: true,
    cacheLocation: 'node_modules/.cache/vite-image-optimizer',
    png: { quality: 82 },
    jpeg: { quality: 82 },
    jpg: { quality: 82 },
    webp: { quality: 82 },
    svg: { multipass: true },
  });
}
