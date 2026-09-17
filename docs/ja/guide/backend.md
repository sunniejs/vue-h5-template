# バックエンド連携

Go/Gin の業務サービスは 8002 で認証・商品・お気に入りを担当し、FastAPI は 8001 で AI JSON／SSE を担当します。各サービスのクイックスタートで起動した後、登録済みの `.env.integration` を使います。

```text
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
VITE_AI_API_BASE_URL=/api/ai
VITE_API_TARGET=http://127.0.0.1:8002
VITE_AI_API_TARGET=http://127.0.0.1:8001
VITE_REQUEST_ID_ENABLED=true
VITE_PWA_ENABLED=false
```

```bash
pnpm dev:integration
```

## 先にそろえる API 契約

Vite のプロキシは転送のみを行い、契約を変換しません。画面全体を実サービスにつなぐ前に、次の差を解消してください。

- ログイン：フロントエンドは `name` を送り `token` を読みます。Gin は `username` を受け取り `accessToken` を返します。
- ユーザー：フロントエンドは `/api/user/profile`、Gin は `/api/user/info` を使います。
- 商品：フロントエンドは `/api/products`、`/api/products/:id` と多言語 `name`、`priceCents` を使います。Gin は `/api/product/list`、`/api/product/detail?id=…` と `title`、`price` を使います。
- フロントエンドに Project CRUD 契約はありますが、現在の Gin Router に対応ルートはありません。

## 追加機能の連携範囲

お気に入りの GET／POST パスは Gin に一致しますが、Gin 発行の JWT と公開商品の ID が必要です。Mock のトークンは実サービスで使えません。提案 API は公開 JSON で、ログインと切り離して確認できます。通信層が応答形式に対応していても、セッション全体の連携確認にはなりません。

## 確認方法

まず以下の API を確認し、その後にブラウザをつなぎます。`BUSINESS_USER_JWT` は実際の業務ログイン応答から取得し、アカウントはサービス側の開発設定を使ってください。古い文書の認証情報を前提にしません。Mock E2E は実 DB・サービス間連携の検証を代替しません。

```bash
curl -s 'http://127.0.0.1:8001/api/ai/suggestions?locale=ja-JP'
curl -s 'http://127.0.0.1:8002/api/product/favorite?id=1' \
  -H "Authorization: Bearer $BUSINESS_USER_JWT"
```

[API](./request.md) · [AI Chat](./ai-chat.md) · [Commerce](./commerce.md)
