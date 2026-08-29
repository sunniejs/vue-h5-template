# リクエストと認証

ページから Axios を直接 import せず、`src/api/modules` の Domain 関数を使います。JSON API は `ApiResponse<T>` を展開し、失敗は `ApiError` に正規化します。Token と任意の Request ID は Request Interceptor が追加します。

HTTP、Business Error、401、Timeout、Network、Cancel を区別します。401 は Session を削除し、安全な内部 Redirect だけを Login に渡します。

契約変更時：

```bash
pnpm api:generate
pnpm typecheck
```

`openapi/schema.yaml` と生成済み `src/types/api/generated.d.ts` を同時に Commit します。

