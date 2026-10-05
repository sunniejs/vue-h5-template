import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ConfigSvgIconsPlugin } from './svgIcons';
import { ConfigAutoComponentsPlugin } from './component';
import { ConfigAutoImportPlugin } from './autoImport';
import { ConfigMockPlugin } from './mock';
import { ConfigAiMockPlugin } from './aiMock';
import { ConfigCompressPlugin } from './compress';
import { ConfigRestartPlugin } from './restart';
import { ConfigProgressPlugin } from './progress';
import { ConfigErudaPlugin } from './eruda';
import { ConfigVisualizerPlugin } from './visualizer';
import { ConfigSslPlugin } from './ssl';
import { ConfigQrcodePlugin } from './qrcode';
import { ConfigPwaPlugin, ConfigPwaRetirementPlugin } from './pwa';

export function createVitePlugins(env, isBuild) {
  const plugins = [
    vue(),
    vueJsx(),
    ConfigSvgIconsPlugin(isBuild),
    ConfigAutoComponentsPlugin(env.VITE_UI_FRAMEWORK),
    ConfigAutoImportPlugin(env.VITE_UI_FRAMEWORK),
    ConfigRestartPlugin(),
    ConfigProgressPlugin(),
  ];

  if (!isBuild) {
    plugins.push(ConfigQrcodePlugin());
    if (env.VITE_USE_MOCK) {
      if (!env.VITE_AI_API_TARGET) plugins.push(ConfigAiMockPlugin(env.VITE_AI_API_BASE_URL));
      plugins.push(ConfigMockPlugin());
    }
    if (env.VITE_USE_ERUDA) plugins.push(ConfigErudaPlugin());
    if (env.VITE_USE_HTTPS) plugins.push(ConfigSslPlugin());
  }

  if (env.VITE_USE_REPORT) plugins.push(ConfigVisualizerPlugin());
  if (env.VITE_PWA_ENABLED) plugins.push(ConfigPwaPlugin(env));
  else if (isBuild) plugins.push(ConfigPwaRetirementPlugin());
  if (isBuild && env.VITE_USE_COMPRESS) plugins.push(ConfigCompressPlugin());
  return plugins;
}
