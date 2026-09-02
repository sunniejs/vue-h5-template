# Vue H5 Template v2

面向真实移动 H5 业务的 Vue 3 工程模板。v2 不是组件库 Playground：它提供类型安全请求、OpenAPI 类型生成、TanStack Query、可中止的 Streaming AI Chat、PWA、SVG Sprite、production 图片优化、单选 UI 框架以及有意义的测试基线。

[在线文档（简体中文）](https://sunniejs.github.io/vue-h5-template/) · [English docs](https://sunniejs.github.io/vue-h5-template/en/) · [日本語ドキュメント](https://sunniejs.github.io/vue-h5-template/ja/) · [迁移到 v2](https://sunniejs.github.io/vue-h5-template/guide/migration-v2)

## 核心能力

- Vue 3.5、Vite 8 / Rolldown、TypeScript 5.9、Vue Router 4、Pinia 3
- `@tanstack/vue-query` 管理 Server State，Pinia 只管理 Client State
- Axios Type-safe Client：`ApiResponse<T>`、`ApiError`、Request ID、Token、401、Timeout 与 Network Error
- `pnpm api:generate` 从本地 OpenAPI Schema 生成后端契约类型
- AI Chat：POST SSE、`ReadableStream`、`AbortController`、Regenerate、Retry、Markdown、代码块与 DOMPurify
- 真实商城：12+ 三语商品、搜索分类、下拉刷新、分页加载、详情、购物车与商品管理
- 交付项目管理：查看、新建、编辑、删除和状态筛选，Vite Mock / Gin + PostgreSQL 共用契约
- SVG Sprite：`src/assets/icons` 自动加载及类型化 `<SvgIcon />`
- Vant / NutUI / Varlet 构建期单选，不把三套 UI 同时放入 production graph
- 可选 PWA；Service Worker 只缓存 App Shell 和静态图片，不默认缓存 API
- Sharp + SVGO 仅在 production build 按开关优化 png/jpeg/webp/svg
- Vitest + Vue Test Utils + Playwright；当前核心逻辑 line coverage 81.31%
- 克制的响应式 Design System：统一 typography、spacing、radius、color、control 和 motion tokens，移动端底栏在桌面自动切换为紧凑顶栏
- 中文、English、日本語三语懒加载，正文、导航和页面标题响应式同步
- ESLint、Prettier、Stylelint、Husky、lint-staged、Commitlint、GitHub Actions 与 Release Please

## 快速开始

要求 Node.js `>=22.12.0`、pnpm `>=9.12.0`。

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

开发环境默认启用 Mock，登录可以输入任意非空用户名和密码。底部第三个标签是工程示例；右下角 AI 悬浮入口打开 `/ai/chat`，Mock Server 会从 `POST /api/ai/chat` 逐 chunk 返回 SSE。

可直接访问 `/shop`、`/shop/cart`、`/examples/request` 和 `/examples/workspace`。请求示例包含 400/401/403/404/409、业务 422、500 和 timeout；交付项目页在 Mock 与真实后端两种模式下都支持完整增删改查。

## 常用命令

```bash
pnpm lint             # ESLint + Stylelint
pnpm typecheck        # vue-tsc project references
pnpm test             # Vitest unit/component tests
pnpm test:coverage    # 60%+ core coverage gate
pnpm test:e2e         # Playwright 核心流程、响应式和 dark mode
pnpm build            # production build
pnpm check            # lint + typecheck + test + build
pnpm api:generate     # OpenAPI -> TypeScript
```

`pnpm check` 默认不含 E2E，避免每次本地提交都启动浏览器；CI 在 `check` 之后单独运行 Playwright。

## 目录边界

```text
src/
├── api/                 # Axios client 与按业务域拆分的 API modules
├── components/          # 可复用、无页面路由职责的 UI
├── composables/         # Vue 生命周期/响应式编排
├── layout/              # App Shell、导航、safe-area
├── plugins/             # Vue Query 等 App 插件
├── router/              # 显式路由表、meta 类型与守卫
├── services/            # Provider/transport 等框架无关业务服务
├── store/               # Pinia client state
├── types/               # API、AI、Icon 领域类型
├── utils/               # 无 Vue 生命周期的纯函数
└── views/               # 懒加载页面
```

完整规则见 [`AGENTS.md`](./AGENTS.md)。该文件也是 Codex、Claude Code、Cursor 和 Copilot 的首要工程上下文。

## 状态管理

- Pinia：登录会话、购物车、主题、Feature Flags 等客户端状态。
- TanStack Query：远程数据、缓存、重试、取消、Mutation、Pagination 与 Infinite Query。
- AI 对话：由 `useStreamingChat` 编排会话生命周期；Provider 传输协议位于 `services/ai`，不放进 Pinia 或 Query Cache。

## API 与 OpenAPI

页面不直接调用 Axios，也不写 `catch (error: any)`。在 `src/api/modules` 增加函数，在页面/Query composable 中消费，并用 `isApiError` 收窄错误。

替换后端 Schema：

1. 用真实 `openapi.yaml` 替换 `openapi/schema.yaml`，或修改 `api:generate` 的输入 URL；
2. 运行 `pnpm api:generate`；
3. API module 从 `src/types/api/generated.d.ts` 引用 schema；
4. 提交 Schema 与生成文件，让 CI 的 typecheck 检查契约漂移。

## AI Provider

模板采用轻量、供应商无关的接口：

```ts
interface ChatProvider {
  chat(
    messages: readonly ChatMessage[],
    options?: ChatOptions,
  ): AsyncIterable<ChatChunk>;
}
```

默认 `FetchStreamChatProvider` 解析标准 SSE。真实项目应让服务端代理 OpenAI、Claude、Gemini 或 DeepSeek，不要把供应商密钥放在 `VITE_*` 环境变量或浏览器请求中。若后端使用 Vercel AI SDK data stream protocol，可新增 Provider adapter，无需重写页面状态机。

## UI 框架单选

```env
VITE_UI_FRAMEWORK=vant # vant | nutui | varlet
```

Vite 会同时选择对应 resolver 和 `#ui-demo` 别名。三套依赖留在模板中供创建项目时选择，但 production bundle 只包含当前值对应的框架。未来 `create-vue-h5-template` CLI 可以在生成阶段删除另外两套依赖。

每套框架示例都包含 Button、Cell/List、Switch、Tag/Chip 与 Progress，不再只是单按钮占位。

## 国际化

`src/locales/langs` 内置 `zh-CN`、`en-US`、`ja-JP`。首页语言选择器会懒加载语言包，并同步更新页面正文、底部导航、Router title、`document.title` 和 `<html lang>`。新增语言时还需要加入 `SUPPORTED_LOCALES`，并保持 `common.json` 键结构一致。

## 配套后端

后端已从前端仓库拆分，并整理为两个独立 Git 仓库：`gin-service-template`（建议 GitHub 仓库名 `vue-h5-template-business-service`）负责认证、用户、交付项目、商品业务和 PostgreSQL；`fastapi-service-template`（建议仓库名 `vue-h5-template-ai-service`）负责 AI Provider、POST SSE 和 Redis 限流。上层目录只负责本地 Compose 联调。

```bash
# 终端 1：启动 PostgreSQL + Gin + FastAPI + Redis
cd <workspace>/backend/vue-h5-template
docker compose up --build

# 终端 2：使用已提交的 .env.integration 启动真实联调模式
cd <workspace>/frontend/vue-h5-template
pnpm dev:integration
```

访问 Vite 输出的地址，使用 `demo / demo1234` 登录。`/shop` 读取公开商品，`/shop/admin/products` 提供三语商品管理，`/examples/workspace` 提供交付项目的完整增删改查，`/ai/chat` 把同一个 JWT 随 SSE 请求发送给 FastAPI。也可在后端目录运行 `python3 scripts/smoke.py` 自动验证 Vue 代理 → Gin 业务接口 → PostgreSQL → FastAPI SSE。

默认 `pnpm dev` 仍使用前端 Mock，不要求安装后端。Compose 默认数据库连接是 `localhost:5432 / vue_h5_business / vue_h5 / vue_h5_local`，可直接加入 DataGrip；这些凭证仅供本地使用。两个后端仓库的 `docs` 分支和前端 `docs` 分支都提供中、英、日开发文档。AI 密钥只放 FastAPI 服务，不进入任何 `VITE_*` 变量。

## PWA 与图片优化

```env
VITE_PWA_ENABLED=false
VITE_IMAGE_OPTIMIZE=true
```

PWA 默认关闭。开启后会缓存构建 App Shell 与静态图片，`/api` 被明确排除。图片优化仅在 production build 运行；若图片已经由 CDN image pipeline 处理，可关闭以缩短 CI。

## 浏览器与安全基线

目标为 iOS Safari 15+、Android Chrome 80+、微信与企业微信的现代 WebView，不为 IE 或极老 Android 注入整包 polyfill。Markdown 禁止原始 HTML并经过 DOMPurify；Redirect 仅接受站内绝对路径；Mock 生产默认关闭；鉴权 Token 示例使用 `sessionStorage`。生产项目优先采用 SameSite + Secure + HttpOnly Cookie/BFF，并在网关配置 CSP、CSRF 和速率限制。

## 文档与发布

架构、后端联调、商城、请求、状态、AI Chat、UI、测试、部署和 v2 迁移文档维护在仓库 `docs` 分支，并提供中文、英文和日文同步内容。合并 Conventional Commits 后，Release Please 自动维护版本、CHANGELOG 与 GitHub Release。

本轮完整决策、性能数据、Breaking Changes 和后续路线见 [`V2_UPGRADE_REPORT.md`](./V2_UPGRADE_REPORT.md)。

## Roadmap

- P0 已实现：Auth 基线、路由权限、错误边界、网络状态、深色系统主题、懒路由、安全 Markdown、PWA/API 缓存隔离、依赖/提交/测试基线。
- P1 推荐按业务引入：Gateway/JWKS 身份、自动导出 Gin OpenAPI、数据库备份/回滚、Feature Flags、Analytics/Error Reporting adapter、Upload、Virtual List、WebView Bridge、Performance Monitoring、显式主题切换。
- P2 可选：QR/Camera/Web Share、Deep Link、SSR/SSG、CDN external、原生 App Bridge。它们依赖产品与部署环境，不应成为模板默认负担。

## License

[MIT](./License)
