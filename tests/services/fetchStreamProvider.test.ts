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
  it('does not expire a new session for a previous stream request', async () => {
    let token = 'old-token';
    const onUnauthorized = vi.fn();
    configureStreamingClient({ getAccessToken: () => token, onUnauthorized });
    let respond: ((response: Response) => void) | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            respond = resolve;
          }),
      ),
    );
    const request = new FetchStreamChatProvider('/api/ai/chat').chat([]).next();
    const outcome = request.catch((error: unknown) => error);
    token = 'new-token';
    respond?.(
      Response.json({ code: 401, msg: 'Expired', data: null }, { status: 401 }),
    );
    await expect(outcome).resolves.toMatchObject({ status: 401 });
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

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

  it('preserves the FastAPI message and trace on a failed request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          {
            code: 429,
            message: 'Too many requests',
            data: null,
          },
          { status: 429, headers: { 'X-Request-ID': 'fastapi-trace' } },
        ),
      ),
    );
    const provider = new FetchStreamChatProvider('/api/ai/chat');
    await expect(provider.chat([]).next()).rejects.toMatchObject({
      message: 'Too many requests',
      status: 429,
      requestId: 'fastapi-trace',
    });
  });
});
