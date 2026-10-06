import { apiClient } from '@/api/client'
export function loginPassword(params, signal) {
  return apiClient.post('/auth/login', params, {
    signal
  })
}
