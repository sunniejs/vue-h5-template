# Contributing

## Development Rules

- Use pnpm; do not commit `package-lock.json` or `yarn.lock`.
- API functions must declare parameter and result types.
- Avoid `any`; use `unknown` at boundaries and narrow it after validation.
- Keep Mock development-only by default.
- Commit generated component and auto-import declarations with source changes.

## Before Submitting

```bash
pnpm check
```

A pull request should explain behavior changes, verification, and affected environment variables.

## Documentation

Documentation is maintained on the `docs` branch:

```bash
git switch docs
pnpm install
pnpm dev
```

Feature documentation must update both Simplified Chinese and English pages. Navigation lives in `docs/.vitepress/config.js`; run `pnpm build` before submitting.
