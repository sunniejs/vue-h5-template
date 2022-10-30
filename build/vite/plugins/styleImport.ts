/**
 * @name ConfigRestartPlugin
 * @description 按需引入样式文件
 */

import { createStyleImportPlugin, Lib, VantResolve } from 'vite-plugin-style-import';

function NutuiResolve(): Lib {
  return {
    libraryName: '@nutui/nutui',
    libraryNameChangeCase: 'pascalCase',
    resolveStyle: (name) => {
      return `@nutui/nutui/dist/packages/${name.toLowerCase()}/index.scss`;
    },
  };
}

export const ConfigStyleImport = () => {
  return createStyleImportPlugin({
    resolves: [NutuiResolve(), VantResolve()],
  });
};
