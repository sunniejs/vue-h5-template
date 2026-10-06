import axios from 'axios'
import { ApiError } from '@/types/api/common'
const runtime = {}
export function configureApiClient(config) {
  Object.assign(runtime, config)
}
function createRequestId() {
  return globalThis.crypto?.randomUUID?.() ?? `req-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
function isCurrentSession(config) {
  const token = runtime.getAccessToken?.()
  return config?.headers.get('Authorization') === (token ? `Bearer ${token}` : undefined)
}
function isApiResponse(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'number' &&
    Number.isInteger(value.code) &&
    'data' in value &&
    (!('msg' in value) || typeof value.msg === 'string') &&
    (!('message' in value) || typeof value.message === 'string') &&
    (!('requestId' in value) || typeof value.requestId === 'string')
  )
}
export function normalizeApiError(error) {
  if (error instanceof ApiError) return error
  if (!axios.isAxiosError(error)) {
    return new ApiError(error instanceof Error ? error.message : 'Unknown error', { kind: 'unknown', cause: error })
  }
  const axiosError = error
  if (axiosError.code === 'ERR_CANCELED')
    return new ApiError('Request cancelled', {
      kind: 'cancelled',
      cause: error
    })
  if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
    return new ApiError('Request timed out', { kind: 'timeout', cause: error })
  }
  if (!axiosError.response)
    return new ApiError('Network unavailable', {
      kind: 'network',
      cause: error
    })
  const { status, data, headers } = axiosError.response
  return new ApiError(data?.msg || data?.message || axiosError.message || `HTTP ${status}`, {
    kind: 'http',
    code: data?.code,
    status,
    requestId: data?.requestId ?? headers['x-request-id'],
    details: data,
    cause: error
  })
}
export const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 15_000,
  withCredentials: false
})
axiosInstance.interceptors.request.use(config => {
  const token = runtime.getAccessToken?.()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  if (process.env.VUE_APP_REQUEST_ID_ENABLED === 'true' && !config.headers.has('X-Request-ID')) {
    config.headers.set('X-Request-ID', createRequestId())
  }
  return config
})
axiosInstance.interceptors.response.use(
  response => {
    const payload = response.data
    if (!isApiResponse(payload))
      return Promise.reject(
        new ApiError('Invalid API response', {
          kind: 'unknown',
          status: response.status,
          requestId: response.headers['x-request-id'],
          details: payload
        })
      )
    if (payload.code !== 0 && (payload.code < 200 || payload.code >= 300)) {
      const error = new ApiError(payload.msg || payload.message || 'Request failed', {
        kind: 'business',
        code: payload.code,
        status: response.status,
        requestId: payload.requestId,
        details: payload
      })
      if (payload.code === 401 && isCurrentSession(response.config)) void runtime.onUnauthorized?.()
      return Promise.reject(error)
    }
    return response
  },
  error => {
    const apiError = normalizeApiError(error)
    if (apiError.status === 401 && axios.isAxiosError(error) && isCurrentSession(error.config))
      void runtime.onUnauthorized?.()
    return Promise.reject(apiError)
  }
)
function unwrap(request) {
  return request.then(response => response.data.data)
}
export const apiClient = {
  get(url, config) {
    return unwrap(axiosInstance.get(url, config))
  },
  post(url, data, config) {
    return unwrap(axiosInstance.post(url, data, config))
  },
  put(url, data, config) {
    return unwrap(axiosInstance.put(url, data, config))
  },
  patch(url, data, config) {
    return unwrap(axiosInstance.patch(url, data, config))
  },
  delete(url, config) {
    return unwrap(axiosInstance.delete(url, config))
  }
}
