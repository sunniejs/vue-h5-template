import type { ProxyOptions } from 'vite';

/**
 * 开发环境代理配置
 * - AI 路径可优先转发给独立 FastAPI 服务，其他 /api 请求转发给 Gin
 * - 未配置目标时，/api 请求由 vite-plugin-mock 在开发环境响应
 */
export function createViteProxy(env: ViteEnv): Record<string, ProxyOptions> {
  const proxy: Record<string, ProxyOptions> = {};
  const apiBaseUrl = env.VITE_API_BASE_URL || '/api';
  const aiApiBaseUrl = env.VITE_AI_API_BASE_URL || `${apiBaseUrl}/ai`;

  if (env.VITE_AI_API_TARGET) {
    proxy[aiApiBaseUrl] = {
      target: env.VITE_AI_API_TARGET,
      changeOrigin: true,
    };
  }

  if (env.VITE_API_TARGET) {
    proxy[apiBaseUrl] = {
      target: env.VITE_API_TARGET,
      changeOrigin: true,
      rewrite: env.VITE_API_PROXY_REWRITE
        ? (path) => path.replace(new RegExp(`^${apiBaseUrl}`), '')
        : undefined,
    };
  }

  return proxy;
}
