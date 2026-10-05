const booleanKeys = [
  'VITE_USE_MOCK',
  'VITE_USE_ERUDA',
  'VITE_USE_COMPRESS',
  'VITE_USE_REPORT',
  'VITE_USE_HTTPS',
  'VITE_PWA_ENABLED',
  'VITE_USE_PWA',
  'VITE_API_PROXY_REWRITE',
];

export function wrapperEnv(env) {
  const apiBase = (env.VITE_API_BASE_URL || env.VITE_URL_PREFIX || '/api').replace(/\/+$/, '');
  const aiApiBase = (env.VITE_AI_API_BASE_URL || `${apiBase}/ai`).replace(/\/+$/, '');
  const framework = env.VITE_UI_FRAMEWORK || 'vant';
  if (!['vant', 'nutui', 'varlet'].includes(framework)) {
    throw new Error(`Unsupported VITE_UI_FRAMEWORK: ${framework}`);
  }

  const config = { ...env };
  for (const key of booleanKeys) config[key] = env[key] === 'true';
  return {
    ...config,
    VITE_API_BASE_URL: apiBase,
    VITE_AI_API_BASE_URL: aiApiBase,
    VITE_PWA_ENABLED: env.VITE_PWA_ENABLED === undefined ? config.VITE_USE_PWA : config.VITE_PWA_ENABLED,
    VITE_UI_FRAMEWORK: framework,
  };
}

export function escapeRegex(value) {
  return value.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&');
}
