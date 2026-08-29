# Backend Services and Local Integration

## Why there are two repositories

Backend workloads are split by runtime and scaling profile:

- `vue-h5-template-business-service`: Gin + PostgreSQL for login, profiles, projects, and product CRUD.
- `vue-h5-template-ai-service`: FastAPI + Redis for AI providers, authenticated SSE, and quotas.

Their languages, dependencies, CI, and release cycles differ. They share a JWT contract but no source imports. The parent backend directory is local Compose orchestration, not a third repository. Each backend repository has Chinese, English, and Japanese guides on its `docs` branch.

## Start the complete stack

```bash
cd /Users/fong/Workspace/personal/backend/vue-h5-template
docker compose up --build -d
docker compose ps

cd /Users/fong/Workspace/personal/frontend/vue/vue-h5-template/vue-h5-template
pnpm install
pnpm dev:integration
```

Open the URL printed by Vite and sign in with `demo` / `demo1234`. `/shop` is public, `/shop/admin/products` provides authenticated administration, and `/ai/chat` streams through FastAPI.

```bash
cd /Users/fong/Workspace/personal/backend/vue-h5-template
SMOKE_BASE_URL=http://127.0.0.1:5173 python3 scripts/smoke.py
```

The smoke test verifies the Vue proxy, Gin login and product CRUD, PostgreSQL persistence, and authenticated FastAPI streaming, then removes temporary records.

## PostgreSQL and DataGrip

Compose exposes PostgreSQL 17 on `localhost:5432`, database `vue_h5_business`, user `vue_h5`, password `vue_h5_local`. Create a PostgreSQL DataGrip source and install the official JDBC driver when prompted. Inspect `products`, `users`, `projects`, and `schema_migrations`. These credentials are local-only and must be replaced in production.

`docker compose stop` or `docker compose down` preserves the database volume. Run `docker compose down -v` only when you intentionally want irreversible local data removal.

