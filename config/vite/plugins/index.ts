/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import { ConfigSvgIconsPlugin } from './svgIcons';
import { AutoRegistryComponents } from './component';
import { AutoImportDeps } from './autoImport';
import { ConfigMockPlugin } from './mock';
import { ConfigCompressPlugin } from './compress';
import { ConfigPagesPlugin } from './pages';
import { ConfigRestartPlugin } from './restart';
import { ConfigProgressPlugin } from './progress';
import { ConfigEruda } from './eruda';
import { ConfigStyleImport } from './styleImport';
import { ConfigImageminPlugin } from './imagemin';
import { ConfigVisualizerConfig } from './visualizer';

export function createVitePlugins(isBuild: boolean) {
  const vitePlugins: (Plugin | Plugin[])[] = [
    // vue支持
    vue(),
    // JSX支持
    vueJsx(),
    // setup语法糖组件名支持
    vueSetupExtend(),
  ];

  // 自动按需引入组件
  vitePlugins.push(AutoRegistryComponents());

  // 自动按需引入依赖
  vitePlugins.push(AutoImportDeps());

  // 自动生成路由
  vitePlugins.push(ConfigPagesPlugin());

  // 开启.gz压缩  rollup-plugin-gzip
  vitePlugins.push(ConfigCompressPlugin());

  // 监听配置文件改动重启
  vitePlugins.push(ConfigRestartPlugin());

  // 构建时显示进度条
  vitePlugins.push(ConfigProgressPlugin());

  //styleImport
  vitePlugins.push(ConfigStyleImport());

  // eruda
  vitePlugins.push(ConfigEruda());

  // rollup-plugin-visualizer
  vitePlugins.push(ConfigVisualizerConfig());
  if (isBuild) {
    // vite-plugin-imagemin
    vitePlugins.push(ConfigImageminPlugin());

    // vite-plugin-svg-icons
    vitePlugins.push(ConfigSvgIconsPlugin(isBuild));

    // vite-plugin-mock
    vitePlugins.push(ConfigMockPlugin(isBuild));
  }
  return vitePlugins;
}
