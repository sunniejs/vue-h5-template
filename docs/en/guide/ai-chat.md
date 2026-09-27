# AI Chat and Streaming

## Why No Heavy SDK

Vercel AI SDK supports Vue, but the template only needs text streaming, cancellation, retries, and provider replacement. Direct adoption would also introduce its server protocol and UI message model. v2 uses a small standard interface:

```ts
interface ChatProvider {
  chat(
    messages: readonly ChatMessage[],
    options?: ChatOptions,
  ): AsyncIterable<ChatChunk>;
}
```

OpenAI, Claude, Gemini, DeepSeek, or Vercel data-stream adapters can be added without changing the page.

## Runtime Flow

1. `ChatComposer` handles Enter, IME, and auto-growing input.
2. `useStreamingChat` appends user and streaming assistant messages.
3. `FetchStreamChatProvider` POSTs `/api/ai/chat`.
4. `parseSseStream` parses SSE events split across arbitrary `ReadableStream` chunks.
5. Delta events append content; done completes; error becomes retryable.
6. Stop calls `AbortController.abort()` immediately and marks the message stopped.

The development mock is real chunked SSE middleware, not a one-shot timeout. Production mock is disabled. A real server should retain `text/event-stream`, disable proxy buffering, and handle client disconnects.

The companion FastAPI AI service lives in the separate backend workspace. It implements the same `/api/ai/chat` protocol with mock/OpenAI-compatible providers, optional Redis rate limiting, a service token, request IDs, health checks, and tests. Conventional authentication and CRUD belong to the Gin service so the two runtimes do not overlap.

During real integration, `FetchStreamChatProvider` forwards the JWT issued by Gin. FastAPI validates the same secret, issuer, and audience and rate-limits by user subject. Invalid or expired tokens invoke the same 401 session cleanup used by Axios. Compose enables `AI_AUTH_REQUIRED=true`, while the frontend-only mock mode remains directly explorable.

## Markdown Security

Markdown-it disables raw HTML, then DOMPurify removes script, iframe, form, style, and dangerous URLs. Never trust model HTML. Shiki is intentionally not a default dependency; load it dynamically inside the AI route when advanced highlighting is needed.

## Mobile Behavior

VisualViewport tracks the software keyboard, the composer includes safe-area padding, the textarea auto-grows, and a Scroll To Bottom control appears when the user reads older messages without forcing scroll position.

## Localized starter prompts

The chat empty state loads `GET /api/ai/suggestions` as a JSON request. The query is separated by language, remains fresh for five minutes, and disables automatic retries. While loading, on an empty result, or after failure, translated local prompts remain usable. Selecting a prompt follows the existing send/stop flow; this request does not change the SSE protocol or persist a conversation.

The client maps `zh-*` to `zh-CN`, `ja-*` to `ja-JP`, and other languages to `en-US`. FastAPI itself only accepts those three exact values; omission defaults to `en-US`, and unsupported values return HTTP 422. The explicit `locale` query parameter selects the prompts; do not rely on `Accept-Language` alone.

The single app uses `VITE_AI_API_BASE_URL` (default `/api/ai`) for suggestions and `VITE_AI_API_TARGET` for the development proxy. Business traffic uses the Gin target. `src/api/modules/ai.ts` owns this JSON call; streaming stays in the provider/composable.

```ts
import { getChatSuggestions } from '@/api/modules/ai';

const prompts = await getChatSuggestions(locale, signal, '/api/ai');
```

## Stream completion and cleanup

The parser accepts both the legacy mock's `start.conversationId` / `done` and FastAPI's `start.id` / `finish`, mapping them to the internal `ChatChunk` contract. UTF-8 characters and CRLF separators may span transport chunks. A terminal event stops consumption; early exit or parsing failure cancels the reader and releases its lock. Failed HTTP responses retain the server's `message` and request ID.

Stop and clear immediately release the busy state and request transport cancellation. A custom provider that ignores cancellation still cannot overwrite a newer conversation's messages, ID, usage or error. Inside component setup or a Vue effect scope, scope disposal stops generation automatically. Outside a scope, the caller must invoke `stop()`.

Scrolling watches message count, the final message's content and generation status after DOM updates, avoiding a deep traversal of the full history for every token. Clipboard failure shows feedback that expires after 1.2 seconds; starting a new conversation or disposing the component invalidates pending copy results.

[API](./request.md) · [Tests](./testing.md)
