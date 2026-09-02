import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError } from '@/types/api/common';
import type { ApiResponse } from '@/types/api/common';

interface ApiClientRuntime {
  getAccessToken?: () => string | undefined;
  onUnauthorized?: () => unknown;
}

const runtime: ApiClientRuntime = {};

export function configureApiClient(config: ApiClientRuntime) {
  Object.assign(runtime, config);
}

function createRequestId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `req-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!axios.isAxiosError(error)) {
    return new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      { kind: 'unknown', cause: error },
    );
  }

  const axiosError = error as AxiosError<Partial<ApiResponse<unknown>>>;
  if (axiosError.code === 'ERR_CANCELED')
    return new ApiError('Request cancelled', {
      kind: 'cancelled',
      cause: error,
    });
  if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
    return new ApiError('Request timed out', { kind: 'timeout', cause: error });
  }
  if (!axiosError.response)
    return new ApiError('Network unavailable', {
      kind: 'network',
      cause: error,
    });

  const { status, data, headers } = axiosError.response;
  return new ApiError(data?.msg || axiosError.message || `HTTP ${status}`, {
    kind: 'http',
    code: data?.code,
    status,
    requestId: data?.requestId ?? headers['x-request-id'],
    details: data,
    cause: error,
  });
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = runtime.getAccessToken?.();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  if (
    import.meta.env.VITE_REQUEST_ID_ENABLED &&
    !config.headers.has('X-Request-ID')
  ) {
    config.headers.set('X-Request-ID', createRequestId());
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const payload = response.data;
    if (payload.code < 200 || payload.code >= 300) {
      const error = new ApiError(payload.msg || 'Request failed', {
        kind: 'business',
        code: payload.code,
        status: response.status,
        requestId: payload.requestId,
        details: payload,
      });
      if (payload.code === 401) void runtime.onUnauthorized?.();
      return Promise.reject(error);
    }
    return response;
  },
  (error: unknown) => {
    const apiError = normalizeApiError(error);
    if (apiError.status === 401) void runtime.onUnauthorized?.();
    return Promise.reject(apiError);
  },
);

function unwrap<T>(
  request: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> {
  return request.then((response) => response.data.data);
}

export const apiClient = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return unwrap(axiosInstance.get<ApiResponse<T>>(url, config));
  },
  post<T, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ) {
    return unwrap(
      axiosInstance.post<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, TBody>(
        url,
        data,
        config,
      ),
    );
  },
  put<T, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ) {
    return unwrap(
      axiosInstance.put<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, TBody>(
        url,
        data,
        config,
      ),
    );
  },
  patch<T, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ) {
    return unwrap(
      axiosInstance.patch<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, TBody>(
        url,
        data,
        config,
      ),
    );
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return unwrap(axiosInstance.delete<ApiResponse<T>>(url, config));
  },
};
