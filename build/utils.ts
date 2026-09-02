const DEFAULT_ENV: ViteEnv = {
  VITE_API_BASE_URL: '/api',
  VITE_AI_API_BASE_URL: '/api/ai',
  VITE_USE_MOCK: false,
  VITE_USE_ERUDA: false,
  VITE_USE_COMPRESS: false,
  VITE_USE_REPORT: false,
  VITE_USE_HTTPS: false,
  VITE_PWA_ENABLED: false,
  VITE_IMAGE_OPTIMIZE: false,
  VITE_REQUEST_ID_ENABLED: true,
  VITE_UI_FRAMEWORK: 'vant',
};

const booleanKeys = new Set<keyof ViteEnv>([
  'VITE_USE_MOCK',
  'VITE_USE_ERUDA',
  'VITE_USE_COMPRESS',
  'VITE_USE_REPORT',
  'VITE_USE_HTTPS',
  'VITE_PWA_ENABLED',
  'VITE_IMAGE_OPTIMIZE',
  'VITE_REQUEST_ID_ENABLED',
  'VITE_API_PROXY_REWRITE',
]);

function parseEnvValue(
  envName: string,
  value: string,
): string | boolean | number {
  const normalized = value.replace(/\\n/g, '\n');
  if (booleanKeys.has(envName as keyof ViteEnv)) return normalized === 'true';
  if (envName === 'VITE_PORT') return Number(normalized);
  return normalized;
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable<string>): ViteEnv {
  const ret: ViteEnv = { ...DEFAULT_ENV };

  for (const envName of Object.keys(envConf)) {
    const realName = parseEnvValue(envName, envConf[envName] ?? '');
    ret[envName as keyof ViteEnv] = realName as never;
    if (typeof realName === 'string') {
      process.env[envName] = realName;
    }
  }

  return ret;
}
