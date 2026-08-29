# バックエンド連携

バックエンドは独立した2リポジトリです。

- `vue-h5-template-business-service`: Gin + PostgreSQL。認証、プロフィール、Project、商品 CRUD。
- `vue-h5-template-ai-service`: FastAPI + Redis。AI Provider、認証付き SSE、レート制限。

親ディレクトリはローカル Compose 用で、第三の Git リポジトリにはしません。各サービスの `docs` ブランチにも中英日ガイドがあります。

```bash
cd /Users/fong/Workspace/personal/backend/vue-h5-template
docker compose up --build -d

cd /Users/fong/Workspace/personal/frontend/vue/vue-h5-template/vue-h5-template
pnpm dev:integration
```

デモアカウントは `demo` / `demo1234` です。DataGrip は Host `localhost`、Port `5432`、Database `vue_h5_business`、User `vue_h5`、Password `vue_h5_local` で接続できます。これはローカル専用です。

`SMOKE_BASE_URL=http://127.0.0.1:5173 python3 scripts/smoke.py` で Vue Proxy、Gin、PostgreSQL、FastAPI SSE をまとめて検証できます。

