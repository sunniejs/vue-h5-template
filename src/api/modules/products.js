import { apiClient } from '@/api/client'
export function getProducts(params = {}, signal) {
  return apiClient.get('/products', {
    params,
    signal
  })
}
export function getProduct(id, signal) {
  return apiClient.get(`/products/${id}`, { signal })
}
export function getAdminProducts(params = {}, signal) {
  return apiClient.get('/admin/products', {
    params,
    signal
  })
}
export function createProduct(input) {
  return apiClient.post('/admin/products', input)
}
export function updateProduct(id, input) {
  return apiClient.patch(`/admin/products/${id}`, input)
}
export function deleteProduct(id) {
  return apiClient.delete(`/admin/products/${id}`)
}
