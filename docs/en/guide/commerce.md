# Commerce Example

The store is a real server-state flow, not a button demo.

## Routes

- `/shop`: public catalog, keyword search, category filters, sorting, and infinite query.
- `/shop/products/:id`: localized detail, quantity, and a safe-area purchase bar.
- `/shop/admin/products`: authenticated admin search, create, edit, publication status, and soft deletion.

Reusable product presentation and editing live in `src/components/shop`. Endpoints stay in `src/api/modules/products.ts`. TanStack Query owns cache, cancellation, mutations, and invalidation; product server state never enters Pinia.

## Types and data

Product contracts are generated from `openapi/schema.yaml`. Money is stored as integer cents and rendered with `Intl.NumberFormat`. Names, subtitles, and descriptions require `zh-CN`, `en-US`, and `ja-JP`, and the current locale selects the display value.

Cover images allow same-origin paths or HTTPS only and fall back to a local placeholder. Admin deletion is soft deletion and the public API exposes only `on_sale` products.

`pnpm dev` uses `mock/index.ts`, so the full store works without Docker. `pnpm dev:integration` sends the same API module calls to Gin and persists data in PostgreSQL. Pages contain no environment-specific branches.

