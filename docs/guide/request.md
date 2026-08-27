# 请求与 OpenAPI

## 调用链

```text
View / Query composable
  -> src/api/modules/*.ts
  -> apiClient
  -> Axios interceptor
  -> ApiResponse<T> / ApiError
```

页面不得直接导入 Axios。模块函数负责 URL、参数和返回类型；页面用 `isApiError(error)` 收窄未知错误。

## 类型

- `ApiResponse<T>`：后端统一响应体。
- `ApiError`：`business | http | timeout | network | cancelled | unknown`。
- `PaginationParams` / `PaginationResponse<T>`：分页契约。

请求拦截器按需加入 Bearer Token 和 `X-Request-ID`。响应拦截器区分业务错误与 HTTP 错误；401 通过运行时 handler 清理会话并跳转，不让 client 直接导入 Router。

## OpenAPI

仓库带有 `openapi/schema.yaml`：

```bash
pnpm api:generate
```

生成结果为 `src/types/api/generated.d.ts`。真实项目替换 Schema 或命令输入地址后，应提交 Schema 与生成文件，并在 CI 运行 typecheck。不要手工修改生成文件。

## 安全

`VITE_*` 会进入浏览器产物，禁止放 API 密钥。示例 Token 使用 `sessionStorage`；生产优先使用 SameSite、Secure、HttpOnly Cookie/BFF。重定向只接受以单 `/` 开头的站内路径。
