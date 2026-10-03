import { describe, expect, it, vi } from 'vitest';
import { parseSseEvent, parseSseStream } from '@/services/ai/sse';

describe('sSE parser', () => {
  it('accepts CR-only line endings across individual transport bytes', async () => {
    const bytes = new TextEncoder().encode(
      'data: {"type":"delta","delta":"你好"}\r\rdata: [DONE]\r\r',
    );
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
        controller.close();
      },
    });
    const chunks = [];
    for await (const chunk of parseSseStream(stream)) chunks.push(chunk);
    expect(chunks).toEqual([
      { type: 'delta', delta: '你好' },
      { type: 'done' },
    ]);
    expect(stream.locked).toBe(false);
  });
  it('validates individual chat events', () => {
    expect(
      parseSseEvent('data: {"type":"start","conversationId":"conversation-1"}'),
    ).toEqual({
      type: 'start',
      conversationId: 'conversation-1',
    });
    expect(parseSseEvent('data: {"type":"delta","delta":"Vue "}')).toEqual({
      type: 'delta',
      delta: 'Vue ',
    });
    expect(
      parseSseEvent('data: {"type":"usage","inputTokens":3,"outputTokens":8}'),
    ).toEqual({
      type: 'usage',
      inputTokens: 3,
      outputTokens: 8,
    });
    expect(parseSseEvent('data: [DONE]')).toEqual({ type: 'done' });
    expect(() => parseSseEvent('data: {"unknown":true}')).toThrow(
      'Invalid chat stream event',
    );
  });

  it('parses events split across transport chunks', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"type":"sta'));
        controller.enqueue(
          encoder.encode(
            'rt","conversationId":"conversation-1"}\n\ndata: {"type":"delta","delta":"Vue"}\n\n',
          ),
        );
        controller.enqueue(
          encoder.encode(
            'data: {"type":"usage","inputTokens":2,"outputTokens":1}\n\n',
          ),
        );
        controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
        controller.close();
      },
    });
    const chunks = [];
    for await (const chunk of parseSseStream(stream)) chunks.push(chunk);
    expect(chunks).toEqual([
      { type: 'start', conversationId: 'conversation-1' },
      { type: 'delta', delta: 'Vue' },
      { type: 'usage', inputTokens: 2, outputTokens: 1 },
      { type: 'done' },
    ]);
  });

  it('accepts FastAPI events across UTF-8 and CRLF byte boundaries', async () => {
    const data = new TextEncoder().encode(
      'data: {"type":"start","id":"fastapi-id"}\r\n\r\n' +
        'data: {"type":"delta","delta":"你好、Vue"}\r\n\r\n' +
        'data: {"type":"finish","reason":"stop"}\r\n\r\n',
    );
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const byte of data) controller.enqueue(Uint8Array.of(byte));
        controller.close();
      },
    });
    const chunks = [];
    for await (const chunk of parseSseStream(stream)) chunks.push(chunk);
    expect(chunks).toEqual([
      { type: 'start', conversationId: 'fastapi-id' },
      { type: 'delta', delta: '你好、Vue' },
      { type: 'done' },
    ]);
    expect(stream.locked).toBe(false);
  });

  it.each(['early return', 'invalid event'])(
    'cancels the transport after %s',
    async (scenario) => {
      const cancel = vi.fn();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode(
              scenario === 'early return'
                ? 'data: {"type":"delta","delta":"Hi"}\n\n'
                : 'data: {"type":"unknown"}\n\n',
            ),
          );
        },
        cancel,
      });
      const events = parseSseStream(stream)[Symbol.asyncIterator]();
      let failure: unknown;
      try {
        await events.next();
        await events.return?.();
      } catch (error) {
        failure = error;
      }
      expect(failure instanceof Error ? failure.message : undefined).toBe(
        scenario === 'invalid event'
          ? 'Unsupported chat stream event'
          : undefined,
      );
      expect(cancel).toHaveBeenCalledOnce();
      expect(stream.locked).toBe(false);
    },
  );
});
