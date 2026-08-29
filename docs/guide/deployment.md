# 部署

## 构建

```bash
pnpm check
pnpm build
```

产物位于 `dist`。Dockerfile 使用 Nginx，并通过 `try_files` 回退 `index.html` 以支持 history router。

## 环境能力

- `VITE_PWA_ENABLED=true`：生成 manifest 与 Service Worker。
- `VITE_IMAGE_OPTIMIZE=true`：production 用 Sharp/SVGO 优化图片。
- `VITE_USE_COMPRESS=true`：额外生成 `.gz`；CDN 已压缩时可关闭。
- `VITE_USE_REPORT=true`：生成 bundle report，不应在常规 CI 自动打开浏览器。

PWA 不缓存 `/api`。若业务确实需要离线数据，应按公开、无敏感、可失效的资源逐项设计 NetworkFirst/StaleWhileRevalidate，不能把认证 API 整体 CacheFirst。

## 本地真实联调

```bash
cd /Users/fong/Workspace/personal/backend/vue-h5-template
docker compose up --build

cd /Users/fong/Workspace/personal/frontend/vue/vue-h5-template/vue-h5-template
pnpm dev:integration
```

使用 `demo / demo1234` 登录。`.env.integration` 将 `/api` 转发到 Gin 8002，将 `/api/ai` 优先转发到 FastAPI 8001。后端目录的 `python3 scripts/smoke.py` 会通过 Vue 代理验证登录、商品 CRUD、PostgreSQL 持久化和 SSE 链路。

Gin 的本地集成与生产默认使用 PostgreSQL 17，并用 `schema_migrations` 保存版本；SQLite 只保留给快速、隔离的单元测试。两个后端必须共享 JWT secret、issuer 和 audience，供应商密钥只存在 FastAPI。

## AI Streaming

Nginx/CDN 对 SSE endpoint 必须关闭缓冲与变换、延长 read timeout，并保持 chunked response。供应商 API Key 只存在服务端。若代理平台不支持 POST SSE，可改为 fetch ReadableStream/NDJSON Provider，保持 `ChatProvider` 接口。

## 安全 Headers

模板 Nginx 提供 frame、MIME、referrer 和 permissions 基线。生产 CSP 必须结合真实 API、图片 CDN、监控域名配置；启用 PWA 时允许同源 worker。不要继续使用已废弃的 `X-XSS-Protection` 代替 CSP。
