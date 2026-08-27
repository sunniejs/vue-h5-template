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

## AI Streaming

Nginx/CDNs must disable buffering and transformation for SSE endpoints, extend read timeouts, and preserve chunked responses. Provider keys stay server-side. If a platform cannot proxy POST SSE, implement a fetch ReadableStream or NDJSON Provider while retaining the `ChatProvider` interface.

## Security Headers

The example Nginx config provides frame, MIME, referrer, and permissions baselines. Production CSP must match actual APIs, image CDNs, monitoring domains, and same-origin PWA workers. Do not rely on deprecated `X-XSS-Protection` instead of CSP.
