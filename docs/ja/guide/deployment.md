# デプロイ

`pnpm check` と `pnpm build` を実行し、`dist` を Nginx/CDN に配置します。History Router のため `try_files` で `index.html` に戻します。

PWA は `VITE_PWA_ENABLED=true` のときだけ有効で、認証 API を既定では Cache しません。画像最適化は Production のみです。

Gateway は `/api/ai` を FastAPI、残りの `/api` を Gin に転送します。SSE は Buffering と変換を無効化し、Read Timeout を調整します。PostgreSQL と Redis は Private Network に置き、Secret Manager、TLS、Backup、監視を利用します。

CSP は実際の API、Image CDN、Monitoring Domain に合わせて設定し、Mock や Debug Tool を Production に含めません。

