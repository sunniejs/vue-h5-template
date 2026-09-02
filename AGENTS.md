# AGENTS.md

This file is the source of truth for AI coding agents and human contributors working in this repository.

## Architecture

Vue 3 SFC pages are lazy-loaded by an explicit Vue Router table. Pinia owns client state. TanStack Query owns remote server state. Axios is hidden behind typed domain modules. Streaming AI uses a provider-neutral async iterable service and a Vue composable. UI framework selection happens at build time through `VITE_UI_FRAMEWORK`.

Dependency direction:

```text
views -> components/composables -> api modules/services -> transport/types
main -> plugins/router/store
build -> Vite plugins only
```

Lower layers must not import pages, Router instances or UI framework toast APIs.

## Directory Structure

- `src/api/client.ts`: transport, interceptors and error normalization only.
- `src/api/modules`: domain endpoints; no component behavior.
- `src/components`: reusable presentation and interaction components.
- `src/composables`: Vue lifecycle/reactive orchestration.
- `src/services`: framework-independent providers, parsers and adapters.
- `src/store`: Pinia client state only.
- `src/types`: shared domain types and generated OpenAPI types.
- `src/views`: route-level composition; all non-core pages should be lazy.
- `mock`: non-production JSON mocks. Streaming middleware lives in `build/vite/plugins/aiMock.ts`.
- `tests` / `e2e`: unit/component and browser tests.

## Coding Style

- Use strict TypeScript and type-only imports. Do not add `any` to bypass contracts.
- Prefer small domain modules over generic `utils` or a single large composable.
- Keep reusable pure code outside Vue SFCs. Scoped SCSS is allowed and preferred for component-specific layout.
- Use design tokens from `src/styles/index.scss`; preserve safe-area and dynamic viewport behavior.
- Do not introduce a dependency for logic that is short, tested and standards-based.

## API Rules

- Pages never import Axios directly. Add or change endpoints in `src/api/modules`.
- All JSON APIs use `ApiResponse<T>` and reject with `ApiError`.
- Narrow caught values with `isApiError`; never use `catch (error: any)`.
- Forward `AbortSignal` from TanStack Query and streaming operations.
- Update `openapi/schema.yaml`, run `pnpm api:generate`, and commit generated types when contracts change.
- Never put secrets in `VITE_*`. AI provider credentials belong on a trusted backend.
- `VITE_AI_API_BASE_URL` / `VITE_AI_API_TARGET` route streaming AI to FastAPI; conventional `/api` traffic targets Gin.

## State Management Rules

- Pinia: auth session, theme, feature flags and other client-owned state.
- TanStack Query: server cache, request status, retry, mutations and pagination.
- Local component state: form input and ephemeral UI.
- AI conversation state: `useStreamingChat`; do not duplicate it in Pinia.

## Testing Rules

- Test behavior and public contracts, not implementation trivia.
- Add unit tests for parsers, request errors, stores and composables.
- Add Vue Test Utils tests for reusable form/input interaction.
- Add Playwright coverage for changed critical user flows.
- Keep core coverage at or above the thresholds in `vitest.config.ts`.

## UI Rules

- Core business pages must not mix Vant, NutUI and Varlet.
- `VITE_UI_FRAMEWORK` selects one resolver and one demo alias for a production build.
- Product SVG icons go in `src/assets/icons` and use typed `<SvgIcon />`; UI library icons remain local to that framework.
- Preserve 44 CSS-pixel touch targets, keyboard resizing, safe-area padding, accessible labels and focus-visible styles.
- Use the typography, spacing, color, radius, control and motion tokens in `src/styles/index.scss`; do not recreate a local token scale in a page.
- Project CSS uses standard `rem`/CSS pixels and responsive breakpoints. Do not restore global `px`-to-viewport conversion: it makes tablet and desktop layouts scale incorrectly.
- Prefer document flow, dividers and spacing over nested cards. Gradients, large decorative shadows, pill controls and colored icon containers require a product reason.
- Keep controls at 6–8px radius, cards/dialogs at 8–12px, and routine transitions between 120–200ms. Shadows are reserved for floating navigation, popovers and dialogs.

## Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm build
pnpm check
pnpm api:generate
```

Run the smallest relevant check while iterating, then `pnpm check`. Run E2E when a route, auth, request mock or AI stream changes.

## Protected Decisions

- Do not restore implicit file routing without a measured benefit and a migration plan.
- Do not cache authenticated API requests in the Service Worker by default.
- Do not globally load all three UI frameworks.
- Do not render AI or Markdown HTML without sanitization.
- Do not move server state into Pinia or couple the request client to Router/UI feedback.
- Preserve pnpm as the only package manager and `pnpm-lock.yaml` as the only lockfile.

## PR Checklist

- [ ] Change is placed in the correct architectural layer.
- [ ] Public types and OpenAPI output are updated.
- [ ] Loading, empty, error, offline and aborted states are considered.
- [ ] Mobile keyboard, safe-area, touch target and accessibility behavior are preserved.
- [ ] Security review covers HTML, URLs, tokens, env values and production Mock leakage.
- [ ] Unit/component tests cover core logic; critical flows have E2E coverage.
- [ ] Chinese, English, and Japanese docs stay synchronized.
- [ ] `pnpm check` passes; relevant Playwright tests pass.
