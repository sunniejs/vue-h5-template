import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProductDetail from '@/views/shop/detail.vue';
import { getProduct } from '@/api/modules/products';
import type { Product } from '@/api/modules/products';
import { useCartStore } from '@/store/modules/cart';

vi.mock('@/api/modules/products', () => ({ getProduct: vi.fn() }));
const clients: QueryClient[] = [];
enableAutoUnmount(afterEach);
beforeEach(() =>
  vi
    .mocked(getProduct)
    .mockReset()
    .mockImplementation(async (id) => ({ ...product, id })),
);
afterEach(() => clients.splice(0).forEach((client) => client.clear()));

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

async function render(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/shop/products/:id?', component: ProductDetail },
      { path: '/shop', component: { template: '<div>Shop</div>' } },
    ],
  });
  await router.push(path);
  const pinia = createPinia();
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  const wrapper = mount(ProductDetail, {
    global: {
      plugins: [router, pinia, [VueQueryPlugin, { queryClient: client }]],
      stubs: { FavoriteButton: true },
    },
  });
  return { wrapper, router, cart: useCartStore(pinia) };
}

describe('product detail route and purchase state', () => {
  it.each(['', '0', '-1', '1.5', '1e2', 'abc', '9007199254740992'])(
    'rejects invalid ID %s without a request or an endless loading state',
    async (id) => {
      const { wrapper } = await render(`/shop/products/${id}`);
      expect(wrapper.get('[role="alert"]').text()).toContain('商品链接无效');
      expect(wrapper.get('a').attributes('href')).toBe('/shop');
      expect(getProduct).not.toHaveBeenCalled();
      expect(wrapper.find('.purchase-bar').exists()).toBe(false);
    },
  );

  it('resets quantity and confirmation when the route reuses the page', async () => {
    const { wrapper, router, cart } = await render('/shop/products/1');
    await vi.waitFor(() =>
      expect(wrapper.find('.purchase-bar').exists()).toBe(true),
    );
    await wrapper.get('button[aria-label="增加数量"]').trigger('click');
    await wrapper.get('.purchase-bar > button').trigger('click');
    expect(cart.itemCount).toBe(2);
    expect(wrapper.get('[role="status"]').text()).toContain('2');
    await router.push('/shop/products/2');
    await vi.waitFor(() =>
      expect(getProduct).toHaveBeenLastCalledWith(2, expect.any(AbortSignal)),
    );
    await vi.waitFor(() =>
      expect(wrapper.find('.quantity span').text()).toBe('1'),
    );
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    await wrapper.get('.purchase-bar > button').trigger('click');
    expect(
      cart.lines.map(({ product: item, quantity }) => [item.id, quantity]),
    ).toEqual([
      [1, 2],
      [2, 1],
    ]);
  });

  it('disables purchases when there is no stock', async () => {
    vi.mocked(getProduct).mockResolvedValueOnce({
      ...product,
      stock: 0,
      status: 'sold_out',
    });
    const { wrapper, cart } = await render('/shop/products/1');
    await vi.waitFor(() =>
      expect(wrapper.find('.purchase-bar').exists()).toBe(true),
    );
    for (const button of wrapper.findAll('.purchase-bar button'))
      expect(button.attributes('disabled')).toBeDefined();
    expect(wrapper.get('.quantity span').text()).toBe('1');
    expect(cart.lines).toEqual([]);
  });

  it('lets the user retry a failed detail request', async () => {
    vi.mocked(getProduct).mockRejectedValueOnce(new Error('offline'));
    const { wrapper } = await render('/shop/products/1');
    await vi.waitFor(() =>
      expect(wrapper.find('[role="alert"]').exists()).toBe(true),
    );
    await wrapper.get('[role="alert"] button').trigger('click');
    await flushPromises();
    await vi.waitFor(() => expect(wrapper.find('h1').text()).toBe('测试商品'));
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});
