/**
 * @name ConfigVisualizerPlugin
 * @description 打包体积分析
 */

import { visualizer } from 'rollup-plugin-visualizer';

export const ConfigVisualizerPlugin = () => {
  return visualizer({
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  });
};
