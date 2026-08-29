# 环境与构建

Vite 会合并 `.env` 和当前模式文件，`build/utils.ts` 再将功能开关转换为布尔值。

## 环境变量

| 变量                   | 默认值    | 说明                                |
| ---------------------- | --------- | ----------------------------------- |
| `VITE_API_BASE_URL`    | `/api`    | Axios 基础路径，也是开发代理前缀    |
| `VITE_AI_API_BASE_URL` | `/api/ai` | AI Streaming API 前缀               |
| `VITE_API_TARGET`      | 空        | 本地开发的真实后端地址              |
| `VITE_AI_API_TARGET`   | 空        | 本地 FastAPI AI 服务地址            |
| `VITE_USE_MOCK`        | `false`   | 启用 Vite Mock；开发模式设为 `true` |
| `VITE_USE_ERUDA`       | `false`   | 启用移动端调试控制台                |
| `VITE_USE_COMPRESS`    | `false`   | 生成 Gzip 文件                      |
| `VITE_USE_REPORT`      | `false`   | 生成构建产物分析报告                |
| `VITE_USE_HTTPS`       | `false`   | 启用本地 HTTPS                      |
| `VITE_PWA_ENABLED`     | `false`   | 启用 PWA                            |
| `VITE_IMAGE_OPTIMIZE`  | `false`   | 仅在生产构建优化图片                |
| `VITE_UI_FRAMEWORK`    | `vant`    | 构建期选择 Vant/NutUI/Varlet        |

## Mock 模式

`.env.development` 默认启用 Mock。登录请求访问 `/api/auth/login`，商品列表与管理访问 `/api/products` 和 `/api/admin/products`，均由 `mock/index.ts` 按真实契约响应。

## 连接真实后端

```ini
VITE_API_BASE_URL=/api
VITE_AI_API_BASE_URL=/api/ai
VITE_API_TARGET=http://localhost:8002
VITE_AI_API_TARGET=http://localhost:8001
VITE_USE_MOCK=false
```

开发服务器优先把 `/api/ai` 转发给 FastAPI，再把其他 `/api` 请求转发给 Gin。默认保留完整路径，生产网关应复用相同规则。

## 生产构建

```bash
pnpm build
```

生产环境默认关闭 Mock 和 Eruda。API 地址可以继续使用同源 `/api` 并由网关转发，也可以在部署环境覆盖 `VITE_API_BASE_URL`。
