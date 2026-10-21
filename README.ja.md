# Vue H5 Template ドキュメント

[简体中文](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md)

このブランチには VitePress ドキュメントのソースを置き、アプリケーションのソースとは分けて管理します。

| ブランチ | 用途 |
| --- | --- |
| `vue-h5-template` | Vue アプリケーションのソース |
| `docs` | VitePress の Markdown、設定、公開ワークフロー |
| `gh-pages` | 生成したサイト。GitHub Pages はルートディレクトリを公開 |

ドキュメント：https://sunniejs.github.io/vue-h5-template/

## ローカル開発と確認

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

`pnpm build` は `docs/.vitepress/dist` に出力します。アプリケーション側の `dist` とは別の成果物です。

## 公開

`docs` への push で `.github/workflows/deploy.yml` が実行されます。`package.json` の pnpm バージョンを使用し、固定した依存関係をインストールしてサイトをビルドします。成果物を `gh-pages` のルートへ配置した後、GitHub Pages のビルドを明示的に要求します。`GITHUB_TOKEN` に `contents: write` と `pages: write` を指定しており、個人用 Token の追加は不要です。

Settings → Pages のブランチ公開元は `gh-pages` / `/(root)` を維持します。`docs` ブランチや `/docs` フォルダーへ変更したり、`gh-pages` の生成済み HTML を直接編集したりしないでください。ソースの push だけで完了とせず、ワークフロー、公開ブランチ、実際のページを確認します。

## 内容の更新

- 簡体字中国語：`docs/guide`
- 英語：`docs/en/guide`
- 日本語：`docs/ja/guide`
- VitePress 設定：`docs/.vitepress/config.js`

内容は `vue-h5-template` ブランチの現行実装に合わせます。機能を変更した場合は、3 言語のページとサイドバーを同時に更新してください。
