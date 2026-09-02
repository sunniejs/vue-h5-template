import { apiClient } from '@/api/client';
import type { PaginationParams, PaginationResponse } from '@/types/api/common';
import type { components } from '@/types/api/generated';

export type Product = components['schemas']['Product'];
export type ProductInput = components['schemas']['ProductInput'];
export type ProductUpdateInput = components['schemas']['ProductUpdateInput'];
export type ProductStatus = components['schemas']['ProductStatus'];
export type LocalizedText = components['schemas']['LocalizedText'];

export interface ProductListParams extends PaginationParams {
  keyword?: string;
  category?: string;
  status?: ProductStatus;
  sort?: 'featured' | 'sales' | 'price_asc' | 'price_desc';
}

export function getProducts(
  params: ProductListParams = {},
  signal?: AbortSignal,
): Promise<PaginationResponse<Product>> {
  return apiClient.get<PaginationResponse<Product>>('/products', {
    params,
    signal,
  });
}

export function getProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`, { signal });
}

export function getAdminProducts(
  params: ProductListParams = {},
  signal?: AbortSignal,
): Promise<PaginationResponse<Product>> {
  return apiClient.get<PaginationResponse<Product>>('/admin/products', {
    params,
    signal,
  });
}

export function createProduct(input: ProductInput): Promise<Product> {
  return apiClient.post<Product, ProductInput>('/admin/products', input);
}

export function updateProduct(
  id: number,
  input: ProductUpdateInput,
): Promise<Product> {
  return apiClient.patch<Product, ProductUpdateInput>(
    `/admin/products/${id}`,
    input,
  );
}

export function deleteProduct(
  id: number,
): Promise<{ deleted: boolean; id: number }> {
  return apiClient.delete<{ deleted: boolean; id: number }>(
    `/admin/products/${id}`,
  );
}
