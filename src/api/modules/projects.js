import { apiClient } from '@/api/client'
export function getProjects(params = {}, signal) {
  return apiClient.get('/projects', {
    params,
    signal
  })
}
export function getProject(id, signal) {
  return apiClient.get(`/projects/${id}`, { signal })
}
export function createProject(input) {
  return apiClient.post('/projects', input)
}
export function updateProject(id, input) {
  return apiClient.patch(`/projects/${id}`, input)
}
export function deleteProject(id) {
  return apiClient.delete(`/projects/${id}`)
}
