# Vue H5 Template Lite

[简体中文](README.md) · [日本語](README.ja.md)

Lite uses Vue 3, Vite 7, and JavaScript. It includes a product catalog, details, cart, favorites, product administration, sign-in, member pages, a project workspace, request examples, and streaming AI chat with cancellation. The interface supports Simplified Chinese, English, and Japanese.

## Local development

Use Node.js 20.19 or later in the 20.x line, or Node.js 22.12 or later, with pnpm 9.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test:coverage
pnpm exec playwright install chromium
pnpm test:e2e
```

Development uses mocks by default. Use any non-empty username and password to try sign-in. Production uses backend authentication. The session belongs to the current browser tab, and existing users need to sign in again after upgrading. Legacy `/list` and `/details` links open the new catalog because the previous static product indexes have no matching IDs. `/demo` opens the selected UI framework example.

## Configuration and builds

- Set `VITE_UI_FRAMEWORK` to `vant` (default), `nutui`, or `varlet`. Each build includes the selected framework.
- Run `pnpm dev:integration` to proxy business requests to Gin (port 8002 by default) and AI requests to FastAPI (port 8001 by default). Override targets and prefixes using `.env.example`. `VITE_URL_PREFIX` remains an alias for the business API prefix. Local flows were verified with mocks. Full live integration requires services that implement this branch’s OpenAPI contract. The sibling Go service uses different routes and login payloads and lacks the projects and request example endpoints. A compatible gateway or adapter is required for those flows.
- Run `pnpm build` to generate `dist/` for a static server with History routing. Configure real API and AI gateways for production and disable response buffering for the AI proxy. Mocks and debug tools are development-only.
- Enable PWA support with `VITE_PWA_ENABLED=true`. The legacy `VITE_USE_PWA=true` flag also works. The service worker precaches static application assets. When PWA support is disabled, deploy `/sw.js` with `Cache-Control: no-cache`. It unregisters existing Lite workers and deletes their old `api-cache` when the browser checks for updates. Fresh visits do not register a worker.
- See the [OpenAPI contract](openapi/schema.yaml).

[Vue 2 branch](https://github.com/sunniejs/vue-h5-template/tree/vue2-h5-template) · [Project documentation](https://sunniejs.github.io/vue-h5-template/)
