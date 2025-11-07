/**
 * @name ConfigPagesPlugin
 * @description 动态生成路由
 */

import Pages from 'vite-plugin-pages';

export const ConfigPagesPlugin = () => {
  return Pages({
    dirs: 'src/pages',
    extensions: ['vue'],
    importMode: 'async',
  });
};
