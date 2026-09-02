/**
 * @name ConfigAutoImportPlugin
 * @description 按需加载，自动引入
 */

import AutoImport from 'unplugin-auto-import/vite';
import { VarletImportResolver } from '@varlet/import-resolver';
import { VantResolver } from '@vant/auto-import-resolver';
import type { Options } from 'unplugin-auto-import/types';

function createUiResolvers(
  framework: ViteEnv['VITE_UI_FRAMEWORK'],
): NonNullable<Options['resolvers']> {
  if (framework === 'varlet') return VarletImportResolver({ autoImport: true });
  if (framework === 'vant') return [VantResolver()];
  return [];
}

export const ConfigAutoImportPlugin = (
  framework: ViteEnv['VITE_UI_FRAMEWORK'],
) => {
  return AutoImport({
    dts: 'types/auto-imports.d.ts',
    imports: ['vue', 'pinia', 'vue-router'],
    eslintrc: {
      enabled: true,
    },
    resolvers: createUiResolvers(framework),
  });
};
