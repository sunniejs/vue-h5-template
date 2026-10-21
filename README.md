# Vue H5 Template 文档

[简体中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

本分支维护 VitePress 文档源码，不包含应用源码。

| 分支 | 用途 |
| --- | --- |
| `vue-h5-template` | Vue 应用源码 |
| `docs` | VitePress Markdown、配置和发布工作流 |
| `gh-pages` | 构建产物，GitHub Pages 从分支根目录发布 |

文档站点：https://sunniejs.github.io/vue-h5-template/

## 本地开发与检查

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

`pnpm build` 的产物位于 `docs/.vitepress/dist`。它与应用分支的 `dist` 目录用途不同。

## 发布

推送 `docs` 分支会触发 `.github/workflows/deploy.yml`：读取 `package.json` 中的 pnpm 版本，安装锁定依赖，构建文档，把产物发布到 `gh-pages` 根目录，再显式请求 GitHub Pages 构建。工作流使用 `GITHUB_TOKEN`，声明 `contents: write` 和 `pages: write`，无需新增个人 Token。

仓库 Settings → Pages 的分支发布来源应保持 `gh-pages` / `/(root)`。不要把它改成 `docs` 分支或 `/docs` 文件夹，也不要直接在 `gh-pages` 修改 HTML。发布成功要同时核对工作流、`gh-pages` 更新和线上页面，不能只看源码 push 是否成功。

## 内容维护

- 简体中文：`docs/guide`
- 英文：`docs/en/guide`
- 日文：`docs/ja/guide`
- VitePress 配置：`docs/.vitepress/config.js`

文档内容以 `vue-h5-template` 分支的当前实现为准。功能变更同步更新三种语言的页面和侧边栏。
