# Architecture

## Directory Responsibilities

```text
├── build/
│   ├── utils.ts                 # Environment parsing and defaults
│   └── vite/
│       ├── plugins/             # Vite plugin factories
│       └── proxy.ts             # Development proxy
├── mock/                        # Local mock endpoints
├── public/                      # Static files copied as-is
├── src/
│   ├── api/                     # API parameters, result types, and functions
│   ├── layout/                  # Navbar, content area, and tabbar
│   ├── locales/                 # Locale loader and JSON messages
│   ├── router/                  # History router and explicit route table
│   ├── store/                   # Pinia stores
│   ├── styles/                  # Global styles and SCSS variables
│   ├── utils/request/           # Axios client, interceptors, and typed methods
│   └── views/                   # Pages
├── tests/                       # Vitest tests
└── types/                       # Global and module declarations
```

## Runtime Flow

1. `src/main.ts` creates the Vue app and installs Router, Vue I18n, and Pinia.
2. `src/router/routes.ts` lazy-loads pages; `src/layout/index.vue` provides the mobile shell.
3. Pages call `http` through `src/api`; the request interceptor reads the token from the user store.
4. The response interceptor unwraps the common response. Business or HTTP 401 responses clear auth state and navigate to login.
5. `src/locales/index.ts` lazy-loads JSON by locale and namespace.

## Build Flow

`vite.config.mts` composes focused modules:

- `build/utils.ts` converts string environment values and applies defaults.
- `build/vite/proxy.ts` proxies `/api` when `VITE_API_TARGET` is configured.
- `build/vite/plugins` conditionally enables Mock, Eruda, PWA, HTTPS, Gzip, and bundle reports.
- Production uses esbuild minification and separates Vue runtime and UI libraries into vendor chunks.

Commit generated `types/auto-imports.d.ts` and `types/components.d.ts` so a fresh checkout can type-check immediately.
