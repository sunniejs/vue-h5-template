# 后端服务与本地联调

## 为什么拆成两个仓库

后端按运行时和扩缩容特征拆分，适合分别发布到 GitHub：

- `vue-h5-template-business-service`：Gin + PostgreSQL，负责登录、用户、Project 与商品 CRUD。
- `vue-h5-template-ai-service`：FastAPI + Redis，负责 AI Provider、鉴权 SSE 和限流。

两者语言、依赖、CI 和部署节奏不同。它们只共享 JWT 协议，不应互相导入代码。上层 `vue-h5-template` 目录仅作为本地 Compose 编排，不需要成为第三个仓库。两个后端仓库的 `docs` 分支均有中、英、日开发文档。

## 启动完整环境

```bash
cd /Users/fong/Workspace/personal/backend/vue-h5-template
docker compose up --build -d
docker compose ps

cd /Users/fong/Workspace/personal/frontend/vue/vue-h5-template/vue-h5-template
pnpm install
pnpm dev:integration
```

打开终端输出的地址，使用演示账号 `demo` / `demo1234`。`/shop` 是公开商城；登录后可进入 `/shop/admin/products`；`/ai/chat` 使用 FastAPI SSE。

端到端检查：

```bash
cd /Users/fong/Workspace/personal/backend/vue-h5-template
SMOKE_BASE_URL=http://127.0.0.1:5173 python3 scripts/smoke.py
```

脚本验证 Vue 代理、Gin 登录与商品 CRUD、PostgreSQL 持久化，以及 FastAPI 鉴权 Streaming，并清理临时记录。

## PostgreSQL 与 DataGrip

Compose 默认启动 PostgreSQL 17，数据库连接是：

```text
Host: localhost
Port: 5432
Database: vue_h5_business
User: vue_h5
Password: vue_h5_local
```

在 DataGrip 新建 PostgreSQL 数据源并下载官方 JDBC Driver。通过 Schemas 面板可以查看 `products`、`users`、`projects` 和 `schema_migrations`。这些密码仅用于本地 Compose，生产必须更换。

## 停止与数据

```bash
docker compose stop
docker compose down
```

上述命令不会删除 PostgreSQL Volume。只有明确需要清空本地数据时才执行 `docker compose down -v`，该操作不可恢复。

