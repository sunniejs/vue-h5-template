# AI Chat と Streaming

フロントエンドは Provider 非依存の `ChatProvider` と `AsyncIterable<ChatChunk>` を使います。`FetchStreamChatProvider` が `POST /api/ai/chat` を呼び、`parseSseStream` が `start / delta / usage / done / error` を解析します。

`useStreamingChat` は Message、Streaming、Abort、Retry、Regenerate を管理します。Stop は `AbortController.abort()` を即時実行します。

Markdown は Raw HTML を無効にし、DOMPurify で再度 Sanitization します。AI HTML を信頼して `v-html` に直接渡してはいけません。大きい Syntax Highlighter は必要な Route で Dynamic Import します。

FastAPI は Gin JWT を検証し、Redis でユーザー単位に制限します。Provider Key は Backend だけに保存します。

