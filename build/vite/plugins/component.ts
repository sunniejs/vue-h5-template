/**
 * @name ConfigAutoComponentsPlugin
 * @description 按需加载，自动引入组件
 * @returns {import('vite').Plugin} Vite插件配置
 */

import Components from 'unplugin-vue-components/vite';
import NutUIResolver from '@nutui/auto-import-resolver';
import { VarletImportResolver } from '@varlet/import-resolver';
import { VantResolver } from '@vant/auto-import-resolver';
import type { ComponentResolver } from 'unplugin-vue-components';

function createUiResolvers(
  framework: ViteEnv['VITE_UI_FRAMEWORK'],
): ComponentResolver[] {
  if (framework === 'nutui') return [NutUIResolver()];
  if (framework === 'varlet') return VarletImportResolver();
  return [VantResolver()];
}

export const ConfigAutoComponentsPlugin = (
  framework: ViteEnv['VITE_UI_FRAMEWORK'],
) => {
  return Components({
    dirs: ['src/components'],
    extensions: ['vue', 'md'],
    deep: true,
    dts: 'types/components.d.ts',
    directoryAsNamespace: false,
    globalNamespaces: [],
    directives: true,
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    resolvers: createUiResolvers(framework),
  });
};
