export interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
  requestId?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type ApiErrorKind =
  | 'business'
  | 'http'
  | 'timeout'
  | 'network'
  | 'cancelled'
  | 'unknown';

export interface ApiErrorOptions {
  kind: ApiErrorKind;
  code?: number;
  status?: number;
  requestId?: string;
  details?: unknown;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly code?: number;
  readonly status?: number;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.kind = options.kind;
    this.code = options.code;
    this.status = options.status;
    this.requestId = options.requestId;
    this.details = options.details;
    if (options.cause !== undefined)
      Object.defineProperty(this, 'cause', {
        value: options.cause,
        configurable: true,
      });
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
