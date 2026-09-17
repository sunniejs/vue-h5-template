# Vue H5 Template v2

[简体中文](./README.md) | English | [日本語](./README.ja.md)

A Vue 3 engineering template for mobile H5 products. It includes typed requests, OpenAPI type generation, TanStack Query, cancellable streaming AI chat, PWA support, SVG sprites, production image optimization, build-time UI framework selection, and a tested application baseline.

[English documentation](https://sunniejs.github.io/vue-h5-template/en/) · [Migration to v2](https://sunniejs.github.io/vue-h5-template/en/guide/migration-v2)

## Core capabilities

- Vue 3.5, Vite 8 / Rolldown, TypeScript 5.9, Vue Router 4, and Pinia 3.
- TanStack Vue Query for server state; Pinia for client state.
- A typed Axios client with `ApiResponse<T>`, `ApiError`, request IDs, tokens, centralized 401 handling, and timeout/network error normalization.
- `pnpm api:generate` generates backend contract types from the local OpenAPI schema.
- AI chat with POST SSE, `ReadableStream`, `AbortController`, regeneration, retry, Markdown, code blocks, and DOMPurify.
- A storefront with 12+ localized products, search, categories, pull-to-refresh, pagination, product details, cart, and product administration.
- Delivery project management with viewing, creation, editing, deletion, and status filtering; Vite Mock and Gin + PostgreSQL share the contract.
- SVG sprites from `src/assets/icons`, rendered through typed `<SvgIcon />` components.
- One of Vant, NutUI, or Varlet per production build.
- Optional PWA support; the service worker caches the app shell and static images, excluding API requests by default.
- Optional production-only PNG/JPEG/WebP/SVG optimization with Sharp and SVGO.
- Vitest, Vue Test Utils, and Playwright for logic, interaction, and browser coverage.
- Shared typography, spacing, radius, color, control, and motion tokens; mobile bottom navigation becomes compact top navigation on desktop.
- Lazy-loaded Chinese, English, and Japanese translations for content, navigation, and page titles.
- Linting, formatting, Husky, lint-staged, Commitlint, GitHub Actions, and Release Please.

## Quick start

Requires Node.js `>=22.12.0` and pnpm `>=9.12.0`.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Mock APIs are enabled by default. Enter any nonempty username and password to sign in. The engineering examples are available from the third navigation tab. The floating AI button opens `/ai/chat`; the development mock streams SSE chunks from `POST /api/ai/chat`.

You can also open `/shop`, `/shop/cart`, `/examples/request`, and `/examples/workspace` directly. Request examples cover HTTP 400/401/403/404/409, business code 422, server errors, and timeouts. Delivery projects support CRUD in both mock and backend integration modes.

## Common commands

```bash
pnpm lint             # Code and style linting
pnpm typecheck        # vue-tsc project references
pnpm test             # Unit and component tests
pnpm test:coverage    # Core coverage thresholds
pnpm test:e2e         # Browser flows, responsive layout, and dark mode
pnpm build            # Production build
pnpm check            # Lint, typecheck, tests, and build
pnpm api:generate     # OpenAPI to TypeScript
```

`pnpm check` excludes E2E. CI runs Playwright separately after the main checks.

## Directory boundaries

```text
src/
├── api/                 # Axios transport and domain API modules
├── components/          # Reusable UI without route-level responsibilities
├── composables/         # Vue lifecycle and reactive orchestration
├── layout/              # App shell, navigation, and safe areas
├── plugins/             # Application plugins, including Vue Query
├── router/              # Explicit routes, metadata, and guards
├── services/            # Framework-independent providers and transport services
├── store/               # Pinia client state
├── types/               # API, AI, and icon domain types
├── utils/               # Pure helpers without Vue lifecycle dependencies
└── views/               # Lazy-loaded pages
```

See [`AGENTS.md`](./AGENTS.md) for the full contribution rules. It is also the primary repository context for coding agents.

## State management

- Pinia owns sessions, the cart, themes, feature flags, and other client state.
- TanStack Query owns remote data, caching, retries, cancellation, mutations, and pagination.
- `useStreamingChat` owns AI conversation lifecycles. Providers in `services/ai` handle transport; conversation state stays outside Pinia and the query cache.

## API and OpenAPI

Pages consume typed domain modules instead of importing Axios. Narrow errors with `isApiError`; avoid `catch (error: any)`.

To update backend contracts:

1. Update `openapi/schema.yaml`, or change the input URL used by `api:generate`.
2. Run `pnpm api:generate`.
3. Reference generated schemas from `src/types/api/generated.d.ts` in domain API modules.
4. Commit the schema and generated types together so type checking can detect contract drift.

## Favorites and chat suggestions

Product details load the signed-in user’s favorite state with `GET /api/product/favorite?id=1` and save an explicit boolean with `POST /api/product/favorite`. Reads require authentication and only expose public products. Repeated writes are idempotent. The control blocks duplicate submissions and isolates late responses across session changes.

Chat loads `GET /api/ai/suggestions?locale=en-US` from the AI gateway and keeps translated local prompts when offline or when the request fails. Supported locales are `en-US`, `zh-CN`, and `ja-JP`. These prompts make no model calls. The services also expose `/api/v1` aliases.

## AI providers

The provider interface is small and vendor-neutral:

```ts
interface ChatProvider {
  chat(
    messages: readonly ChatMessage[],
    options?: ChatOptions,
  ): AsyncIterable<ChatChunk>;
}
```

`FetchStreamChatProvider` parses standard SSE. Route OpenAI, Claude, Gemini, or DeepSeek requests through a trusted backend. Provider credentials must stay out of `VITE_*` variables and browser requests. Other stream protocols, including the Vercel AI SDK data stream protocol, can be supported with a provider adapter.

## UI framework selection

```env
VITE_UI_FRAMEWORK=vant # vant | nutui | varlet
```

Vite selects the matching resolver and `#ui-demo` alias. The template includes all three dependencies for project setup, but a production build includes only the selected framework.

Each framework example demonstrates buttons, cells/lists, switches, tags/chips, and progress indicators.

## Internationalization

Translations in `src/locales/langs` cover `zh-CN`, `en-US`, and `ja-JP`. The Home language selector lazy-loads translations and updates content, navigation, route titles, `document.title`, and `<html lang>`. Add new languages to `SUPPORTED_LOCALES` and keep the `common.json` keys synchronized.

## Companion backends

The backend is split into two repositories. The business service (`vue-h5-template-business-service`) owns authentication, users, delivery projects, products, and PostgreSQL. The AI service (`vue-h5-template-ai-service`) owns provider integration, POST SSE, and Redis rate limiting. A parent workspace directory coordinates local Compose development.

```bash
# Terminal 1: PostgreSQL, Gin, FastAPI, and Redis
cd <workspace>/backend/vue-h5-template
docker compose up --build

# Terminal 2: use the committed integration environment
cd <workspace>/frontend/vue-h5-template
pnpm dev:integration
```

Open the address printed by Vite and sign in with `demo / demo1234`. `/shop` reads public products, `/shop/admin/products` manages localized products, and `/examples/workspace` manages delivery projects. `/ai/chat` forwards the same JWT to FastAPI with its SSE request. The backend’s `python3 scripts/smoke.py` checks the Vue proxy, Gin API, PostgreSQL, and FastAPI SSE path.

`pnpm dev` uses frontend mocks and does not require a backend. The documented local Compose database connection is `localhost:5432 / vue_h5_business / vue_h5 / vue_h5_local`; these credentials are for local development only. Each repository’s `docs` branch contains Chinese, English, and Japanese documentation. AI keys belong only in FastAPI configuration.

## PWA and image optimization

```env
VITE_PWA_ENABLED=false
VITE_IMAGE_OPTIMIZE=true
```

PWA support is disabled by default. When enabled, it caches the app shell and static images while excluding `/api`. Image optimization runs only during production builds; disable it when an existing CDN image pipeline already handles your assets.

## Browser and security baseline

The target is iOS Safari 15+, Android Chrome 80+, and modern WeChat/WeCom WebViews. Markdown disables raw HTML and passes through DOMPurify. Redirects accept only internal absolute paths. Production mocks are disabled by default, and the example stores authentication tokens in `sessionStorage`.

Production applications should consider a SameSite, Secure, HttpOnly cookie/BFF approach, with CSP, CSRF protection, and rate limiting at the gateway.

## Documentation and releases

The `docs` branch covers architecture, backend integration, commerce, requests, state, chat, UI, testing, deployment, and v2 migration in all three languages. Release Please maintains versions, the changelog, and GitHub releases from Conventional Commits.

See [`V2_UPGRADE_REPORT.md`](./V2_UPGRADE_REPORT.md) for the upgrade decisions, performance data, breaking changes, and follow-up work.

## Roadmap

- Implemented baseline: authentication, route permissions, error boundaries, network status, system dark theme, lazy routes, sanitized Markdown, PWA/API cache isolation, and engineering checks.
- Add as product needs arise: gateway/JWKS identity, automated Gin OpenAPI export, database backup and rollback, feature flags, analytics/error reporting adapters, uploads, virtual lists, WebView bridges, performance monitoring, and explicit theme switching.
- Optional integrations: QR/camera/Web Share, deep links, SSR/SSG, CDN externals, and native app bridges. Include them only when the product and deployment environment require them.

## License

[MIT](./License)
