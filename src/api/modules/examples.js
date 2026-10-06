import { apiClient } from '@/api/client'
export function getTasks(signal) {
  return apiClient.get('/examples/tasks', { signal })
}
export function toggleTask(id) {
  return apiClient.post(`/examples/tasks/${id}/toggle`)
}
export function getFeed(cursor = 0, limit = 6, signal) {
  return apiClient.get('/examples/feed', {
    params: { cursor, limit },
    signal
  })
}
