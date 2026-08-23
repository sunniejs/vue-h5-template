# 环境与构建

Vite 会合并 `.env` 和当前模式文件，`build/utils.ts` 再将功能开关转换为布尔值。

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Axios 基础路径，也是开发代理前缀 |
| `VITE_API_TARGET` | 空 | 本地开发的真实后端地址 |
| `VITE_USE_MOCK` | `false` | 启用 Vite Mock；开发模式设为 `true` |
| `VITE_USE_ERUDA` | `false` | 启用移动端调试控制台 |
| `VITE_USE_COMPRESS` | `false` | 生成 Gzip 文件 |
| `VITE_USE_REPORT` | `false` | 生成构建产物分析报告 |
| `VITE_USE_HTTPS` | `false` | 启用本地 HTTPS |
| `VITE_USE_PWA` | `false` | 启用 PWA |

## Mock 模式

`.env.development` 默认启用 Mock。示例登录请求最终访问 `/api/login`，由 `mock/index.ts` 响应。

## 连接真实后端

```ini
VITE_API_BASE_URL=/api
VITE_API_TARGET=http://localhost:8080
VITE_USE_MOCK=false
```

开发服务器会把 `/api/users` 转发为 `http://localhost:8080/users`。如果后端需要保留 `/api` 前缀，请调整 `build/vite/proxy.ts` 中的 `rewrite`。

## 生产构建

```bash
pnpm build
```

生产环境默认关闭 Mock 和 Eruda。API 地址可以继续使用同源 `/api` 并由网关转发，也可以在部署环境覆盖 `VITE_API_BASE_URL`。
