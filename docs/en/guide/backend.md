# Backend integration

The business service runs Go/Gin on 8002 and owns authentication, products and favorites; FastAPI runs on 8001 and owns AI JSON/SSE. Start each service using its own quick-start instructions, then run the frontend with the committed `.env.integration`:

```text
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
VITE_AI_API_BASE_URL=/api/ai
VITE_API_TARGET=http://127.0.0.1:8002
VITE_AI_API_TARGET=http://127.0.0.1:8001
VITE_REQUEST_ID_ENABLED=true
VITE_PWA_ENABLED=false
```

```bash
pnpm dev:integration
```

## Contract differences to resolve

The Vite proxy forwards requests; it does not translate API contracts. Before treating a full browser flow as integrated, reconcile these differences:

- Login: frontend sends `name` and reads `token`; Gin expects `username` and returns `accessToken`.
- Profile: frontend requests `/api/user/profile`; Gin exposes `/api/user/info`.
- Catalog: frontend requests `/api/products` and `/api/products/:id`, using localized `name` and `priceCents`; Gin exposes `/api/product/list` and `/api/product/detail?id=…`, returning `title` and `price`.
- Project CRUD exists in the frontend contract, but the current Gin router does not register Project endpoints.

## New feature boundaries

The favorite GET/POST paths match Gin, but require a Gin-issued JWT and an existing public product ID. A frontend Mock token is not valid for the real services. AI suggestions are public JSON and can be checked independently of login. The browser session cannot be assumed integrated simply because the transport accepts the service envelope.

## Verification

Use API-level checks below before browser integration. Obtain `BUSINESS_USER_JWT` from the business service’s actual login response; use its development account configuration, not old documentation credentials. Browser E2E against Mock does not establish real database or cross-service integration.

```bash
curl -s 'http://127.0.0.1:8001/api/ai/suggestions?locale=ja-JP'
curl -s 'http://127.0.0.1:8002/api/product/favorite?id=1' \
  -H "Authorization: Bearer $BUSINESS_USER_JWT"
```

[API](./request.md) · [AI Chat](./ai-chat.md) · [Commerce](./commerce.md)
