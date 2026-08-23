# Requests and Authentication

## Response Contract

`src/utils/request/index.ts` expects:

```ts
interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg: string
}
```

`http.get/post/put/delete<T>()` checks the business code and returns `data` directly.

## Define an API

```ts
export interface LoginParams {
  name: string
  password: string
}

export interface LoginResult {
  name: string
  age: number
  token: string
}

export function loginPassword(params: LoginParams): Promise<LoginResult> {
  return http.post<LoginResult>('/login', params)
}
```

API paths are relative to `VITE_API_BASE_URL`. With the defaults, this request is sent to `/api/login`.

## Token and 401 Handling

- The request interceptor reads the user store and sets `Authorization: Bearer <token>`.
- Only the token is persisted; user details remain in memory.
- A business `code === 401` or HTTP 401 resets the store and navigates to `/login` through Vue Router.

Adapt the success code, header name, and error presentation to your backend contract.
