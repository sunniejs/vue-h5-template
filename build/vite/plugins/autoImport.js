import AutoImport from 'unplugin-auto-import/vite';
import { VarletUIResolver, VantResolver } from 'unplugin-vue-components/resolvers';

export const ConfigAutoImportPlugin = (framework) =>
  AutoImport({
    imports: ['vue', 'pinia', 'vue-router'],
    dts: false,
    eslintrc: { enabled: true, globalsPropValue: true },
    resolvers: framework === 'vant' ? [VantResolver()] : framework === 'varlet' ? [VarletUIResolver()] : [],
  });
