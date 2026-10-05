# Vue H5 Template Lite

[简体中文](README.md) · [English](README.en.md)

Lite は Vue 3、Vite 7、JavaScript を使用しています。商品一覧・詳細、カート、お気に入り、商品管理、ログイン、会員ページ、プロジェクト管理、リクエストのデモ、中断可能な AI ストリーミングチャットを備えています。画面は簡体字中国語、英語、日本語に対応しています。

## ローカル開発

Node.js 20.19 以降の 20.x 系、または Node.js 22.12 以降と、pnpm 9 を使用してください。

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test:coverage
pnpm exec playwright install chromium
pnpm test:e2e
```

開発時は既定でモックを使用します。空欄でなければ任意のユーザー名とパスワードでログインを試せます。本番環境ではバックエンドで認証します。セッションは現在のブラウザータブに保持され、アップグレード後は再ログインが必要です。旧 `/list` と `/details` は新しい商品一覧に移動します。旧デモの商品インデックスに対応する新商品 ID はありません。`/demo` は選択中の UI フレームワークのデモを開きます。

## 設定とビルド

- `VITE_UI_FRAMEWORK` には `vant`（既定）、`nutui`、`varlet` を指定できます。ビルドごとに選んだフレームワークを読み込みます。
- `pnpm dev:integration` を実行すると、業務リクエストは Gin（既定ポート 8002）、AI リクエストは FastAPI（既定ポート 8001）に転送されます。`.env.example` の変数で接続先とプレフィックスを変更できます。業務 API には旧 `VITE_URL_PREFIX` も使用できます。ローカルの動作はモックで確認済みです。実サービスとの完全な連携には、このブランチの OpenAPI 仕様に準拠したサービスが必要です。隣接する Go サービスはルートとログインのデータ形式が異なり、プロジェクトとリクエストデモの API がありません。全機能を利用するには互換ゲートウェイまたはアダプターが必要です。
- `pnpm build` は History ルーティングに対応した静的サーバー向けの `dist/` を生成します。本番用の業務 API と AI のゲートウェイを設定し、AI プロキシのレスポンスバッファリングを無効にしてください。モックとデバッグツールは開発専用です。
- `VITE_PWA_ENABLED=true` で PWA が有効になります。旧 `VITE_USE_PWA=true` も使用できます。Service Worker は静的アプリのアセットを事前キャッシュします。 PWA を無効にする場合も、`Cache-Control: no-cache` を指定して `/sw.js` を配信してください。ブラウザーが更新を確認すると旧 Lite の登録と `api-cache` が削除されます。新規アクセス時に Service Worker は登録されません。
- API の仕様は [OpenAPI 定義](openapi/schema.yaml) を参照してください。

[Vue 2 ブランチ](https://github.com/sunniejs/vue-h5-template/tree/vue2-h5-template) · [プロジェクト文書](https://sunniejs.github.io/vue-h5-template/)
