import { fileURLToPath, URL } from 'node:url';
import { loadEnv } from 'vite';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugins';
import { createViteProxy } from './build/vite/proxy';

export default function ({ command, mode }) {
  const isBuild = command === 'build';
  const root = process.cwd();
  const env = wrapperEnv(loadEnv(mode, root));

  return {
    base: '/',
    root,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#ui-demo': fileURLToPath(new URL(`./src/views/ui/${env.VITE_UI_FRAMEWORK}.vue`, import.meta.url)),
      },
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'import.meta.env.VITE_AI_API_BASE_URL': JSON.stringify(env.VITE_AI_API_BASE_URL),
      'import.meta.env.VITE_UI_FRAMEWORK': JSON.stringify(env.VITE_UI_FRAMEWORK),
    },
    server: {
      host: true,
      hmr: true,
      proxy: createViteProxy(env),
    },
    plugins: createVitePlugins(env, isBuild),
    build: {
      target: ['es2019', 'safari15'],
      manifest: true,
      minify: 'terser',
      terserOptions: { compress: { drop_console: true, drop_debugger: true } },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            env.VITE_UI_FRAMEWORK === 'nutui'
              ? `@use "@/styles/variable.scss" as *; @use "@nutui/nutui/dist/styles/variables.scss" as *;`
              : `@use "@/styles/variable.scss" as *;`,
          quietDeps: true,
        },
      },
    },
  };
}
