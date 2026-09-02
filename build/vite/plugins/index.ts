/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */

import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ConfigAutoComponentsPlugin } from './component.ts';
import { ConfigAutoImportPlugin } from './autoImport.ts';
import { ConfigMockPlugin } from './mock.ts';
import { ConfigCompressPlugin } from './compress.ts';
import { ConfigProgressPlugin } from './progress.ts';
import { ConfigErudaPlugin } from './eruda.ts';
import { ConfigVisualizerPlugin } from './visualizer.ts';
import { ConfigSslPlugin } from './ssl.ts';
import { ConfigPwaPlugin } from './pwa.ts';
import { ConfigSvgIconsPlugin } from './svgIcons.ts';
import { ConfigImageOptimizerPlugin } from './imageOptimizer.ts';
import { ConfigAiMockPlugin } from './aiMock.ts';

export function createVitePlugins(env: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_MOCK,
    VITE_USE_ERUDA,
    VITE_USE_COMPRESS,
    VITE_USE_REPORT,
    VITE_USE_HTTPS,
    VITE_PWA_ENABLED,
    VITE_IMAGE_OPTIMIZE,
    VITE_UI_FRAMEWORK,
  } = env;

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // vue支持
    vue(),
    // JSX支持
    vueJsx(),
    ConfigSvgIconsPlugin(),
  ];

  // 自动按需引入组件、依赖 + 构建时显示进度条
  vitePlugins.push(
    ConfigAutoComponentsPlugin(VITE_UI_FRAMEWORK),
    ConfigAutoImportPlugin(VITE_UI_FRAMEWORK),
    ConfigProgressPlugin(),
  );

  // eruda调试工具
  if (VITE_USE_ERUDA) {
    vitePlugins.push(ConfigErudaPlugin());
  }

  // 打包分析工具
  if (VITE_USE_REPORT) {
    vitePlugins.push(ConfigVisualizerPlugin());
  }

  // 数据 mock
  if (VITE_USE_MOCK) {
    vitePlugins.push(ConfigAiMockPlugin(), ConfigMockPlugin(isBuild));
  }

  if (VITE_USE_HTTPS) {
    // 引入模拟 SSl 证书
    vitePlugins.push(ConfigSslPlugin());
  }

  if (VITE_PWA_ENABLED) {
    vitePlugins.push(ConfigPwaPlugin());
  }

  if (isBuild) {
    if (VITE_IMAGE_OPTIMIZE) {
      vitePlugins.push(ConfigImageOptimizerPlugin());
    }
    // 开启.gz压缩
    if (VITE_USE_COMPRESS) {
      vitePlugins.push(ConfigCompressPlugin());
    }
  }

  return vitePlugins;
}
