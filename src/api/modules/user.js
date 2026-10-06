import { apiClient } from '@/api/client'
export function getUserProfile(signal) {
  return apiClient.get('/user/profile', { signal })
}
