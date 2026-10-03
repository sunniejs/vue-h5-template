import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FavoriteButton from '@/components/shop/FavoriteButton.vue';
import {
  getProductFavorite,
  setProductFavorite,
} from '@/api/modules/favorites';
vi.mock('@/api/modules/favorites', () => ({
  getProductFavorite: vi.fn(),
  setProductFavorite: vi.fn(),
}));
const clients: QueryClient[] = [];
enableAutoUnmount(afterEach);
beforeEach(() => {
  vi.mocked(getProductFavorite)
    .mockReset()
    .mockResolvedValue({ productId: 1, favorite: false });
  vi.mocked(setProductFavorite).mockReset();
});
afterEach(() => {
  clients.splice(0).forEach((client) => client.clear());
});
function render(session = 'session-a') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  clients.push(client);
  return mount(FavoriteButton, {
    props: { productId: 1, session },
    global: {
      plugins: [[VueQueryPlugin, { queryClient: client }]],
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  });
}
describe('favorite interaction', () => {
  it('does not repopulate cleared private cache after the control is disposed', async () => {
    let finish:
      | ((value: { productId: number; favorite: boolean }) => void)
      | undefined;
    vi.mocked(setProductFavorite).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const wrapper = render();
    const client = clients[clients.length - 1];
    if (!client)
      throw new Error('Expected a query client for the mounted control');
    await vi.waitFor(() =>
      expect(wrapper.get('button').attributes('disabled')).toBeUndefined(),
    );
    await wrapper.get('button').trigger('click');
    client.clear();
    wrapper.unmount();
    finish?.({ productId: 1, favorite: true });
    await flushPromises();
    expect(client.getQueryCache().findAll()).toEqual([]);
  });
  it('does not request private state before login', () => {
    const wrapper = render('');
    expect(wrapper.find('a').exists()).toBe(true);
    expect(getProductFavorite).not.toHaveBeenCalled();
  });
  it('loads state, saves and removes a bookmark', async () => {
    const wrapper = render();
    await vi.waitFor(() =>
      expect(wrapper.get('button').attributes('disabled')).toBeUndefined(),
    );
    expect(getProductFavorite).toHaveBeenCalledWith(1, expect.any(AbortSignal));
    vi.mocked(setProductFavorite).mockResolvedValueOnce({
      productId: 1,
      favorite: true,
    });
    await wrapper.get('button').trigger('click');
    await vi.waitFor(() =>
      expect(wrapper.get('button').attributes('aria-pressed')).toBe('true'),
    );
    vi.mocked(setProductFavorite).mockResolvedValueOnce({
      productId: 1,
      favorite: false,
    });
    await wrapper.get('button').trigger('click');
    await vi.waitFor(() =>
      expect(wrapper.get('button').attributes('aria-pressed')).toBe('false'),
    );
    expect(setProductFavorite).toHaveBeenLastCalledWith(1, false);
  });
  it('recovers from a failed read and a failed write without changing the saved state', async () => {
    vi.mocked(getProductFavorite).mockRejectedValueOnce(new Error('offline'));
    const wrapper = render();
    await vi.waitFor(() =>
      expect(wrapper.find('[role="alert"]').exists()).toBe(true),
    );
    await wrapper.get('button').trigger('click');
    await vi.waitFor(() =>
      expect(wrapper.find('[role="alert"]').exists()).toBe(false),
    );
    vi.mocked(setProductFavorite).mockRejectedValueOnce(new Error('offline'));
    await wrapper.get('button').trigger('click');
    await vi.waitFor(() =>
      expect(wrapper.find('[role="alert"]').exists()).toBe(true),
    );
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false');
  });
  it('does not overwrite another session when an old write completes', async () => {
    let finish!: (value: { productId: number; favorite: boolean }) => void;
    vi.mocked(setProductFavorite).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const wrapper = render();
    await vi.waitFor(() =>
      expect(wrapper.get('button').attributes('disabled')).toBeUndefined(),
    );
    await wrapper.get('button').trigger('click');
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ session: 'session-b' });
    await vi.waitFor(() => expect(getProductFavorite).toHaveBeenCalledTimes(2));
    finish({ productId: 1, favorite: true });
    await vi.waitFor(() =>
      expect(wrapper.get('button').attributes('disabled')).toBeUndefined(),
    );
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false');
  });
});
