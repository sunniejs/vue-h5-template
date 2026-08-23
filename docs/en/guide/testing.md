# Quality

## Local Verification

```bash
pnpm check
```

This command runs:

1. ESLint across source, mock, build, tests, and config files.
2. `vue-tsc --build` for Vue SFC and TypeScript checks.
3. Vitest unit tests.
4. A Vite production build.

## Test Structure

`tests/router/routes.test.ts` provides a small baseline for primary tabs, details, login, and fallback routes. Add tests around:

- API parameter and response transformations
- Store transitions and persistence boundaries
- Route guards and authorization
- Conditional rendering and user interactions

Component tests use `@vue/test-utils` with jsdom.

## CI

`.github/workflows/ci.yml` installs from the frozen lockfile and runs lint, typecheck, test, and build on pushes and pull requests.
