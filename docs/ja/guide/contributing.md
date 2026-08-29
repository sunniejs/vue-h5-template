# コントリビューション

変更前に `AGENTS.md` を読み、Layer Boundary、API、State、UI、Test の規則に従ってください。Public Contract 変更は OpenAPI と生成 Type、三言語 Documentation を同期します。

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

PR では Loading、Empty、Error、Offline、Abort、Safe Area、Keyboard、Accessibility、Security を確認します。実ユーザー情報、Token、Provider Key、Production Credential を Commit してはいけません。

