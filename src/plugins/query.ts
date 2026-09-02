import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import type { VueQueryPluginOptions } from '@tanstack/vue-query';
import type { App } from 'vue';
import { isApiError } from '@/types/api/common';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (
          isApiError(error) &&
          error.status &&
          error.status >= 400 &&
          error.status < 500
        )
          return false;
        return failureCount < 2;
      },
    },
    mutations: { retry: false },
  },
});

export function setupVueQuery(app: App) {
  const options: VueQueryPluginOptions = { queryClient };
  app.use(VueQueryPlugin, options);
}
