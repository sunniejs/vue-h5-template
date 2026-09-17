# 测试与质量

## 命令

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm build
pnpm check
```

`check` 执行 lint、typecheck、Vitest、build；E2E 因浏览器成本在 CI 中单独运行。

## 当前覆盖

Vitest + Vue Test Utils 覆盖 URL/Redirect、请求错误、API modules、user Store、SSE parser、streaming composable、安全 Markdown、Login Form 和 Chat Composer。核心范围门槛为 lines/statements/functions 60%，branches 50%；具体覆盖率以当前 `pnpm test:coverage` 输出为准，不代表整个应用的覆盖率。

Playwright 使用 Pixel 7 配置覆盖 Home、三语言切换、商城列表与详情、Login 空值隐私检查、Mock API、AI Streaming/Stop 与 401 Redirect。真实服务验证需先完成登录／商品契约适配，再分别配置数据库与 AI 环境；Mock E2E 不能替代真实联调。

后端质量门禁分别为 FastAPI 的 Ruff + mypy + pytest，以及 Gin 的 `go test ./...` + `go vet ./...`。后端工作区自带独立 GitHub Actions 配置。

## 原则

测试公共行为，不测试无意义的 getter 或静态文案。协议解析、鉴权、错误和取消属于高风险公共逻辑；修改它们必须加单元测试。路由、Mock、登录和 Streaming 的关键链路必须有 E2E。

GitHub Actions 使用 pnpm cache，只安装一次依赖，先运行 `check`，再安装 Chromium 并运行 E2E。

## 新增功能回归检查

API 测试覆盖 ID、请求体、取消信号、语言归一化、AI base URL 和失败传递。收藏组件测试覆盖未登录、保存与取消、读取重试、写入失败及切换账号后的旧写入；流式 composable 测试覆盖停止、取消和并发生命周期；远程建议与本地回退由下方浏览器测试验证。每个测试独立创建并清理 QueryClient。

```bash
pnpm test tests/api/features.test.ts tests/api/client.test.ts tests/components/FavoriteButton.test.ts
pnpm test:coverage
pnpm test:e2e
```

Playwright 验证收藏刷新保持、取消收藏、远程建议以及请求失败后的本地回退。流式测试通过输入框提交固定问题，不依赖建议文案。以上属于开发 Mock 验证；PostgreSQL/Redis 集成需要单独配置环境。

以下应用测试命令应在应用分支的工作区执行，不能在本 `docs` 分支执行。文档工作区通过 `pnpm build` 验证 VitePress。验证结果应以当前命令输出为准。
