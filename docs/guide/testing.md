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

Vitest + Vue Test Utils 覆盖 URL/Redirect、请求错误、API modules、user Store、SSE parser、streaming composable、安全 Markdown、Login Form 和 Chat Composer。核心范围门槛为 lines/statements/functions 60%，branches 50%；v2 实测 lines 72.25%。

Playwright 使用 Pixel 7 配置覆盖 Home、三语言切换、Login、Mock API、AI Streaming/Stop 与 401 Redirect。后端工作区的 `scripts/smoke.py` 额外通过真实 Vue 代理验证 Gin 登录/Project CRUD 和 FastAPI 鉴权 SSE。

后端质量门禁分别为 FastAPI 的 Ruff + mypy + pytest，以及 Gin 的 `go test ./...` + `go vet ./...`。后端工作区自带独立 GitHub Actions 配置。

## 原则

测试公共行为，不测试无意义的 getter 或静态文案。协议解析、鉴权、错误和取消属于高风险公共逻辑；修改它们必须加单元测试。路由、Mock、登录和 Streaming 的关键链路必须有 E2E。

GitHub Actions 使用 pnpm cache，只安装一次依赖，先运行 `check`，再安装 Chromium 并运行 E2E。
