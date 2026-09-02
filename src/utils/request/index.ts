/** @deprecated Import from `@/api/client` in new code. */
export {
  apiClient as http,
  axiosInstance as default,
  configureApiClient,
  normalizeApiError,
} from '@/api/client';
export {
  ApiError,
  isApiError,
  type ApiResponse,
  type PaginationParams,
  type PaginationResponse,
} from '@/types/api/common';
