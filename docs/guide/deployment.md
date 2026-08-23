# 部署

## 静态构建

```bash
pnpm build
```

产物输出到 `dist`。项目使用 history 路由，静态服务器必须把未匹配的前端路径回退到 `index.html`。

## Docker

```bash
docker build -t vue-h5-template .
docker run --rm -p 8080:80 vue-h5-template
```

`Dockerfile` 使用 Nginx Alpine 镜像，并复制仓库中的 `nginx.conf`。

## API 转发

示例 Nginx 配置主要负责静态文件和 history 回退。生产 API 地址、TLS、CSP、HSTS 与缓存策略依赖实际域名和网关架构，应在部署环境中配置，不建议直接硬编码到通用模板。

## 可选构建能力

```ini
VITE_USE_COMPRESS=true
VITE_USE_REPORT=true
VITE_USE_PWA=true
```

- Gzip 文件需要服务器配置对应的静态压缩响应。
- 构建分析报告用于定位包体积，不应作为部署文件公开。
- 启用 PWA 前应替换应用名称、图标和缓存策略。
