# リクエストと認証

ページから Axios を直接 import せず、`src/api/modules` の Domain 関数を使います。JSON API は `ApiResponse<T>` を展開し、失敗は `ApiError` に正規化します。Token と任意の Request ID は Request Interceptor が追加します。

HTTP、Business Error、401、Timeout、Network、Cancel を区別します。401 は Session を削除し、安全な内部 Redirect だけを Login に渡します。

契約変更時：

```bash
pnpm api:generate
pnpm typecheck
```

`openapi/schema.yaml` と生成済み `src/types/api/generated.d.ts` を同時に Commit します。

## REST 契約とキャンセル

単体アプリの通信層は、実サービスの `code: 0`／`message` と旧 Mock の 2xx 業務コード／`msg` に対応します。いずれも `data` を返し、失敗は `ApiError` です。HTTP 2xx だけで業務の成功を判定しません。

以下の関数は包装を外したデータを返し、失敗は `ApiError` として通知します。取得には Query の `AbortSignal` を渡します。更新には起動時に設定した認証クライアントを使い、呼び出し側から所有者 ID を送信しません。

単体アプリでは `VITE_AI_API_BASE_URL`（既定 `/api/ai`）で提案を取得し、開発プロキシを `VITE_AI_API_TARGET` で指定します。通常の業務通信は Gin に送ります。JSON は `src/api/modules/ai.ts`、ストリーミングはプロバイダーと composable が担当します。

応答の包装への対応は、パスや商品フィールドの変換を意味しません。単体アプリの商品 API は `/api/products` と多言語 `name`／`priceCents`、現在の Gin は `/api/product/list` と `title`／`price` です。ログインにも `name`／`token` と `username`／`accessToken` の差があります。全面的な連携を確認する前に契約を照合するか、明示的なドメインアダプターを追加してください。新しいお気に入りパスは Gin に一致しますが、認証には互換性のある発行済み JWT が必要です。
