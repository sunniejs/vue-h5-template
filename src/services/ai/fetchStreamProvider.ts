import { ApiError } from '@/types/api/common';
import type { ApiResponse } from '@/types/api/common';
import type { ChatMessage, ChatOptions, ChatProvider } from '@/types/ai';
import { parseSseStream } from './sse';

interface StreamingClientRuntime {
  getAccessToken?: () => string | undefined;
  onUnauthorized?: () => unknown;
}

const runtime: StreamingClientRuntime = {};

export function configureStreamingClient(config: StreamingClientRuntime) {
  Object.assign(runtime, config);
}

function createRequestId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `req-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

async function readError(response: Response): Promise<ApiError> {
  let payload: Partial<ApiResponse<unknown>> | undefined;
  try {
    payload = (await response.json()) as Partial<ApiResponse<unknown>>;
  } catch {
    payload = undefined;
  }
  return new ApiError(
    payload?.msg || `AI request failed (${response.status})`,
    {
      kind: 'http',
      code: payload?.code,
      status: response.status,
      requestId:
        payload?.requestId ?? response.headers.get('X-Request-ID') ?? undefined,
      details: payload,
    },
  );
}

export class FetchStreamChatProvider implements ChatProvider {
  constructor(
    private readonly endpoint = `${import.meta.env.VITE_AI_API_BASE_URL || '/api/ai'}/chat`,
  ) {}

  async *chat(messages: readonly ChatMessage[], options: ChatOptions = {}) {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'text/event-stream');
    const token = runtime.getAccessToken?.();
    if (token && !headers.has('Authorization'))
      headers.set('Authorization', `Bearer ${token}`);
    if (import.meta.env.VITE_REQUEST_ID_ENABLED && !headers.has('X-Request-ID'))
      headers.set('X-Request-ID', createRequestId());

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
      if (response.status === 401) void runtime.onUnauthorized?.();
      throw await readError(response);
    }
    if (!response.body)
      throw new ApiError(
        'Streaming is not supported by this browser or response',
        { kind: 'network' },
      );

    for await (const chunk of parseSseStream(response.body)) yield chunk;
  }
}

export const defaultChatProvider = new FetchStreamChatProvider();
