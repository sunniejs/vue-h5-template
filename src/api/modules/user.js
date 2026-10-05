import { apiClient } from '@/api/client';
/**
 * @param {AbortSignal} [signal]
 * @returns {Promise<import('../../types/api/generated').components['schemas']['UserProfile']>}
 */
export function getUserProfile(signal) {
  return apiClient.get('/user/profile', { signal });
}
