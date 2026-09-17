# 后端服务与联调

Go/Gin 业务服务监听 8002，负责认证、商品与收藏；FastAPI 监听 8001，负责 AI JSON／SSE。先按两个服务各自的快速开始启动，再使用已提交的 `.env.integration`：

```text
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
VITE_AI_API_BASE_URL=/api/ai
VITE_API_TARGET=http://127.0.0.1:8002
VITE_AI_API_TARGET=http://127.0.0.1:8001
VITE_REQUEST_ID_ENABLED=true
VITE_PWA_ENABLED=false
```

```bash
pnpm dev:integration
```

## 需要先对齐的契约

Vite 代理只转发请求，不转换接口契约。当前完整页面链路仍需对齐以下差异：

- 登录：前端提交 `name`、读取 `token`；Gin 接收 `username`、返回 `accessToken`。
- 用户：前端请求 `/api/user/profile`；Gin 提供 `/api/user/info`。
- 商品：前端使用 `/api/products`、`/api/products/:id` 与多语言 `name`、`priceCents`；Gin 使用 `/api/product/list`、`/api/product/detail?id=…` 与 `title`、`price`。
- 前端契约包含 Project CRUD，当前 Gin Router 未注册对应路由。

## 新增功能的边界

新增收藏 GET／POST 路径与 Gin 一致，但需要 Gin 签发的 JWT 和已存在的公开商品 ID；前端 Mock Token 不能用于真实服务。AI 建议是公开 JSON 接口，可独立于登录验证。请求客户端接受真实服务响应包装，不代表完整用户会话已联通。

## 验证方式

先执行下面的接口检查，再做浏览器联调。`BUSINESS_USER_JWT` 应来自业务服务实际登录响应，账号以该服务开发配置为准，不沿用旧文档凭证。Mock E2E 通过不能证明真实数据库与双服务联调已通过。

```bash
curl -s 'http://127.0.0.1:8001/api/ai/suggestions?locale=ja-JP'
curl -s 'http://127.0.0.1:8002/api/product/favorite?id=1' \
  -H "Authorization: Bearer $BUSINESS_USER_JWT"
```

[API](./request.md) · [AI Chat](./ai-chat.md) · [Commerce](./commerce.md)
