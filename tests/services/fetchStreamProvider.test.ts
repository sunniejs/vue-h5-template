import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  configureStreamingClient,
  FetchStreamChatProvider,
} from '@/services/ai/fetchStreamProvider';

afterEach(() => {
  configureStreamingClient({
    getAccessToken: undefined,
    onUnauthorized: undefined,
  });
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('fetchStreamChatProvider', () => {
  it('forwards the Gin access token and request id to FastAPI', async () => {
    vi.stubEnv('VITE_REQUEST_ID_ENABLED', 'true');
    configureStreamingClient({ getAccessToken: () => 'gin-jwt' });
    const encoder = new TextEncoder();
    const fetchMock = vi.fn(
      async (_url: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        expect(headers.get('Authorization')).toBe('Bearer gin-jwt');
        expect(headers.get('X-Request-ID')).toBeTruthy();
        return new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
              controller.close();
            },
          }),
          { status: 200 },
        );
      },
    );
    vi.stubGlobal('fetch', fetchMock);

    const chunks = [];
    const provider = new FetchStreamChatProvider('/api/ai/chat');
    for await (const chunk of provider.chat([])) chunks.push(chunk);
    expect(chunks).toEqual([{ type: 'done' }]);
  });

  it('normalizes a 401 response and clears the session', async () => {
    const onUnauthorized = vi.fn();
    configureStreamingClient({ onUnauthorized });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          {
            code: 401,
            msg: 'Invalid token',
            data: null,
            requestId: 'request-1',
          },
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    );

    const provider = new FetchStreamChatProvider('/api/ai/chat');
    await expect(provider.chat([]).next()).rejects.toMatchObject({
      status: 401,
      requestId: 'request-1',
    });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});
