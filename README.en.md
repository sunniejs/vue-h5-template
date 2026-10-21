# Vue H5 Template Documentation

[简体中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

This branch contains the VitePress documentation source, separate from the application source.

| Branch | Purpose |
| --- | --- |
| `vue-h5-template` | Vue application source |
| `docs` | VitePress Markdown, configuration and publishing workflow |
| `gh-pages` | Generated site; GitHub Pages publishes its root directory |

Documentation: https://sunniejs.github.io/vue-h5-template/

## Local development and validation

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

`pnpm build` writes `docs/.vitepress/dist`. This output is separate from the application branch's `dist` directory.

## Publishing

Pushing `docs` triggers `.github/workflows/deploy.yml`. It reads the pnpm version from `package.json`, installs frozen dependencies, builds the site, publishes the output to the root of `gh-pages`, then explicitly requests a GitHub Pages build. The workflow uses `GITHUB_TOKEN` with `contents: write` and `pages: write`; no additional personal token is needed.

Keep Settings → Pages configured for branch publishing from `gh-pages` / `/(root)`. Do not select the `docs` branch or the `/docs` folder, and do not edit generated HTML on `gh-pages`. Verify the workflow, the published branch and the live pages; a successful source push alone does not confirm publication.

## Maintaining content

- Simplified Chinese: `docs/guide`
- English: `docs/en/guide`
- Japanese: `docs/ja/guide`
- VitePress configuration: `docs/.vitepress/config.js`

Documentation follows the current implementation on `vue-h5-template`. Update pages and sidebars in all three languages when behavior changes.
