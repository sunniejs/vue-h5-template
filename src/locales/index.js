import { ref } from 'vue'
import zh from './langs/zh-CN/common.json'
import en from './langs/en-US/common.json'
import ja from './langs/ja-JP/common.json'

const messages = { 'zh-CN': { common: zh }, 'en-US': { common: en }, 'ja-JP': { common: ja } }
const defaultLocale = 'zh-CN'
export const locale = ref(defaultLocale)

function lookup(dictionary, key) {
  return key
    .split('.')
    .reduce(
      (entry, segment) => (entry && Object.prototype.hasOwnProperty.call(entry, segment) ? entry[segment] : undefined),
      dictionary
    )
}

function tm(key) {
  return lookup(messages[locale.value], key) ?? lookup(messages[defaultLocale], key)
}

export function t(key, params = {}) {
  const text = tm(key)
  return typeof text === 'string' ? text.replace(/\{(\w+)\}/g, (token, name) => params[name] ?? token) : key
}

export function setLang(requested) {
  const target = Object.prototype.hasOwnProperty.call(messages, requested) ? requested : defaultLocale
  locale.value = target
  document.documentElement.lang = target
  try {
    localStorage.setItem('lang', target)
  } catch {
    // Language changes work when storage is unavailable.
  }
}

export function restoreLanguage() {
  try {
    setLang(localStorage.getItem('lang'))
  } catch {
    setLang(defaultLocale)
  }
}

export function useI18n() {
  return { locale, t, tm }
}
