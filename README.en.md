# Vue H5 Template · Vue 2

[简体中文](README.md) · English · [日本語](README.ja.md)

This branch runs Vue 2.7, Vue CLI 5, Vant 2, Vue Router 3, and Vuex 3. It uses JavaScript single-file components and hash routing. Old `/#/about` links redirect to the member page. The UI component demo uses Vant 2.

## Run locally

Use Node.js 22.12+ and pnpm 9.15.9.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

Open `http://127.0.0.1:9020/#/home`. The development mock accepts any nonempty username and password and resets its data when the server restarts. `pnpm serve` remains a development command, and `pnpm stage` builds in staging mode.

## Pages and state

- The shop includes a localized catalog, search, filters, pagination, details, signed-in favorites, a cart, and product management. The checkout button demonstrates the interaction.
- Examples cover project CRUD, TanStack Query, request errors, mobile layouts, SVG icons, and Vant 2.
- The member page loads the profile from the API. Vuex owns the session and cart. TanStack Query owns server data, and the chat page owns the conversation.
- The AI assistant supports SSE streaming, stopping, retrying, and Markdown sanitized with DOMPurify. The interface supports Simplified Chinese, English, and Japanese.

## API and deployment

The frontend follows the [OpenAPI contract](openapi/schema.yaml). `pnpm dev:integration` disables mocks and forwards `/api/ai` to FastAPI on port 8001 and the remaining `/api` traffic to Gin on port 8002. Override addresses and paths in `.env.integration.local` using [.env.example](.env.example). Set `VUE_APP_API_PROXY_REWRITE` or `VUE_APP_AI_API_PROXY_REWRITE` if the corresponding backend omits the prefix.

The sibling Gin project exposes routes and fields such as `/api/product/list` and `accessToken`, which differ from the frontend contract. A gateway or backend adapter is needed for the catalog, sign-in, project, and example APIs. Development mocks cover the frontend contract. Deploy the `dist/` output from `pnpm build` and configure the production gateway or API addresses. Keep AI provider credentials on the server.

On HTTPS or localhost, build with `VUE_APP_PWA_ENABLED=true pnpm build` for an installable offline shell. The service worker precaches the build's static assets and leaves all API requests on the network. The `/#/offline` page explains how to recover when the network is unavailable.
