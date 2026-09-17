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

`src/api/modules/projects.ts` 定义项目 CRUD 的前端契约；当前 Gin 未注册对应 Project 路由。`/examples/workspace` 使用 TanStack Query 管理分页列表和 Mutation，页面不保存 Server State。统一响应的 `code` 接受整个 2xx 区间，因此 HTTP 201 创建响应仍能正确解包。

## OpenAPI

仓库带有包含 Gin 业务接口与 FastAPI Streaming 契约的 `openapi/schema.yaml`：

```bash
pnpm api:generate
```

生成结果为 `src/types/api/generated.d.ts`。真实项目替换 Schema 或命令输入地址后，应提交 Schema 与生成文件，并在 CI 运行 typecheck。不要手工修改生成文件。

## 安全

`VITE_*` 会进入浏览器产物，禁止放 API 密钥。示例 Token 使用 `sessionStorage`；生产优先使用 SameSite、Secure、HttpOnly Cookie/BFF。重定向只接受以单 `/` 开头的站内路径。

## REST 契约与请求取消

单应用请求客户端同时接受真实服务的 `code: 0`／`message` 和旧 Mock 的 2xx 业务码／`msg`，统一解包 `data`，失败仍为 `ApiError`。HTTP 2xx 不等于业务成功。

以下函数直接返回解包后的数据，并通过 `ApiError` 拒绝失败请求。读取操作应转发 Query 的 `AbortSignal`。收藏写入使用 bootstrap 统一配置的登录客户端，不接受调用方提供的用户 ID。

单应用通过 `VITE_AI_API_BASE_URL`（默认 `/api/ai`）请求建议，通过 `VITE_AI_API_TARGET` 配置开发代理；常规业务请求发往 Gin。JSON 请求位于 `src/api/modules/ai.ts`，流式协议仍由 Provider/composable 管理。

响应包装兼容不会自动转换路径或业务字段。单应用商品模块仍使用 `/api/products` 与多语言 `name`／`priceCents`，当前 Gin 商品接口为 `/api/product/list` 与 `title`／`price`；登录也存在 `name`／`token` 与 `username`／`accessToken` 的差异。完整联调前需要核对其余契约或增加明确的领域适配。新增收藏路径已与 Gin 对齐，但鉴权仍需要兼容的已签发 JWT。
