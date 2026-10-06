export class ApiError extends Error {
  constructor(message, options) {
    super(message)
    this.name = 'ApiError'
    this.kind = options.kind
    this.code = options.code
    this.status = options.status
    this.requestId = options.requestId
    this.details = options.details
    if (options.cause !== undefined)
      Object.defineProperty(this, 'cause', {
        value: options.cause,
        configurable: true
      })
  }
}
export function isApiError(error) {
  return error instanceof ApiError
}
