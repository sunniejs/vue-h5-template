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
    build: {
      target: ['es2019', 'safari15'],
      manifest: true,
      rolldownOptions: {
        output: {
          minify: {
            compress: { dropConsole: true, dropDebugger: true },
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
