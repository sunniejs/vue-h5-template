/**
 * @name ConfigRestartPlugin
 * @description 按需引入样式文件
 */
import { createStyleImportPlugin, NutuiResolve, VantResolve } from 'vite-plugin-style-import';

export const ConfigStyleImport = () => {
  return createStyleImportPlugin({
    resolves: [NutuiResolve(), VantResolve()],
  });
};
