/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ConfigSvgIconsPlugin } from './svgIcons';
import { ConfigAutoComponentsPlugin } from './component';
import { ConfigAutoImportPlugin } from './autoImport';
import { ConfigMockPlugin } from './mock';
import { ConfigCompressPlugin } from './compress';
import { ConfigPagesPlugin } from './pages';
import { ConfigRestartPlugin } from './restart';
import { ConfigProgressPlugin } from './progress';
import { ConfigErudaPlugin } from './eruda';
import { ConfigImageminPlugin } from './imagemin';
import { ConfigVisualizerPlugin } from './visualizer';
import { ConfigSslPlugin } from './ssl';
import { ConfigQrcodePlugin } from './qrcode';
import { ConfigPwaPlugin } from './pwa';

export function createVitePlugins(env, isBuild) {
  const { VITE_USE_MOCK, VITE_USE_ERUDA, VITE_USE_COMPRESS, VITE_USE_REPORT, VITE_USE_HTTPS, VITE_USE_PWA } = env;

  const vitePlugins = [
    // vue支持
    vue(),
    // JSX支持
    vueJsx(),
  ];

  // 自动按需引入组件
  vitePlugins.push(ConfigAutoComponentsPlugin());

  // 自动按需引入依赖
  vitePlugins.push(ConfigAutoImportPlugin());

  // 自动生成路由
  vitePlugins.push(ConfigPagesPlugin());

  // 监听配置文件改动重启
  vitePlugins.push(ConfigRestartPlugin());

  // 构建时显示进度条
  vitePlugins.push(ConfigProgressPlugin());

  // svg 图标
  vitePlugins.push(ConfigSvgIconsPlugin(isBuild));

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
    vitePlugins.push(ConfigMockPlugin(isBuild));
  }

  if (VITE_USE_HTTPS) {
    // 引入模拟 SSl 证书
    vitePlugins.push(ConfigSslPlugin());
  }

  if (VITE_USE_PWA) {
    vitePlugins.push(ConfigPwaPlugin());
  }

  if (isBuild) {
    // 开启.gz压缩
    if (VITE_USE_COMPRESS) {
      vitePlugins.push(ConfigCompressPlugin());
      // 图片压缩
      vitePlugins.push(ConfigImageminPlugin());
    }
  }

  if (!isBuild) {
    // 开启二维码插件
    vitePlugins.push(ConfigQrcodePlugin());
  }

  return vitePlugins;
}
