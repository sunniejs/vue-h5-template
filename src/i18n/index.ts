import { createI18n } from 'vue-i18n';

export function loadLang() {
  const modules: Record<string, any> = import.meta.glob('./lang/*.ts', { eager: true });
  const langs: Record<string, any> = {};

  for (const path in modules) {
    const name = path.replace(/(\.\/lang\/|\.ts)/g, '');
    langs[name] = modules[path].lang;
  }
  return langs;
}

export const i18n = createI18n({
  // globalInjection: true,
  legacy: false,
  locale: 'zh-cn',
  fallbackLocale: 'zh-cn',
  messages: loadLang(),
});

export function setLang(locale?: string) {
  if (locale) {
    localStorage.setItem('lang', locale);
  }
  i18n.global.locale.value = locale || localStorage.getItem('lang') || '';
}
