import { createI18n } from 'vue-i18n';
import type { App } from 'vue';

const LOCALE_KEY = 'lang';
export const SUPPORTED_LOCALES = ['zh-CN', 'en-US', 'ja-JP'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'zh-CN';

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * 扫描所有语言文件（懒加载）
 */
const modules = import.meta.glob('./langs/**/*.json');

const localeLoaders: Record<string, () => Promise<Record<string, unknown>>> =
  {};

Object.keys(modules).forEach((path) => {
  // ./langs/zh-CN/common.json
  const match = path.match(/\.\/langs\/([^/]+)\/(.+)\.json$/);
  if (!match) return;

  const locale = match[1];
  if (!locale) return;

  if (!localeLoaders[locale]) {
    localeLoaders[locale] = async () => {
      const messages: Record<string, unknown> = {};

      for (const p in modules) {
        const m = p.match(new RegExp(`./langs/${locale}/(.+)\\.json$`));
        if (!m) continue;

        const namespace = m[1];
        if (!namespace) continue;
        if (modules[p]) {
          const mod = (await modules[p]()) as {
            default: Record<string, unknown>;
          };
          messages[namespace] = mod.default;
        }
      }

      return messages;
    };
  }
});

/**
 * i18n 实例（初始不加载 messages）
 */
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: '',
  fallbackLocale: DEFAULT_LOCALE,
  messages: {},
});

/**
 * 设置语言
 */
export async function setLang(locale?: string) {
  const requested =
    locale || localStorage.getItem(LOCALE_KEY) || DEFAULT_LOCALE;
  const target = isSupportedLocale(requested) ? requested : DEFAULT_LOCALE;

  if (!i18n.global.availableLocales.includes(target)) {
    const loader = localeLoaders[target];
    if (loader) {
      const messages = await loader();
      i18n.global.setLocaleMessage(target, messages);
    }
  }

  i18n.global.locale.value = target;
  localStorage.setItem(LOCALE_KEY, target);
  document.documentElement.lang = target;
  return target;
}

/**
 * 初始化（main.ts 调用）
 */
export async function setupI18n(app: App) {
  app.use(i18n);
  await setLang();
}
