import { createI18n } from 'vue-i18n';
const LOCALE_KEY = 'lang';
export const SUPPORTED_LOCALES = ['zh-CN', 'en-US', 'ja-JP'];
export const DEFAULT_LOCALE = 'zh-CN';
export function isSupportedLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale);
}
const modules = import.meta.glob('./langs/*/common.json', { import: 'default' });

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
export async function setLang(locale) {
  const requested = locale || localStorage.getItem(LOCALE_KEY) || DEFAULT_LOCALE;
  const target = SUPPORTED_LOCALES.find((language) => language.toLowerCase() === requested.toLowerCase()) || DEFAULT_LOCALE;
  if (!i18n.global.availableLocales.includes(target)) {
    const common = await modules[`./langs/${target}/common.json`]();
    i18n.global.setLocaleMessage(target, { common });
  }
  i18n.global.locale.value = target;
  localStorage.setItem(LOCALE_KEY, target);
  document.documentElement.lang = target;
  return target;
}
/**
 * 初始化（main.js 调用）
 */
export async function setupI18n(app) {
  app.use(i18n);
  await setLang();
}
