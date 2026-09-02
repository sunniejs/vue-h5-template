import { apiClient } from '@/api/client';
import type { components } from '@/types/api/generated';

export type UserProfile = components['schemas']['UserProfile'];

export function getUserProfile(signal?: AbortSignal): Promise<UserProfile> {
  return apiClient.get<UserProfile>('/user/profile', { signal });
}
