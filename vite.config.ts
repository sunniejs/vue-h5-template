import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { ConfigEnv, UserConfigExport } from 'vite';
import { createStyleImportPlugin, NutuiResolve } from 'vite-plugin-style-import';
import { viteMockServe } from 'vite-plugin-mock';
import eruda from 'vite-plugin-eruda';

const pathResolve = (dir: string) => resolve(__dirname, dir);

// https://vitejs.dev/config/
export default function ({ command }: ConfigEnv): UserConfigExport {
  const isProduction = command === 'build';
  console.log(isProduction);
  return {
    server: {
      host: '0.0.0.0',
    },
    plugins: [
      vue(),
      vueJsx(),
      createStyleImportPlugin({
        resolves: [NutuiResolve()],
      }),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      eruda(),
      viteMockServe({
        mockPath: './src/mock',
        localEnabled: command === 'serve',
        logger: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 配置 nutui 全局 scss 变量
          additionalData: `@import "@nutui/nutui/dist/styles/variables.scss";`,
        },
      },
    },
    resolve: {
      alias: {
        '@': pathResolve('./src'),
      },
    },
  };
}
