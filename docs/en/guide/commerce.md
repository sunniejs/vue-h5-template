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

`pnpm dev` uses `mock/index.ts`, so the full store works without Docker. `pnpm dev:integration` configures the Gin/FastAPI proxies. Review the contract differences below before using the full flow against these services.

## Favorite interaction

`FavoriteButton` receives a numeric `productId` and the current `session` token. Signed-out users see a login link; no private-state request is sent. A valid signed-in product loads its saved state before enabling the action. Failed reads offer retry. Failed writes preserve the last confirmed state and display an error. Fetching or saving disables duplicate submissions.

Favorite state belongs to TanStack Query. Cache keys include the control instance, session generation and product ID; they do not contain the token. A mutation captures its original cache key, so a late response cannot overwrite another account or product. Each new mount/session reads the server again. The action sets an explicit boolean rather than asking the server to invert unknown state.

```text
GET  /api/product/favorite?id=1
POST /api/product/favorite
{ "productId": 1, "favorite": true }
```

`src/components/shop/FavoriteButton.vue` → `src/api/modules/favorites.ts` → `apiClient`.

Response-envelope compatibility does not adapt endpoint names or domain fields. This app’s catalog still uses `/api/products` and localized `name`/`priceCents`; the current Gin catalog exposes `/api/product/list` and `title`/`price`. Login also differs (`name`/`token` versus `username`/`accessToken`). Check the remaining contracts or add explicit domain adapters before claiming full integration. The new favorite paths match Gin; their authenticated use still requires a compatible issued JWT.

[API](./request.md) · [Tests](./testing.md)
