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

Playwright 使用 Pixel 7 配置覆盖 Home、Login、Mock API、AI Streaming/Stop 与 401 Redirect。

## 原则

测试公共行为，不测试无意义的 getter 或静态文案。协议解析、鉴权、错误和取消属于高风险公共逻辑；修改它们必须加单元测试。路由、Mock、登录和 Streaming 的关键链路必须有 E2E。

GitHub Actions 使用 pnpm cache，只安装一次依赖，先运行 `check`，再安装 Chromium 并运行 E2E。
