# Vue H5 Template · Vue 2

简体中文 · [English](README.en.md) · [日本語](README.ja.md)

此分支在 Vue 2.7、Vue CLI 5、Vant 2、Vue Router 3 和 Vuex 3 上运行。使用 JavaScript 单文件组件与 hash 路由，旧的 `/#/about` 链接会跳转到会员页。组件库示例使用 Vant 2。

## 本地运行

需要 Node.js 22.12+ 和 pnpm 9.15.9。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

默认地址为 `http://127.0.0.1:9020/#/home`。开发 Mock 支持任意非空用户名和密码，数据会在重启服务后重置。`pnpm serve` 保留为开发命令，`pnpm stage` 构建 staging 模式。

## 页面与状态

- 商城提供本地化商品目录、搜索、筛选、分页、详情、登录后收藏、购物车和商品管理。结算按钮演示交互。
- 示例页覆盖项目增删改查、TanStack Query、请求错误、移动布局、SVG 图标和 Vant 2。
- 会员页读取服务端资料。Vuex 管理会话和购物车，TanStack Query 管理服务端数据，AI 对话保存在当前页面。
- AI 助手支持 SSE 流式回复、停止、重试和 Markdown 展示。Markdown HTML 经 DOMPurify 净化。界面支持简体中文、英语和日语。

## API 与部署

前端 API 使用 [OpenAPI 契约](openapi/schema.yaml)。`pnpm dev:integration` 关闭 Mock，默认将 `/api/ai` 转发到 FastAPI 的 8001 端口，将其余 `/api` 转发到 Gin 的 8002 端口。在 `.env.integration.local` 中可按 [.env.example](.env.example) 覆盖目标和路径。若服务端省略前缀，可设置对应的 `VUE_APP_API_PROXY_REWRITE` 或 `VUE_APP_AI_API_PROXY_REWRITE`。

当前同级 Gin 项目采用 `/api/product/list`、`accessToken` 等接口约定，与前端契约存在差异。接入时需要通过网关或服务端适配商品、登录、项目和示例接口。开发 Mock 覆盖前端契约。生产部署 `pnpm build` 生成的 `dist/`，同时配置网关或 API 地址。服务端持有 AI 供应商凭据。

在 HTTPS 或 localhost 上部署时，可用 `VUE_APP_PWA_ENABLED=true pnpm build` 启用可安装的离线页面壳。Service Worker 预缓存本次构建的静态资源，不缓存 API 请求或响应。网络不可用时可通过 `/#/offline` 查看离线说明。
