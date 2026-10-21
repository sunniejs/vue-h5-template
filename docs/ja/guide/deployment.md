# デプロイ

`pnpm check` と `pnpm build` を実行し、`dist` を Nginx/CDN に配置します。History Router のため `try_files` で `index.html` に戻します。

PWA は `VITE_PWA_ENABLED=true` のときだけ有効で、認証 API を既定では Cache しません。画像最適化は Production のみです。

Gateway は `/api/ai` を FastAPI、残りの `/api` を Gin に転送します。SSE は Buffering と変換を無効化し、Read Timeout を調整します。PostgreSQL と Redis は Private Network に置き、Secret Manager、TLS、Backup、監視を利用します。

CSP は実際の API、Image CDN、Monitoring Domain に合わせて設定し、Mock や Debug Tool を Production に含めません。


## このドキュメントサイトの公開

`vue-h5-template` はアプリケーションのソース、`docs` は VitePress のソース、`gh-pages` は生成した静的ページを管理します。`docs` に push すると、`pnpm install --frozen-lockfile` と `pnpm build` を実行し、`docs/.vitepress/dist` を `gh-pages` のルートへ配置して GitHub Pages のビルドを要求します。pnpm のバージョンは `package.json` の `packageManager` のみに指定し、Action の `version` との重複を避けます。

リポジトリのブランチ公開元は `gh-pages` / `/(root)` を維持します。上記のアプリケーション用 `dist` はドキュメントの成果物ではなく、Markdown をそのまま公開するものでもありません。Actions の成功、`gh-pages` の更新、中国語・英語・日本語ページの実際の内容を確認してください。
