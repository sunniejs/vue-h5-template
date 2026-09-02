import { apiClient } from '@/api/client';

export type RequestErrorScenario =
  | 'bad-request'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'validation'
  | 'server-error'
  | 'timeout';

export function triggerRequestError(
  scenario: RequestErrorScenario,
): Promise<unknown> {
  return apiClient.get(
    `/examples/${scenario}`,
    scenario === 'timeout' ? { timeout: 100 } : undefined,
  );
}
