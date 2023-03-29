import { createI18n } from "vue-i18n";

export function loadLang() {
  let modules = require.context("./module", true, /\.js$/);
  const langs = {};
  modules.keys().forEach((key) => {
    const filename = key.replace(/(\.\/|\.js)/g, "");
    langs[filename] = modules(key)["default"];
  });
  return langs;
}

export const i18n = createI18n({
  // globalInjection: true,
  locale: "zh-cn",
  legacy: false,
  fallbackLocale: "zh-cn",
  messages: loadLang(),
});

export function setLang(locale) {
  if (locale) {
    localStorage.setItem("lang", locale);
  }
  i18n.global.locale.value = locale || localStorage.getItem("lang") || "";
}
