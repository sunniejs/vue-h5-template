# Vue H5 Template v2

[简体中文](./README.md) | [English](./README.en.md) | 日本語

モバイル H5 アプリケーション向けの Vue 3 テンプレートです。型付き API クライアント、OpenAPI からの型生成、TanStack Query、中断可能な AI ストリーミングチャット、PWA、SVG スプライト、本番ビルド時の画像最適化、UI フレームワークの選択、各種テストを備えています。

[日本語ドキュメント](https://sunniejs.github.io/vue-h5-template/ja/) · [v2 への移行](https://sunniejs.github.io/vue-h5-template/ja/guide/migration-v2)

## 主な機能

- Vue 3.5、Vite 8 / Rolldown、TypeScript 5.9、Vue Router 4、Pinia 3。
- サーバーの状態は TanStack Vue Query、クライアントの状態は Pinia で管理。
- `ApiResponse<T>`、`ApiError`、リクエスト ID、トークン、401 の共通処理、タイムアウト・通信エラーの正規化に対応した Axios クライアント。
- `pnpm api:generate` によるローカル OpenAPI スキーマからの型生成。
- POST SSE、`ReadableStream`、`AbortController`、再生成、再試行、Markdown、コードブロック、DOMPurify に対応した AI チャット。
- 12 件以上の多言語商品、検索、カテゴリ、引っ張って更新、ページ分割、商品詳細、カート、商品管理。
- 納品プロジェクトの表示・作成・編集・削除とステータス絞り込み。Vite Mock と Gin + PostgreSQL で API 契約を共有。
- `src/assets/icons` の SVG スプライトと型付き `<SvgIcon />`。
- Vant・NutUI・Varlet から本番ビルドに含めるフレームワークを一つ選択。
- 任意で有効化できる PWA。既定では API をキャッシュせず、アプリシェルと静的画像を対象にする。
- Sharp と SVGO による、本番ビルド時のみの PNG/JPEG/WebP/SVG 最適化。
- Vitest、Vue Test Utils、Playwright によるロジック・操作・ブラウザのテスト。
- 文字、余白、角丸、色、コントロール、アニメーションの共通トークン。デスクトップでは下部ナビゲーションをコンパクトな上部ナビゲーションに切り替え。
- 中国語・英語・日本語の遅延読み込み。本文、ナビゲーション、ページタイトルを同期。
- Lint、フォーマット、Husky、lint-staged、Commitlint、GitHub Actions、Release Please。

## クイックスタート

Node.js `>=22.12.0`、pnpm `>=9.12.0` が必要です。

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

開発時は既定で Mock API を使います。空でないユーザー名とパスワードでログインできます。三つ目のナビゲーションタブから技術サンプルを開けます。フローティング AI ボタンは `/ai/chat` を開き、開発用 Mock が `POST /api/ai/chat` から SSE を順次返します。

`/shop`、`/shop/cart`、`/examples/request`、`/examples/workspace` にも直接アクセスできます。リクエストのサンプルでは HTTP 400/401/403/404/409、業務エラー 422、サーバーエラー、タイムアウトを確認できます。納品プロジェクトの CRUD は Mock と実バックエンドの両方に対応しています。

## よく使うコマンド

```bash
pnpm lint             # コードとスタイルの検査
pnpm typecheck        # vue-tsc のプロジェクト参照を検査
pnpm test             # 単体・コンポーネントテスト
pnpm test:coverage    # コアロジックのカバレッジ検査
pnpm test:e2e         # 操作フロー、レスポンシブ表示、ダークモード
pnpm build            # 本番ビルド
pnpm check            # lint、型検査、テスト、ビルド
pnpm api:generate     # OpenAPI から TypeScript を生成
```

`pnpm check` は E2E を含みません。CI では基本検査の後に Playwright を実行します。

## ディレクトリの責務

```text
src/
├── api/                 # Axios 通信層とドメイン別 API
├── components/          # ページやルートに依存しない再利用 UI
├── composables/         # Vue のライフサイクルとリアクティブな処理
├── layout/              # アプリシェル、ナビゲーション、セーフエリア
├── plugins/             # Vue Query などのアプリ用プラグイン
├── router/              # 明示的なルート、メタ情報、ガード
├── services/            # フレームワークに依存しないプロバイダーと通信処理
├── store/               # Pinia によるクライアント状態
├── types/               # API、AI、アイコンの型
├── utils/               # Vue のライフサイクルに依存しない純粋関数
└── views/               # 遅延読み込みするページ
```

詳しい開発規約は [`AGENTS.md`](./AGENTS.md) を参照してください。コーディングエージェントもこのファイルを基本の指示として使います。

## 状態管理

- Pinia はログインセッション、カート、テーマ、機能フラグなどを管理します。
- TanStack Query はリモートデータ、キャッシュ、再試行、キャンセル、更新処理、ページ分割を管理します。
- AI の会話ライフサイクルは `useStreamingChat` が管理します。通信は `services/ai` のプロバイダーが担当し、会話状態は Pinia や Query キャッシュに複製しません。

## API と OpenAPI

ページから Axios を直接呼び出さず、型付きのドメイン API を使います。エラーは `isApiError` で絞り込み、`catch (error: any)` は使いません。

バックエンドの契約を更新する手順は次のとおりです。

1. `openapi/schema.yaml`、または `api:generate` の入力 URL を更新します。
2. `pnpm api:generate` を実行します。
3. API モジュールから `src/types/api/generated.d.ts` のスキーマを参照します。
4. スキーマと生成ファイルを一緒にコミットし、型検査で契約の不整合を検出できるようにします。

## お気に入りとチャットの提案

商品詳細は `GET /api/product/favorite?id=1` でログイン中のユーザーのお気に入り状態を取得し、`POST /api/product/favorite` で明示的な真偽値を保存します。取得には認証が必要で、公開商品のみが対象です。同じ書き込みを繰り返しても結果は変わりません。二重送信を防ぎ、アカウント切り替え前の応答を分離します。

チャットは AI ゲートウェイの `GET /api/ai/suggestions?locale=ja-JP` を利用し、通信に失敗した場合は翻訳済みのローカル提案を表示します。対応言語は `en-US`、`zh-CN`、`ja-JP` です。提案の取得でモデルは呼び出しません。両サービスは `/api/v1` にも対応します。

## AI プロバイダー

プロバイダーは特定のベンダーに依存しない、小さなインターフェースです。

```ts
interface ChatProvider {
  chat(
    messages: readonly ChatMessage[],
    options?: ChatOptions,
  ): AsyncIterable<ChatChunk>;
}
```

既定の `FetchStreamChatProvider` は標準 SSE を解析します。OpenAI、Claude、Gemini、DeepSeek などへのリクエストは信頼できるバックエンドを経由させてください。認証情報を `VITE_*` 変数やブラウザのリクエストに含めないでください。Vercel AI SDK の data stream protocol など、別の形式にはプロバイダーアダプターで対応できます。

## UI フレームワークの選択

```env
VITE_UI_FRAMEWORK=vant # vant | nutui | varlet
```

Vite は選択したフレームワークの resolver と `#ui-demo` エイリアスを使います。テンプレートには三つの依存関係を含めていますが、本番ビルドに入るのは選択したフレームワークだけです。

各フレームワークのサンプルには、ボタン、セル・リスト、スイッチ、タグ・チップ、進捗表示があります。

## 国際化

`src/locales/langs` に `zh-CN`、`en-US`、`ja-JP` の翻訳があります。ホームの言語選択で翻訳を遅延読み込みし、本文、ナビゲーション、ルートタイトル、`document.title`、`<html lang>` を更新します。言語を追加する場合は `SUPPORTED_LOCALES` に登録し、`common.json` のキーをそろえてください。

## 連携するバックエンド

バックエンドは二つのリポジトリに分かれています。業務サービスの `vue-h5-template-business-service` は認証、ユーザー、納品プロジェクト、商品、PostgreSQL を担当します。AI サービスの `vue-h5-template-ai-service` はプロバイダー連携、POST SSE、Redis によるレート制限を担当します。親ワークスペースの Compose 設定でローカル連携環境を起動します。

```bash
# ターミナル 1：PostgreSQL、Gin、FastAPI、Redis を起動
cd <workspace>/backend/vue-h5-template
docker compose up --build

# ターミナル 2：登録済みの連携用環境設定を利用
cd <workspace>/frontend/vue-h5-template
pnpm dev:integration
```

Vite が表示する URL を開き、`demo / demo1234` でログインします。`/shop` は公開商品、`/shop/admin/products` は多言語の商品管理、`/examples/workspace` は納品プロジェクト管理です。`/ai/chat` は同じ JWT を SSE リクエストで FastAPI に送ります。バックエンド側の `python3 scripts/smoke.py` で、Vue のプロキシから Gin、PostgreSQL、FastAPI SSE までの経路を確認できます。

通常の `pnpm dev` はフロントエンドの Mock を使うため、バックエンドは不要です。既存のローカル Compose 設定で案内している DB 接続は `localhost:5432 / vue_h5_business / vue_h5 / vue_h5_local` で、認証情報はローカル開発専用です。各リポジトリの `docs` ブランチには中国語・英語・日本語の開発ドキュメントがあります。AI のキーは FastAPI 側だけに設定します。

## PWA と画像最適化

```env
VITE_PWA_ENABLED=false
VITE_IMAGE_OPTIMIZE=true
```

PWA は既定で無効です。有効にするとアプリシェルと静的画像をキャッシュしますが、`/api` は対象外です。画像最適化は本番ビルド時だけ実行します。CDN 側で既に画像を処理している場合は無効にできます。

## ブラウザとセキュリティ

対象は iOS Safari 15 以降、Android Chrome 80 以降、および現在の WeChat・WeCom WebView です。Markdown の生 HTML を無効にし、DOMPurify でサニタイズします。リダイレクト先はサイト内の絶対パスだけを許可します。本番の Mock は既定で無効です。サンプルの認証トークンは `sessionStorage` に保存します。

本番環境では SameSite・Secure・HttpOnly 属性の Cookie と BFF の構成を検討し、ゲートウェイで CSP、CSRF 対策、レート制限を設定してください。

## ドキュメントとリリース

`docs` ブランチでは、アーキテクチャ、バックエンド連携、商品・購入フロー、API、状態管理、チャット、UI、テスト、デプロイ、v2 移行を三言語で説明しています。Conventional Commits に基づき、Release Please がバージョン、CHANGELOG、GitHub Release を更新します。

更新の判断、性能データ、破壊的変更、今後の作業は [`V2_UPGRADE_REPORT.md`](./V2_UPGRADE_REPORT.md) を参照してください。

## 今後の拡張

- 基本機能として実装済み：認証、ルート権限、エラー境界、通信状態、システム連動のダークテーマ、遅延ルート、安全な Markdown、PWA と API キャッシュの分離、開発・テスト基盤。
- 製品の要件に応じて追加：Gateway/JWKS 認証、Gin OpenAPI の自動出力、DB バックアップとロールバック、機能フラグ、分析・エラー収集アダプター、アップロード、仮想リスト、WebView ブリッジ、性能計測、テーマ切り替え。
- 任意の連携：QR・カメラ・Web Share、ディープリンク、SSR/SSG、CDN 外部化、ネイティブアプリとのブリッジ。製品と配信環境で必要なものだけを導入します。

## ライセンス

[MIT](./License)
