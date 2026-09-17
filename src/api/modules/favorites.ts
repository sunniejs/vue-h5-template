import { apiClient } from '@/api/client';
import type { components } from '@/types/api/generated';
export type FavoriteResult = components['schemas']['FavoriteResult'];
export const getProductFavorite = (id: number, signal?: AbortSignal) =>
  apiClient.get<FavoriteResult>('/product/favorite', {
    params: { id },
    signal,
  });
export const setProductFavorite = (productId: number, favorite: boolean) =>
  apiClient.post<FavoriteResult>('/product/favorite', { productId, favorite });
