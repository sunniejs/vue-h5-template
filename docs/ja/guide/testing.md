# テスト

Vitest は Utility、Request Error、Store、Streaming Parser/Composable、Login Form、Chat Composer、Locale を検証します。Vue Test Utils は Public Behavior を対象にし、Implementation Detail だけの Test は追加しません。

Playwright の Pixel 7 Project は Home、3言語切替、Shop、Login、Mock API、AI Streaming、401 Redirect を検証します。

```bash
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm check
```

実バックエンド変更時は Compose と Smoke Script、Gin の `go test ./...`、FastAPI の Ruff/mypy/pytest も実行します。

## 追加機能の回帰テスト

API テストでは ID、本文、キャンセル、言語変換、AI の base URL とエラー伝播を確認します。コンポーネントテストでは未ログイン、保存・解除、取得の再試行、保存失敗、アカウント変更後の古い応答を検証します。ストリーミング composable は停止・キャンセル・並行した処理を検証し、リモート提案とローカルへの切り替えはブラウザで確認します。QueryClient はテストごとに作成・破棄します。

```bash
pnpm test tests/api/features.test.ts tests/api/client.test.ts tests/components/FavoriteButton.test.ts
pnpm test:coverage
pnpm test:e2e
```

Playwright は再読み込み後のお気に入り、解除、リモート提案、通信失敗時のローカル提案を確認します。ストリーミングテストは固定の質問を入力し、提案の文言に依存させません。これらは開発用 Mock の検証であり、PostgreSQL/Redis の統合テストには別の環境設定が必要です。

以下のアプリ用テストはアプリ側の作業ディレクトリで実行してください。この `docs` ブランチでは `pnpm build` で VitePress を検証します。現在の実行結果を確認してください。
