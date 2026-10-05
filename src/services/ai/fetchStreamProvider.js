import { ApiError } from '@/types/api/common';
import { parseSseStream } from './sse';
const runtime = {};
export function configureStreamingClient(config) {
  Object.assign(runtime, config);
}
function createRequestId() {
  return globalThis.crypto?.randomUUID?.() ?? `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
async function readError(response) {
  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }
  return new ApiError(payload?.message || payload?.msg || `AI request failed (${response.status})`, {
    kind: 'http',
    code: payload?.code,
    status: response.status,
    requestId: payload?.requestId ?? response.headers.get('X-Request-ID') ?? undefined,
    details: payload,
  });
}
export class FetchStreamChatProvider {
  endpoint;
  constructor(endpoint = `${import.meta.env.VITE_AI_API_BASE_URL || '/api/ai'}/chat`) {
    this.endpoint = endpoint;
  }
  async *chat(messages, options = {}) {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'text/event-stream');
    const token = runtime.getAccessToken?.();
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
    if (import.meta.env.VITE_REQUEST_ID_ENABLED !== 'false' && !headers.has('X-Request-ID')) headers.set('X-Request-ID', createRequestId());
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        conversationId: options.conversationId,
        messages: messages.map(({ role, content }) => ({ role, content })),
      }),
      signal: options.signal,
    });
    if (!response.ok) {
      const currentToken = runtime.getAccessToken?.();
      if (response.status === 401 && headers.get('Authorization') === (currentToken ? `Bearer ${currentToken}` : null))
        void runtime.onUnauthorized?.();
      throw await readError(response);
    }
    if (!response.body) throw new ApiError('Streaming is not supported by this browser or response', { kind: 'network' });
    for await (const chunk of parseSseStream(response.body)) yield chunk;
  }
}
export const defaultChatProvider = new FetchStreamChatProvider();
