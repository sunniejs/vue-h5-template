import type { LocalizedText } from '@/api/modules/products';

const supportedLocales = new Set<keyof LocalizedText>([
  'zh-CN',
  'en-US',
  'ja-JP',
]);

export function getLocalizedText(value: LocalizedText, locale: string): string {
  const key = supportedLocales.has(locale as keyof LocalizedText)
    ? (locale as keyof LocalizedText)
    : 'zh-CN';
  return value[key] || value['zh-CN'] || value['en-US'] || value['ja-JP'];
}

export function formatProductPrice(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function getSafeProductImage(value: string): string {
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\'))
    return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:') return parsed.toString();
  } catch {
    // Fall through to the local placeholder.
  }
  return '/products/product-placeholder.svg';
}
