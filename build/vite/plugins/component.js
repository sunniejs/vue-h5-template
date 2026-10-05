import Components from 'unplugin-vue-components/vite';
import { VantResolver, VarletUIResolver } from 'unplugin-vue-components/resolvers';
import NutUIResolver from '@nutui/auto-import-resolver';

export const ConfigAutoComponentsPlugin = (framework) => {
  const resolvers = { vant: VantResolver, varlet: VarletUIResolver, nutui: NutUIResolver };
  return Components({ dts: false, resolvers: [resolvers[framework]()] });
};
