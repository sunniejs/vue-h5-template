# コマース実装例

- `/shop`: 公開商品一覧、検索、カテゴリ、並び替え、Infinite Query。
- `/shop/products/:id`: 3言語詳細、数量、Safe Area 対応購入バー。
- `/shop/admin/products`: admin の商品作成、編集、公開状態、論理削除。

契約は OpenAPI から生成し、金額は整数の最小通貨単位で保存します。商品名、特徴、説明は `zh-CN`、`en-US`、`ja-JP` が必須です。画像 URL は同一 Origin または HTTPS だけを許可します。

`pnpm dev` は Mock、`pnpm dev:integration` は Gin/FastAPI のプロキシを設定します。実サービスを使う前に、以下の契約の差を確認してください。Remote State は TanStack Query が管理し、Pinia には保存しません。

## お気に入り操作とセッションの分離

`FavoriteButton` に数値の `productId` と現在の `session` トークンを渡します。未ログイン時はログインリンクを表示し、非公開の状態を取得しません。ログイン後は保存済みの状態を読み込んでから操作を有効にします。取得失敗時は再試行でき、保存失敗時は最後に確認した状態を保ってエラーを表示します。取得・保存中の二重送信を防ぎます。

状態は TanStack Query が管理します。キーはコントロールのインスタンス、セッションの世代、商品 ID から構成し、トークンを含めません。更新時に元のキーを保持するため、古い応答が別のアカウントや商品の状態を上書きしません。再マウントやセッション変更で再取得します。サーバーに状態の反転を依頼せず、明示的な真偽値を送ります。

```text
GET  /api/product/favorite?id=1
POST /api/product/favorite
{ "productId": 1, "favorite": true }
```

`src/components/shop/FavoriteButton.vue` → `src/api/modules/favorites.ts` → `apiClient`.

応答の包装への対応は、パスや商品フィールドの変換を意味しません。単体アプリの商品 API は `/api/products` と多言語 `name`／`priceCents`、現在の Gin は `/api/product/list` と `title`／`price` です。ログインにも `name`／`token` と `username`／`accessToken` の差があります。全面的な連携を確認する前に契約を照合するか、明示的なドメインアダプターを追加してください。新しいお気に入りパスは Gin に一致しますが、認証には互換性のある発行済み JWT が必要です。

## 商品リンクとページの再利用

詳細ページでは JavaScript の安全な整数範囲に収まる、正の十進整数 ID のみを受け付けます。ID の欠落、重複、負数、小数、指数表記、範囲超過は詳細 API を呼ばず、無効なリンクの案内と商品一覧へのリンクを表示します。

同じコンポーネントで商品が切り替わると、数量を 1 に戻し、前の商品の操作結果を消去します。在庫の更新時は数量を在庫範囲に収め、在庫切れや販売対象外の商品では購入と数量の操作を無効にします。詳細データは引き続き TanStack Query が管理して `AbortSignal` を渡し、カートに別のサーバーキャッシュを作りません。

[API](./request.md) · [テスト](./testing.md)
