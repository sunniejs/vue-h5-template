import { apiClient } from '@/api/client';
/**
 * @param {import('../../types/api/generated').components['schemas']['LoginRequest']} params
 * @param {AbortSignal} [signal]
 * @returns {Promise<import('../../types/api/generated').components['schemas']['LoginResult']>}
 */
export function loginPassword(params, signal) {
  return apiClient.post('/auth/login', params, {
    signal,
  });
}
