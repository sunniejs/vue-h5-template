import { viteMockServe } from 'vite-plugin-mock';

export const ConfigMockPlugin = () =>
  viteMockServe({
    ignore: /^_/,
    mockPath: 'mock',
    enable: true,
    logger: true,
  });
