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

Vitest and Vue Test Utils cover URL redirects, request errors, API modules, the user store, SSE parsing, the streaming composable, safe Markdown, Login Form, and Chat Composer. Core thresholds are 60% for lines/statements/functions and 50% branches; v2 currently reports 76.68% lines.

Playwright uses a Pixel 7 profile for Home, three-language switching, Login, Mock API, AI Streaming/Stop, and 401 Redirect. The backend workspace adds `scripts/smoke.py`, which verifies Gin login/Project CRUD and authenticated FastAPI SSE through the real Vue proxy.

Backend gates are Ruff + mypy + pytest for FastAPI and `go test ./...` + `go vet ./...` for Gin. The backend workspace includes its own GitHub Actions workflow.

## Principles

Test public behavior, not trivial getters or static copy. Protocol parsing, auth, errors, and cancellation are high-risk shared logic and require unit tests. Route, mock, login, and streaming critical paths require E2E coverage.

GitHub Actions uses the pnpm cache, installs dependencies once, runs `check`, installs Chromium, then runs E2E.
