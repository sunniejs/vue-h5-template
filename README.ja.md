# Vue H5 Template · Vue 2

[简体中文](README.md) · [English](README.en.md) · 日本語

このブランチは Vue 2.7、Vue CLI 5、Vant 2、Vue Router 3、Vuex 3 で動作します。JavaScript の単一ファイルコンポーネントとハッシュルーティングを使用します。旧 URL の `/#/about` は会員ページにリダイレクトされます。UI コンポーネントのデモには Vant 2 を使用します。

## ローカル起動

Node.js 22.12 以降と pnpm 9.15.9 が必要です。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

`http://127.0.0.1:9020/#/home` を開きます。開発モックは空欄でないユーザー名とパスワードを受け付けます。データはサーバーの再起動時に初期化されます。`pnpm serve` でも開発サーバーを起動でき、`pnpm stage` はステージング用のビルドを生成します。

## ページと状態管理

- ショップでは多言語の商品一覧、検索、絞り込み、ページング、商品詳細、ログイン後のお気に入り、カート、商品管理を利用できます。購入手続きボタンは操作例です。
- サンプルにはプロジェクトの CRUD、TanStack Query、リクエストエラー、モバイル向けレイアウト、SVG アイコン、Vant 2 が含まれます。
- 会員ページは API からプロフィールを取得します。セッションとカートは Vuex、サーバーデータは TanStack Query、会話はチャットページで管理します。
- AI アシスタントは SSE ストリーミング、停止、再試行、DOMPurify で無害化した Markdown 表示に対応します。表示言語は簡体字中国語、英語、日本語から選べます。

## API とデプロイ

フロントエンドは [OpenAPI 契約](openapi/schema.yaml) に従います。`pnpm dev:integration` はモックを無効にし、`/api/ai` をポート 8001 の FastAPI に、その他の `/api` をポート 8002 の Gin に転送します。[.env.example](.env.example) を参考に `.env.integration.local` で転送先とパスを変更できます。バックエンドがパスのプレフィックスを省略する場合は `VUE_APP_API_PROXY_REWRITE` または `VUE_APP_AI_API_PROXY_REWRITE` を設定します。

関連する Gin プロジェクトの `/api/product/list` や `accessToken` は、フロントエンドの契約と異なります。商品、ログイン、プロジェクト、サンプルの API にはゲートウェイまたはバックエンド側の変換が必要です。開発モックはフロントエンドの契約に対応します。`pnpm build` の出力 `dist/` を配信し、本番ゲートウェイまたは API の接続先を設定します。AI プロバイダーの認証情報はサーバー側で管理します。

HTTPS または localhost で配信する場合、`VUE_APP_PWA_ENABLED=true pnpm build` でインストール可能なオフラインシェルを有効にできます。Service Worker はビルド済みの静的ファイルのみを事前キャッシュし、API リクエストはネットワークに送信します。オフライン時の案内は `/#/offline` で表示できます。
