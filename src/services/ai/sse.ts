import type { ChatChunk } from '@/types/ai';

export function parseSseEvent(event: string): ChatChunk | null {
  const payload = event
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n');
  if (!payload || payload === '[DONE]')
    return payload === '[DONE]' ? { type: 'done' } : null;
  const value: unknown = JSON.parse(payload);
  if (!value || typeof value !== 'object' || !('type' in value))
    throw new Error('Invalid chat stream event');
  const chunk = value as Record<string, unknown>;
  if (chunk.type === 'start' && typeof chunk.conversationId === 'string') {
    return { type: 'start', conversationId: chunk.conversationId };
  }
  if (chunk.type === 'delta' && typeof chunk.delta === 'string')
    return { type: 'delta', delta: chunk.delta };
  if (
    chunk.type === 'usage' &&
    typeof chunk.inputTokens === 'number' &&
    typeof chunk.outputTokens === 'number'
  ) {
    return {
      type: 'usage',
      inputTokens: chunk.inputTokens,
      outputTokens: chunk.outputTokens,
    };
  }
  if (chunk.type === 'done') return { type: 'done' };
  if (chunk.type === 'error' && typeof chunk.message === 'string')
    return { type: 'error', message: chunk.message };
  throw new Error('Unsupported chat stream event');
}

export async function* parseSseStream(
  stream: ReadableStream<Uint8Array>,
): AsyncIterable<ChatChunk> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n');
      let boundary = buffer.indexOf('\n\n');
      while (boundary >= 0) {
        const event = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const chunk = parseSseEvent(event);
        if (chunk) yield chunk;
        boundary = buffer.indexOf('\n\n');
      }
      if (done) break;
    }
    const finalChunk = parseSseEvent(buffer);
    if (finalChunk) yield finalChunk;
  } finally {
    reader.releaseLock();
  }
}
