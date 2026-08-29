# アーキテクチャ

```text
views -> components / composables -> api modules / services -> transport / types
main  -> plugins / router / store
build -> Vite plugins
```

`api/client.ts` は Axios、Interceptor、Response 展開、`ApiError` だけを担当します。Domain Endpoint は `api/modules`、Framework 非依存 Provider は `services`、Vue Lifecycle は `composables` に配置します。

Route は明示的な `RouteRecordRaw` を維持します。現在の規模では Permission、Layout、title、KeepAlive、Lazy Chunk をレビューしやすく、File Routing を導入する利益より複雑性が大きいためです。

Pinia は Client State、TanStack Query は Server State、AI Conversation は `useStreamingChat` が管理します。3つの UI Framework を同一 Production Bundle に入れません。

