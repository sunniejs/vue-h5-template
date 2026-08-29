# v2 への移行

主な Breaking Change：pnpm のみ、明示 Router、新しい `api/client.ts` と Domain Module、`ApiError`、Pinia/Query の責務分離、3言語 Locale、UI Framework のビルド時選択、独立した Gin/FastAPI Backend です。

推奨手順：新しい v2 Template から Branch を作成し、Business Page を段階的に移します。API Contract を OpenAPI に合わせ、Server State を TanStack Query に移し、旧 Request Wrapper と複数 UI Global Install を削除します。

各段階で `pnpm check` と重要 Flow の Playwright を実行し、最後に Compose Smoke Test を行います。

