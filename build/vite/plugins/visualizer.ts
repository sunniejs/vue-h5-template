/**
 * @name ConfigVisualizerPlugin
 * @description 打包体积分析
 */

import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';

export const ConfigVisualizerPlugin = () => {
  return visualizer({
    filename: './dist/stats.html',
    open: false,
    gzipSize: true,
    brotliSize: true,
  }) as PluginOption;
};
