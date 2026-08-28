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
