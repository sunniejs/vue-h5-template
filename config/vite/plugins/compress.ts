/**
 * @name ConfigCompressPlugin
 * @description 开启.gz压缩
 */
import viteCompression from 'vite-plugin-compression';

export const ConfigCompressPlugin = () => {
  return viteCompression({
    ext: '.gz',
    verbose: true,
    deleteOriginFile: false,
  });

  return [];
};
