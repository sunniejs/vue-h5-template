import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getProductFavorite,
  setProductFavorite,
} from '@/api/modules/favorites';
import { getChatSuggestions } from '@/api/modules/ai';
const transport = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock('@/api/client', () => ({ apiClient: transport }));
beforeEach(() => {
  transport.get.mockReset();
  transport.post.mockReset();
});
describe('feature API contracts', () => {
  it('forwards bookmark IDs, explicit state and abort signals', async () => {
    const signal = new AbortController().signal;
    transport.get.mockResolvedValue({ productId: 3, favorite: true });
    await expect(getProductFavorite(3, signal)).resolves.toEqual({
      productId: 3,
      favorite: true,
    });
    expect(transport.get).toHaveBeenCalledWith('/product/favorite', {
      params: { id: 3 },
      signal,
    });
    transport.post.mockResolvedValue({ productId: 3, favorite: false });
    await setProductFavorite(3, false);
    expect(transport.post).toHaveBeenCalledWith('/product/favorite', {
      productId: 3,
      favorite: false,
    });
  });
  it.each([
    ['zh-TW', 'zh-CN'],
    ['ja-JP', 'ja-JP'],
    ['de-DE', 'en-US'],
  ])('normalizes suggestion locale %s', async (input, expected) => {
    const signal = new AbortController().signal;
    transport.get.mockResolvedValue(['prompt']);
    await getChatSuggestions(input, signal, '/custom/ai');
    expect(transport.get).toHaveBeenCalledWith('/suggestions', {
      baseURL: '/custom/ai',
      params: { locale: expected },
      signal,
    });
  });
  it('preserves rejected requests for query error recovery', async () => {
    const error = new Error('offline');
    transport.get.mockRejectedValue(error);
    await expect(getChatSuggestions('en-US')).rejects.toBe(error);
    await expect(getProductFavorite(1)).rejects.toBe(error);
  });
});
