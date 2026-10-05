import { apiClient } from '@/api/client';
export const getProductFavorite = (id, signal) =>
  apiClient.get('/product/favorite', {
    params: { id },
    signal,
  });
export const setProductFavorite = (productId, favorite) => apiClient.post('/product/favorite', { productId, favorite });
