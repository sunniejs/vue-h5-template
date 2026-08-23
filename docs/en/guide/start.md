# Getting Started

## Requirements

| Tool | Version |
| --- | --- |
| Node.js | `>= 20.10.0` |
| pnpm | `>= 9.12.0` |

The repository maintains only `pnpm-lock.yaml`. Do not mix npm, Yarn, and pnpm.

## Install and Run

```bash
git clone https://github.com/sunniejs/vue-h5-template.git
cd vue-h5-template
git switch vue-h5-template
pnpm install
pnpm dev
```

Vite listens on local network interfaces and prints a URL that can be opened from a phone on the same network.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build production assets into `dist` |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Check Vue and TypeScript types |
| `pnpm test` | Run Vitest |
| `pnpm check` | Run lint, typecheck, test, and build |

## First Configuration

1. Review `.env.example` and set `VITE_API_TARGET` for your backend.
2. Keep only the routes your application needs in `src/router/routes.ts`.
3. Select a primary UI library and remove the other examples and dependencies.
4. Run `pnpm check` before committing.
