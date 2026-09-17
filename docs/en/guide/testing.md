# Testing and Quality

## Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm build
pnpm check
```

`check` runs lint, typecheck, Vitest, and build. Browser cost keeps E2E separate locally and explicit in CI.

## Current Coverage

Vitest and Vue Test Utils cover URL redirects, request errors, API modules, the user store, SSE parsing, the streaming composable, safe Markdown, Login Form, and Chat Composer. Core thresholds are 60% for lines/statements/functions and 50% branches; Run `pnpm test:coverage` for the current result; this is not whole-application coverage.

Playwright uses a Pixel 7 profile for Home, three-language switching, the shop catalog/detail flow, empty Login privacy checks, Mock API, AI Streaming/Stop, and 401 Redirect. Real-service verification requires reconciling the login/catalog contracts and configuring the database and AI environments. Mock E2E does not establish that integration.

Backend gates are Ruff + mypy + pytest for FastAPI and `go test ./...` + `go vet ./...` for Gin. The backend workspace includes its own GitHub Actions workflow.

## Principles

Test public behavior, not trivial getters or static copy. Protocol parsing, auth, errors, and cancellation are high-risk shared logic and require unit tests. Route, mock, login, and streaming critical paths require E2E coverage.

GitHub Actions uses the pnpm cache, installs dependencies once, runs `check`, installs Chromium, then runs E2E.

## Feature regression checks

API tests cover ID/body forwarding, cancellation, locale normalization, the AI base URL and rejected requests. Favorite component tests cover signed-out access, save/remove, read retry, failed writes and a late write after an account switch. Streaming composable tests cover stop, cancellation and overlapping lifecycles; browser tests below validate remote prompts and fallback. Each test uses an isolated QueryClient and clears it after use.

```bash
pnpm test tests/api/features.test.ts tests/api/client.test.ts tests/components/FavoriteButton.test.ts
pnpm test:coverage
pnpm test:e2e
```

Playwright checks that a favorite survives a browser reload, can be removed, and that chat uses remote suggestions then falls back on a failed request. Keep streaming tests independent of suggestion copy by submitting a typed prompt. These are development-Mock checks; PostgreSQL/Redis integration needs its own configured environment.

Run the application test commands from the application checkout, not this `docs` branch. The documentation checkout only runs `pnpm build` to validate VitePress. Use current command output as verification evidence.
