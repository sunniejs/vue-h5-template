import { describe, expect, it } from 'vitest';
import { parseSseEvent, parseSseStream } from '@/services/ai/sse';

describe('sSE parser', () => {
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
});
