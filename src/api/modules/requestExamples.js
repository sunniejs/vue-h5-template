import { apiClient } from '@/api/client'
export function triggerRequestError(scenario) {
  return apiClient.get(`/examples/${scenario}`, scenario === 'timeout' ? { timeout: 100 } : undefined)
}
