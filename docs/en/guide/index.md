# Introduction

Vue H5 Template is a Vue 3 starter for mobile H5 applications. It provides a runnable, buildable, and deployable foundation while keeping extension points explicit.

## Stack

| Category | Solution |
| --- | --- |
| Core | Vue 3.5, Vite 7, TypeScript 5.9 |
| Routing and state | Vue Router 4, Pinia 3, persisted state |
| Network and i18n | Axios, Vue I18n 11 |
| UI | Vant 4, NutUI 4, Varlet 3 |
| Quality | ESLint 9, Prettier, Stylelint, Vitest, GitHub Actions |
| Deployment | Docker, Nginx, optional Gzip and PWA |

## Design Decisions

- Routes are maintained explicitly in `src/router/routes.ts`; file-based routing is not enabled.
- Examples use NutUI Icons and iconfont; no SVG sprite plugin is configured.
- Three UI libraries are included for template demonstrations. Product projects should choose a primary library and remove unused dependencies, resolvers, and examples.
- Axios is the single request layer, avoiding competing request conventions.
- Mocking is for local development only and is disabled by default in test and production modes.

Continue with [Getting Started](./start.md), or read [Architecture](./architecture.md) first.
