import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { ConfigEnv, UserConfigExport } from 'vite';
import { createStyleImportPlugin, NutuiResolve } from 'vite-plugin-style-import';
import { viteMockServe } from 'vite-plugin-mock';
import eruda from 'vite-plugin-eruda';

const pathResolve = (dir: string) => {
  return resolve(process.cwd(), '.', dir);
};

// https://vitejs.dev/config/
export default function ({ command }: ConfigEnv): UserConfigExport {
  const isProduction = command === 'build';
  const root = process.cwd();
  console.log(isProduction);
  return {
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      host: '0.0.0.0',
    },
    plugins: [
      vue(),
      vueJsx(),
      createStyleImportPlugin({
        resolves: [NutuiResolve()],
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
  };
}
