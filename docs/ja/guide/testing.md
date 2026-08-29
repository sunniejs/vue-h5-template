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

