const supportedLocales = new Set(['zh-CN', 'en-US', 'ja-JP']);
export function getLocalizedText(value, locale) {
  const key = supportedLocales.has(locale) ? locale : 'zh-CN';
  return value[key] || value['zh-CN'] || value['en-US'] || value['ja-JP'];
}
export function formatProductPrice(cents, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
export function getSafeProductImage(value) {
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:') return parsed.toString();
  } catch {
    // Fall through to the local placeholder.
  }
  return '/products/product-placeholder.svg';
}
export function parseProductId(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : undefined;
}
