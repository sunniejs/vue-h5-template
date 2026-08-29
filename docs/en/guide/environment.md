# Environment and Build

Vite merges `.env` with the active mode file. `build/utils.ts` then converts feature flags to booleans.

## Variables

| Variable               | Default   | Description                                     |
| ---------------------- | --------- | ----------------------------------------------- |
| `VITE_API_BASE_URL`    | `/api`    | Axios base URL and development proxy prefix     |
| `VITE_AI_API_BASE_URL` | `/api/ai` | Streaming AI API prefix                         |
| `VITE_API_TARGET`      | empty     | Real backend target for local development       |
| `VITE_AI_API_TARGET`   | empty     | Local FastAPI AI service target                 |
| `VITE_USE_MOCK`        | `false`   | Enable Vite Mock; development sets it to `true` |
| `VITE_USE_ERUDA`       | `false`   | Enable the mobile debug console                 |
| `VITE_USE_COMPRESS`    | `false`   | Generate Gzip assets                            |
| `VITE_USE_REPORT`      | `false`   | Generate a bundle analysis report               |
| `VITE_USE_HTTPS`       | `false`   | Enable local HTTPS                              |
| `VITE_PWA_ENABLED`     | `false`   | Enable PWA support                              |
| `VITE_IMAGE_OPTIMIZE`  | `false`   | Optimize images in production builds only      |
| `VITE_UI_FRAMEWORK`    | `vant`    | Select Vant, NutUI, or Varlet at build time     |

## Mock Mode

`.env.development` enables Mock by default. Login uses `/api/auth/login`; the catalog and administration use `/api/products` and `/api/admin/products`. `mock/index.ts` implements the same contracts.

## Use a Real Backend

```ini
VITE_API_BASE_URL=/api
VITE_AI_API_BASE_URL=/api/ai
VITE_API_TARGET=http://localhost:8002
VITE_AI_API_TARGET=http://localhost:8001
VITE_USE_MOCK=false
```

The dev server routes `/api/ai` to FastAPI first, then sends the remaining `/api` traffic to Gin. Paths are preserved; production gateways should use the same routing rule.

## Production

```bash
pnpm build
```

Mock and Eruda are disabled in production. Keep a same-origin `/api` behind a gateway, or override `VITE_API_BASE_URL` in the deployment environment.
