import { describe, expect, it } from 'vitest';
import { wrapperEnv } from '../build/utils';
import { createViteProxy } from '../build/vite/proxy';
import createMockHandlers from '../mock';

describe('Lite environment compatibility', () => {
  it('honors the legacy API prefix and PWA flag', () => {
    const config = wrapperEnv({ VITE_URL_PREFIX: '/gateway/', VITE_USE_PWA: 'true' });

    expect(config.VITE_API_BASE_URL).toBe('/gateway');
    expect(config.VITE_AI_API_BASE_URL).toBe('/gateway/ai');
    expect(config.VITE_PWA_ENABLED).toBe(true);
    expect(wrapperEnv({ VITE_USE_PWA: 'true', VITE_PWA_ENABLED: 'false' }).VITE_PWA_ENABLED).toBe(false);
  });

  it('uses independent proxy targets and removes only the configured prefix', () => {
    const config = wrapperEnv({
      VITE_API_BASE_URL: '/api.v2',
      VITE_AI_API_TARGET: 'http://localhost:8001',
      VITE_API_TARGET: 'http://localhost:8002',
      VITE_API_PROXY_REWRITE: 'true',
    });
    const proxy = createViteProxy(config);

    expect(Object.keys(proxy)).toEqual(['/api.v2/ai', '/api.v2']);
    expect(proxy['/api.v2/ai'].target).toBe('http://localhost:8001');
    expect(proxy['/api.v2'].rewrite('/api.v2/products')).toBe('/products');
    expect(proxy['/api.v2'].rewrite('/apiXv2/products')).toBe('/apiXv2/products');
  });

  it('uses configured mock paths and leaves the AI API to its configured backend', () => {
    const env = { VITE_URL_PREFIX: '/gateway', VITE_AI_API_BASE_URL: '/assistant' };
    expect(createMockHandlers({ env }).map((handler) => handler.url)).toEqual(
      expect.arrayContaining(['/gateway/products', '/assistant/suggestions', '/mock-api/login']),
    );

    const realAi = createMockHandlers({ env: { ...env, VITE_AI_API_TARGET: 'http://localhost:8001' } });
    expect(realAi.some((handler) => handler.url === '/assistant/suggestions')).toBe(false);
    expect(realAi.some((handler) => handler.url === '/gateway/products')).toBe(true);
  });
});
