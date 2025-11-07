/**
 * @name ConfigQrcodePlugin
 * @description 引入qrcode插件，用于在浏览器中显示当前页面的二维码
 */

import { qrcode } from 'vite-plugin-qrcode';

export const ConfigQrcodePlugin = () => {
  return qrcode();
};
