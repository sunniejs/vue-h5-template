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

`src/api/modules/projects.ts` is the real Gin CRUD example. `/examples/projects` uses TanStack Query for its paginated list and mutations, so the page never stores server state. The envelope accepts the full successful 2xx range, allowing an HTTP 201 create response to unwrap normally.

## OpenAPI

The repository includes `openapi/schema.yaml` with both Gin business APIs and the FastAPI streaming contract:

```bash
pnpm api:generate
```

Output is written to `src/types/api/generated.d.ts`. Replace the schema or command input with the real backend, commit both schema and generated output, and let CI typecheck contract drift. Never edit generated types manually.

## Security

`VITE_*` values ship to the browser; never put keys there. The example token uses `sessionStorage`; production should prefer SameSite, Secure, HttpOnly cookies and a BFF. Redirects accept only same-origin absolute paths beginning with a single `/`.
