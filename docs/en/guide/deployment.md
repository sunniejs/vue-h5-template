# Deployment

## Static Build

```bash
pnpm build
```

Assets are written to `dist`. Because the app uses history routing, the static server must fall back to `index.html` for unknown frontend paths.

## Docker

```bash
docker build -t vue-h5-template .
docker run --rm -p 8080:80 vue-h5-template
```

The provided `Dockerfile` uses Nginx Alpine and copies the repository's `nginx.conf`.

## API Routing

The sample Nginx configuration focuses on static assets and history fallback. Production API targets, TLS, CSP, HSTS, and caching depend on your domain and gateway architecture and should not be hard-coded into a generic template.

## Optional Build Features

```ini
VITE_USE_COMPRESS=true
VITE_USE_REPORT=true
VITE_USE_PWA=true
```

- Serving generated Gzip files requires matching server configuration.
- Bundle reports are diagnostic artifacts and should not be published.
- Replace application metadata, icons, and caching rules before enabling PWA.
