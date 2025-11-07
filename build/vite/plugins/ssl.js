/**
 * @name ConfigSslPlugin
 * @description 引入模拟 SSl 证书
 */

import basicSsl from '@vitejs/plugin-basic-ssl';

export const ConfigSslPlugin = () => {
  return basicSsl();
};
