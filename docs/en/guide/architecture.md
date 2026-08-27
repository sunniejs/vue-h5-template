# Architecture

v2 makes directory boundaries explicit so contributors and coding agents do not have to guess where code belongs.

## Layers

```text
views -> components / composables -> api modules / services -> transport / types
main  -> plugins / router / store
build -> Vite plugins
```

- `src/api/client.ts` owns Axios, interceptors, response unwrapping, and `ApiError` only.
- `src/api/modules` declares domain endpoints without Toast, Router, or component behavior.
- `src/services` contains framework-independent providers, protocol parsers, and adapters.
- `src/composables` orchestrates Vue reactivity and lifecycle.
- `src/store` contains client state only; TanStack Query owns server state.
- `src/views` is the route composition layer; non-core pages are lazy-loaded.

## Router Decision

The project keeps an explicit router table. At the current scale, `RouteRecordRaw` is easier to review for permissions, layouts, titles, KeepAlive, and bundle boundaries. The old `vite-plugin-pages` integration was not restored. If page count eventually justifies file conventions, evaluate `unplugin-vue-router` as a complete typed-routes, meta, layout, and migration-testing change.

## Build

Vite 8 uses Rolldown. `VITE_UI_FRAMEWORK` selects one UI resolver and demo alias. AI Chat, Query examples, and secondary pages use dynamic imports. SVG sprites are always available; Sharp/SVGO, PWA, gzip, and bundle reports are feature flags.

## Protected Constraints

- The request layer does not import UI or Router.
- The Service Worker does not cache APIs by default.
- Three UI libraries never enter the same production graph.
- AI and Markdown output is sanitized.
- pnpm is the only package manager.
