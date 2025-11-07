import { createVitePlugins } from './build/vite/plugins';
import { loadEnv } from 'vite';
import { wrapperEnv } from './build/utils';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default function ({ command, mode }) {
  const isProduction = command === 'build';
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  return {
    base: '/',
    root,
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      host: true,
      hmr: true,
    },
    plugins: createVitePlugins(viteEnv, isProduction),
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['legacy-js-api'],
          // 配置 nutui 全局 scss 变量
          additionalData: `@use "@nutui/nutui/dist/styles/variables.scss" as *; @use '@/styles/vant.scss' as *;`,
        },
      },
    },
  };
}
