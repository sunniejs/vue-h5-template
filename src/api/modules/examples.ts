import { apiClient } from '@/api/client';
import type { PaginationResponse } from '@/types/api/common';
import type { components } from '@/types/api/generated';

export type Task = components['schemas']['Task'];
export type FeedItem = components['schemas']['FeedItem'];

export function getTasks(signal?: AbortSignal): Promise<Task[]> {
  return apiClient.get<Task[]>('/examples/tasks', { signal });
}

export function toggleTask(id: number): Promise<Task> {
  return apiClient.post<Task>(`/examples/tasks/${id}/toggle`);
}

export function getFeed(
  cursor = 0,
  limit = 6,
  signal?: AbortSignal,
): Promise<PaginationResponse<FeedItem>> {
  return apiClient.get<PaginationResponse<FeedItem>>('/examples/feed', {
    params: { cursor, limit },
    signal,
  });
}
