# Migrating from v1 to v2

## Breaking Changes

- Minimum Node.js is now 22.12; builds use Vite 8 and Rolldown.
- Login moved from `/api/login` to `/api/auth/login`.
- Requests use `src/api/client.ts` plus `src/api/modules`; `utils/request` is a compatibility re-export only.
- `VITE_USE_PWA` became `VITE_PWA_ENABLED`.
- Three simultaneous UI resolvers became one `VITE_UI_FRAMEWORK` selection.
- Token persistence moved from `localStorage` to `sessionStorage`.
- Main route names/navigation became Home / Examples / AI / Member.

## Migration Steps

1. Upgrade Node/pnpm and run `pnpm install`.
2. Migrate environment values from `.env.example` and select a UI framework.
3. Move direct Axios calls into `src/api/modules` and adopt `ApiError`.
4. Move remote lists/details from Pinia to TanStack Query.
5. Replace `openapi/schema.yaml` and run `pnpm api:generate`.
6. Move product SVGs to `src/assets/icons` and extend `SvgIconName`.
7. Review custom route meta, permissions, and login redirects.
8. Run `pnpm check` and relevant `pnpm test:e2e` scenarios.

## Old Implementations Not Restored

The old `vite-plugin-pages` integration was not restored because implicit routing does not pay off at this scale. The imagemin binary chain was replaced by Sharp/SVGO. Icon fonts were replaced by SVG sprites. QRCode/restart plugins were removed due to Vite 8 peer incompatibility; Vite reloads config itself, and device testing can use the LAN URL or a future CLI.
