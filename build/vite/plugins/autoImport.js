/**
 * @name ConfigAutoImportPlugin
 * @description 按需加载，自动引入
 */

import AutoImport from 'unplugin-auto-import/vite';
import { VarletUIResolver, VantResolver } from 'unplugin-vue-components/resolvers';

export const ConfigAutoImportPlugin = () => {
  return AutoImport({
    imports: [
      'vue',
      'pinia',
      'vue-router',
      {
        '@vueuse/core': [],
      },
    ],
    dts: false,
    eslintrc: {
      enabled: true,
      globalsPropValue: true,
    },
    resolvers: [VarletUIResolver(), VantResolver()],
  });
};
