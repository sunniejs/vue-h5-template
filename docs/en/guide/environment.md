# Environment and Build

Vite merges `.env` with the active mode file. `build/utils.ts` then converts feature flags to booleans.

## Variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Axios base URL and development proxy prefix |
| `VITE_API_TARGET` | empty | Real backend target for local development |
| `VITE_USE_MOCK` | `false` | Enable Vite Mock; development sets it to `true` |
| `VITE_USE_ERUDA` | `false` | Enable the mobile debug console |
| `VITE_USE_COMPRESS` | `false` | Generate Gzip assets |
| `VITE_USE_REPORT` | `false` | Generate a bundle analysis report |
| `VITE_USE_HTTPS` | `false` | Enable local HTTPS |
| `VITE_USE_PWA` | `false` | Enable PWA support |

## Mock Mode

`.env.development` enables Mock by default. The example login request resolves to `/api/login`, which is handled by `mock/index.ts`.

## Use a Real Backend

```ini
VITE_API_BASE_URL=/api
VITE_API_TARGET=http://localhost:8080
VITE_USE_MOCK=false
```

The dev server rewrites `/api/users` to `http://localhost:8080/users`. Update `build/vite/proxy.ts` if the backend must retain the `/api` prefix.

## Production

```bash
pnpm build
```

Mock and Eruda are disabled in production. Keep a same-origin `/api` behind a gateway, or override `VITE_API_BASE_URL` in the deployment environment.
