# AI Chat と Streaming

フロントエンドは Provider 非依存の `ChatProvider` と `AsyncIterable<ChatChunk>` を使います。`FetchStreamChatProvider` が `POST /api/ai/chat` を呼び、`parseSseStream` が `start / delta / usage / done / error` を解析します。

`useStreamingChat` は Message、Streaming、Abort、Retry、Regenerate を管理します。Stop は `AbortController.abort()` を即時実行します。

Markdown は Raw HTML を無効にし、DOMPurify で再度 Sanitization します。AI HTML を信頼して `v-html` に直接渡してはいけません。大きい Syntax Highlighter は必要な Route で Dynamic Import します。

FastAPI は Gin JWT を検証し、Redis でユーザー単位に制限します。Provider Key は Backend だけに保存します。

## 言語別の開始用プロンプト

チャットの空状態は JSON の `GET /api/ai/suggestions` を使います。言語別にキャッシュし、鮮度を五分間に設定して自動再試行を無効にしています。読み込み中、空の結果、通信失敗時には翻訳済みのローカル提案を使います。選択後は既存の送信・停止処理に進み、SSE 契約や会話の保存処理は変更しません。

クライアントは `zh-*` を `zh-CN`、`ja-*` を `ja-JP`、その他を `en-US` に変換します。FastAPI が受け付けるのはこの三つの値のみです。省略時は `en-US`、未対応の値は HTTP 422 です。言語は `locale` クエリで指定し、`Accept-Language` だけには依存しません。

単体アプリでは `VITE_AI_API_BASE_URL`（既定 `/api/ai`）で提案を取得し、開発プロキシを `VITE_AI_API_TARGET` で指定します。通常の業務通信は Gin に送ります。JSON は `src/api/modules/ai.ts`、ストリーミングはプロバイダーと composable が担当します。

```ts
import { getChatSuggestions } from '@/api/modules/ai';

const prompts = await getChatSuggestions(locale, signal, '/api/ai');
```

## ストリームの終了と後処理

パーサーは旧 Mock の `start.conversationId` / `done` と FastAPI の `start.id` / `finish` の両方を受け取り、内部の `ChatChunk` に変換します。UTF-8 の文字や CRLF 区切りが通信チャンクをまたいでも処理できます。終了イベントで読み取りを終え、途中終了や解析失敗時には reader をキャンセルしてロックを解放します。HTTP エラーではサーバーの `message` と Request ID を保持します。

停止やクリアでは送信中の状態をすぐに解除し、通信のキャンセルを要求します。独自 Provider がキャンセルを無視しても、古い応答が新しい会話のメッセージ、ID、使用量、エラーを書き換えることはありません。コンポーネントの setup または Vue effect scope 内で使う場合、scope の破棄時に自動停止します。scope 外では呼び出し側で `stop()` を実行してください。

スクロールはメッセージ数、最後のメッセージ本文、生成状態だけを DOM 更新後に監視し、トークンごとの全履歴走査を避けます。コピー失敗時には案内を表示し、1.2 秒後に消去します。新しい会話の開始やコンポーネントの破棄後に、古いコピー結果は表示されません。

[API](./request.md) · [テスト](./testing.md)
