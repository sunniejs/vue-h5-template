# クイックスタート

Node.js 20.10 以上と pnpm 9.12 以上を使用します。Lockfile は `pnpm-lock.yaml` だけです。

```bash
git clone https://github.com/sunniejs/vue-h5-template.git
cd vue-h5-template
pnpm install
pnpm dev
```

`pnpm dev` は Mock API を使います。実バックエンド連携は PostgreSQL、Gin、FastAPI、Redis を Compose で起動し、`pnpm dev:integration` を実行します。

主なコマンド：`pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm test:e2e`、`pnpm build`、`pnpm check`、`pnpm api:generate`。

