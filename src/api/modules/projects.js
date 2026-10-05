import { apiClient } from '@/api/client';
export function getProjects(params = {}, signal) {
  return apiClient.get('/projects', {
    params,
    signal,
  });
}
/**
 * @param {number} id
 * @param {AbortSignal} [signal]
 * @returns {Promise<import('../../types/api/generated').components['schemas']['Project']>}
 */
export function getProject(id, signal) {
  return apiClient.get(`/projects/${id}`, { signal });
}
/**
 * @param {import('../../types/api/generated').components['schemas']['ProjectInput']} input
 */
export function createProject(input) {
  return apiClient.post('/projects', input);
}
/**
 * @param {number} id
 * @param {import('../../types/api/generated').components['schemas']['ProjectUpdateInput']} input
 */
export function updateProject(id, input) {
  return apiClient.patch(`/projects/${id}`, input);
}
export function deleteProject(id) {
  return apiClient.delete(`/projects/${id}`);
}
