# Deployment

## Build

```bash
pnpm check
pnpm build
```

Output is written to `dist`. The Dockerfile serves it with Nginx, and `try_files` falls back to `index.html` for history routing.

## Environment Capabilities

- `VITE_PWA_ENABLED=true`: generate manifest and Service Worker.
- `VITE_IMAGE_OPTIMIZE=true`: optimize production images with Sharp/SVGO.
- `VITE_USE_COMPRESS=true`: emit `.gz`; disable when the CDN already compresses.
- `VITE_USE_REPORT=true`: emit a bundle report; regular CI should not open it.

PWA never caches `/api`. If offline data is required, design NetworkFirst/StaleWhileRevalidate per public, non-sensitive, expirable resource. Never make all authenticated APIs CacheFirst.

## Local Real-backend Integration

```bash
cd /Users/fong/Workspace/personal/backend/vue-h5-template
docker compose up --build

cd /Users/fong/Workspace/personal/frontend/vue/vue-h5-template/vue-h5-template
pnpm dev:integration
```

Sign in with `demo / demo1234`. `.env.integration` sends `/api` to Gin on 8002 and gives the more specific `/api/ai` route to FastAPI on 8001. Run `python3 scripts/smoke.py` from the backend workspace to verify login, product CRUD, PostgreSQL persistence, and SSE through the Vue proxy.

Gin uses PostgreSQL 17 for local integration and production with versions recorded in `schema_migrations`; SQLite remains only for fast, isolated unit tests. Both backends must share the JWT secret, issuer, and audience, while provider keys remain exclusively in FastAPI.

## AI Streaming

Nginx/CDNs must disable buffering and transformation for SSE endpoints, extend read timeouts, and preserve chunked responses. Provider keys stay server-side. If a platform cannot proxy POST SSE, implement a fetch ReadableStream or NDJSON Provider while retaining the `ChatProvider` interface.

## Security Headers

The example Nginx config provides frame, MIME, referrer, and permissions baselines. Production CSP must match actual APIs, image CDNs, monitoring domains, and same-origin PWA workers. Do not rely on deprecated `X-XSS-Protection` instead of CSP.
