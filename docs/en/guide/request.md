# Requests and OpenAPI

## Call Flow

```text
View / Query composable
  -> src/api/modules/*.ts
  -> apiClient
  -> Axios interceptor
  -> ApiResponse<T> / ApiError
```

Pages do not import Axios. Module functions own URLs, parameters, and result types. Pages narrow caught unknown values with `isApiError(error)`.

## Types

- `ApiResponse<T>`: common backend envelope.
- `ApiError`: `business | http | timeout | network | cancelled | unknown`.
- `PaginationParams` / `PaginationResponse<T>`: pagination contracts.

The request interceptor adds a Bearer token and `X-Request-ID` when configured. The response interceptor separates business and HTTP failures. A runtime 401 handler clears the session and navigates without importing Router into the client.

`src/api/modules/projects.ts` defines the frontend project CRUD contract; the current Gin router does not register Project endpoints. `/examples/workspace` uses TanStack Query for its paginated list and mutations, so the page never stores server state. The envelope accepts the full successful 2xx range, allowing an HTTP 201 create response to unwrap normally.

## OpenAPI

The repository includes `openapi/schema.yaml` with both Gin business APIs and the FastAPI streaming contract:

```bash
pnpm api:generate
```

Output is written to `src/types/api/generated.d.ts`. Replace the schema or command input with the real backend, commit both schema and generated output, and let CI typecheck contract drift. Never edit generated types manually.

## Security

`VITE_*` values ship to the browser; never put keys there. The example token uses `sessionStorage`; production should prefer SameSite, Secure, HttpOnly cookies and a BFF. Redirects accept only same-origin absolute paths beginning with a single `/`.

## REST contracts and cancellation

The single-app transport accepts service envelopes with `code: 0` and `message`, as well as legacy Mock envelopes with a 2xx business code and `msg`. Both unwrap `data`; failures remain `ApiError`. HTTP 2xx alone is not enough to establish business success.

These helpers return unwrapped data and reject through `ApiError`. Forward the query’s `AbortSignal` to reads. A favorite write uses the authenticated client configured at bootstrap; never send a caller-supplied owner ID.

The single app uses `VITE_AI_API_BASE_URL` (default `/api/ai`) for suggestions and `VITE_AI_API_TARGET` for the development proxy. Business traffic uses the Gin target. `src/api/modules/ai.ts` owns this JSON call; streaming stays in the provider/composable.

Response-envelope compatibility does not adapt endpoint names or domain fields. This app’s catalog still uses `/api/products` and localized `name`/`priceCents`; the current Gin catalog exposes `/api/product/list` and `title`/`price`. Login also differs (`name`/`token` versus `username`/`accessToken`). Check the remaining contracts or add explicit domain adapters before claiming full integration. The new favorite paths match Gin; their authenticated use still requires a compatible issued JWT.
