# 请求与鉴权

## 响应约定

`src/utils/request/index.ts` 使用以下统一结构：

```ts
interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg: string
}
```

`http.get/post/put/delete<T>()` 会校验业务码并直接返回 `data`，API 模块不需要重复解包。

## 定义 API

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

接口路径相对于 `VITE_API_BASE_URL`。默认配置下，上述请求地址是 `/api/login`。

## 令牌与 401

- 请求拦截器从 `useUserStore` 读取令牌并设置 `Authorization: Bearer <token>`。
- 用户 Store 只持久化令牌，用户详情保留在内存中。
- 业务响应 `code === 401` 或 HTTP 状态 401 都会重置 Store，并通过 Vue Router 进入 `/login`。

真实项目应根据后端约定调整成功业务码、令牌头名称和错误消息展示方式。
