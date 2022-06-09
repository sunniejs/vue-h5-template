/**
 * @name ConfigMockPlugin
 * @description 引入mockjs，本地模拟接口
 */
import { viteMockServe } from 'vite-plugin-mock';
export const ConfigMockPlugin = (isBuild: boolean) => {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: false, //实际开发请关闭，会影响打包体积
    // https://github.com/anncwb/vite-plugin-mock/issues/9
    injectCode: `
       import { setupProdMockServer } from '../mock/_createProdMockServer';
       setupProdMockServer();
       `,
  });
};
