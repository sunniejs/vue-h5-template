import { effect, stop } from 'vue';
import { describe, expect, it } from 'vitest';
import { useStreamingChat } from '@/composables/useStreamingChat';
import type { ChatProvider } from '@/types/ai';

describe('useStreamingChat', () => {
  it('accumulates stream chunks and regenerates a response', async () => {
    let calls = 0;
    const provider: ChatProvider = {
      async *chat() {
        calls += 1;
        yield { type: 'start', conversationId: 'server-conversation' };
        yield { type: 'delta', delta: 'Vue ' };
        yield { type: 'delta', delta: 'streams.' };
        yield { type: 'usage', inputTokens: 4, outputTokens: 3 };
        yield { type: 'done' };
      },
    };
    const chat = useStreamingChat(provider);
    await chat.sendMessage('What is Vue?');
    expect(chat.messages.value.map((message) => message.content)).toEqual([
      'What is Vue?',
      'Vue streams.',
    ]);
    expect(chat.conversationId.value).toBe('server-conversation');
    expect(chat.usage.value).toEqual({ inputTokens: 4, outputTokens: 3 });
    await chat.regenerate();
    expect(chat.messages.value[chat.messages.value.length - 1]?.content).toBe(
      'Vue streams.',
    );
    expect(calls).toBe(2);
  });

  it('updates reactive consumers as each stream delta arrives', async () => {
    let releaseStream: (() => void) | undefined;
    let enteredPause: (() => void) | undefined;
    const paused = new Promise<void>((resolve) => {
      enteredPause = resolve;
    });
    const provider: ChatProvider = {
      async *chat() {
        yield { type: 'start', conversationId: 'conversation-reactive' };
        yield { type: 'delta', delta: 'Vue ' };
        enteredPause?.();
        await new Promise<void>((resolve) => {
          releaseStream = resolve;
        });
        yield { type: 'delta', delta: 'streams.' };
        yield { type: 'done' };
      },
    };
    const chat = useStreamingChat(provider);
    let renderedContent = '';
    const runner = effect(() => {
      renderedContent =
        chat.messages.value[chat.messages.value.length - 1]?.content ?? '';
    });

    const pending = chat.sendMessage('What is Vue?');
    await paused;
    expect(renderedContent).toBe('Vue ');
    releaseStream?.();
    await pending;
    expect(renderedContent).toBe('Vue streams.');
    stop(runner);
  });

  it('aborts an active provider immediately', async () => {
    const provider: ChatProvider = {
      async *chat(_messages, options) {
        yield { type: 'delta', delta: 'partial' };
        await new Promise((_resolve, reject) =>
          options?.signal?.addEventListener(
            'abort',
            () => reject(new DOMException('aborted', 'AbortError')),
            { once: true },
          ),
        );
      },
    };
    const chat = useStreamingChat(provider);
    const pending = chat.sendMessage('stop me');
    await Promise.resolve();
    await Promise.resolve();
    chat.stop();
    await pending;
    expect(chat.messages.value[chat.messages.value.length - 1]?.status).toBe(
      'stopped',
    );
    expect(chat.streaming.value).toBe(false);
  });
});
