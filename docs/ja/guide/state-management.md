# 状態管理

- Pinia：Token、ユーザー、テーマ、Feature Flag など Client 所有の状態。
- TanStack Query：API Cache、Loading、Retry、Mutation、Pagination、Invalidation。
- Local State：Form 入力や一時 UI。
- `useStreamingChat`：AI Conversation、AbortController、再生成、Error。

Server Response を Pinia にコピーすると Cache が二重になるため禁止します。Query Key は Domain と Filter を含め、Component Unmount や Filter 変更時に `AbortSignal` を Transport まで渡します。

