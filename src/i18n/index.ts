import { AnyObject } from '#/global';
import { createI18n } from 'vue-i18n';

export function loadLang() {
  const context = import.meta.globEager('./lang/*.ts');
  const messages: AnyObject = {};

  const langs = Object.keys(context);
  for (const key of langs) {
    if (key === './index.ts') return;
    const lang = context[key].lang;
    const name = key.replace(/(\.\/lang\/|\.ts)/g, '');

    messages[name] = lang;
  }

  return messages;
}

export const i18n = createI18n({
  // globalInjection: true,
  // legacy: false,
  locale: 'zh-cn',
  fallbackLocale: 'zh-cn',
  messages: loadLang(),
});

export const i18nt = i18n.global.t;

export function setLang(locale: string) {
  i18n.global.locale = locale;
}
