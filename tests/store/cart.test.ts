import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCartStore } from '@/store/modules/cart';
import type { Product } from '@/api/modules/products';

const product: Product = {
  id: 1,
  sku: 'TEST-1',
  name: { 'zh-CN': '测试商品', 'en-US': 'Test product', 'ja-JP': 'テスト商品' },
  subtitle: { 'zh-CN': '测试', 'en-US': 'Test', 'ja-JP': 'テスト' },
  description: { 'zh-CN': '测试', 'en-US': 'Test', 'ja-JP': 'テスト' },
  category: 'digital',
  brand: 'Test',
  coverUrl: '/products/product-placeholder.svg',
  priceCents: 9900,
  originalPriceCents: 12_900,
  stock: 3,
  sales: 0,
  rating: 5,
  status: 'on_sale',
  featured: false,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

describe('cart store', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('adds, caps, selects, totals and removes cart lines', () => {
    const cart = useCartStore();
    cart.add(product, 2);
    cart.add(product, 2);
    expect(cart.itemCount).toBe(3);
    expect(cart.selectedTotal).toBe(29_700);
    cart.toggle(product.id);
    expect(cart.selectedTotal).toBe(0);
    cart.toggleAll();
    expect(cart.allSelected).toBe(true);
    cart.setQuantity(product.id, 1);
    expect(cart.itemCount).toBe(1);
    cart.remove(product.id);
    expect(cart.lines).toEqual([]);
  });
});
