import { describe, expect, it } from 'vitest';
import {
  formatProductPrice,
  getLocalizedText,
  getSafeProductImage,
} from '@/utils/product';

const localized = {
  'zh-CN': '商品',
  'en-US': 'Product',
  'ja-JP': '商品（日本語）',
};

describe('product presentation utilities', () => {
  it('selects localized commerce content with a safe fallback', () => {
    expect(getLocalizedText(localized, 'en-US')).toBe('Product');
    expect(getLocalizedText(localized, 'fr-FR')).toBe('商品');
  });

  it('formats integer cents without floating point storage', () => {
    expect(formatProductPrice(129_900, 'zh-CN')).toContain('1,299.00');
  });

  it('rejects unsafe image protocols and protocol-relative URLs', () => {
    expect(getSafeProductImage('/products/item.svg')).toBe(
      '/products/item.svg',
    );
    expect(getSafeProductImage('javascript:alert(1)')).toBe(
      '/products/product-placeholder.svg',
    );
    expect(getSafeProductImage('//tracking.example/item.png')).toBe(
      '/products/product-placeholder.svg',
    );
  });
});
