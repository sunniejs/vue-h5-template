# コマース実装例

- `/shop`: 公開商品一覧、検索、カテゴリ、並び替え、Infinite Query。
- `/shop/products/:id`: 3言語詳細、数量、Safe Area 対応購入バー。
- `/shop/admin/products`: admin の商品作成、編集、公開状態、論理削除。

契約は OpenAPI から生成し、金額は整数の最小通貨単位で保存します。商品名、特徴、説明は `zh-CN`、`en-US`、`ja-JP` が必須です。画像 URL は同一 Origin または HTTPS だけを許可します。

`pnpm dev` は同じ契約の Mock、`pnpm dev:integration` は Gin/PostgreSQL を使います。Remote State は TanStack Query が管理し、Pinia には保存しません。

