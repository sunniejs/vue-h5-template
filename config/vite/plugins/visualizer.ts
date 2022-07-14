/**
 * @name ConfigVisualizerConfig
 * @description 打包体积分析
 */

import visualizer from 'rollup-plugin-visualizer';
import { IsReport } from '../../constant';

export function ConfigVisualizerConfig() {
  if (IsReport) {
    return visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    });
  }
  return [];
}
