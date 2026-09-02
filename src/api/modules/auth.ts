import { apiClient } from '@/api/client';
import type { components } from '@/types/api/generated';

export type LoginParams = components['schemas']['LoginRequest'];
export type LoginResult = components['schemas']['LoginResult'];

export function loginPassword(params: LoginParams): Promise<LoginResult> {
  return apiClient.post<LoginResult, LoginParams>('/auth/login', params);
}
