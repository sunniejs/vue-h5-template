import { createVitePlugins } from './build/vite/plugins/index.ts';
import { createViteProxy } from './build/vite/proxy.ts';
import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import { wrapperEnv } from './build/utils.ts';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default function defineViteConfig({
  command,
  mode,
}: ConfigEnv): UserConfig {
  const isProduction = command === 'build';
  const root = process.cwd();
  const fileEnv = loadEnv(mode, root, '');
  const processEnv = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] =>
        entry[0].startsWith('VITE_') && typeof entry[1] === 'string',
    ),
  );
  const env = { ...fileEnv, ...processEnv };
  const viteEnv = wrapperEnv(env);
  const uiDemoPath = fileURLToPath(
    new URL(`src/views/ui/${viteEnv.VITE_UI_FRAMEWORK}.vue`, import.meta.url),
  );

  return {
    base: '/',
    root,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('src', import.meta.url)),
        '#': fileURLToPath(new URL('types', import.meta.url)),
        '#ui-demo': uiDemoPath,
      },
    },
    server: {
      host: true,
      hmr: true,
      proxy: createViteProxy(viteEnv),
      forwardConsole: true,
    },
    plugins: createVitePlugins(viteEnv, isProduction),
    esbuild: isProduction
      ? {
          drop: ['console', 'debugger'],
        }
      : undefined,
    build: {
      target: ['es2019', 'safari15'],
      manifest: true,
      // 使用 esbuild 压缩：比 terser 快数倍，且原生支持移除 console/debugger
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // 拆分 vendor，避免单个 chunk 过大、改善缓存命中率与并行加载
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('@vant')) return 'vendor-vant';
            if (id.includes('@nutui')) return 'vendor-nutui';
            if (id.includes('@varlet')) return 'vendor-varlet';
            if (id.includes('@tanstack')) return 'vendor-query';
            if (id.includes('markdown-it') || id.includes('dompurify'))
              return 'vendor-markdown';
            if (
              /[\\/]node_modules[\\/](vue|vue-router|pinia|vue-i18n)[\\/]/.test(
                id,
              )
            ) {
              return 'vendor-vue';
            }
            return 'vendor';
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            viteEnv.VITE_UI_FRAMEWORK === 'nutui'
              ? `@use "@/styles/variable.scss" as *;@use "@nutui/nutui/dist/styles/variables.scss" as *;`
              : `@use "@/styles/variable.scss" as *;`,
          quietDeps: true,
        },
      },
    },
  };
}
