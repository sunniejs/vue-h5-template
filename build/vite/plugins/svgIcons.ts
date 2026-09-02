import path from 'node:path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export function ConfigSvgIconsPlugin() {
  return createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    symbolId: 'icon-[dir]-[name]',
  });
}
