import { effect, effectScope, stop } from 'vue';
import { describe, expect, it, vi } from 'vitest';
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

  it.each(['stop', 'clear'] as const)(
    '%s detaches a late provider before starting a new conversation',
    async (action) => {
      let releaseOld!: () => void;
      let releaseNew!: () => void;
      const oldGate = new Promise<void>((resolve) => {
        releaseOld = resolve;
      });
      const newGate = new Promise<void>((resolve) => {
        releaseNew = resolve;
      });
      let attempts = 0;
      let oldSignal: AbortSignal | undefined;
      const chat = useStreamingChat({
        async *chat(_messages, options) {
          if (++attempts === 1) {
            oldSignal = options?.signal;
            await oldGate;
            yield { type: 'start', conversationId: 'stale-conversation' };
            yield { type: 'usage', inputTokens: 999, outputTokens: 999 };
            throw new Error('Late failure');
          }
          yield { type: 'start', conversationId: 'new-conversation' };
          yield { type: 'delta', delta: 'New ' };
          await newGate;
          yield { type: 'delta', delta: 'response' };
        },
      });
      const oldRequest = chat.sendMessage('Old question');
      chat[action]();
      expect(oldSignal?.aborted).toBe(true);
      expect(chat.streaming.value).toBe(false);
      expect(chat.messages.value[chat.messages.value.length - 1]?.status).toBe(
        action === 'clear' ? undefined : 'stopped',
      );
      const newRequest = chat.sendMessage('New question');
      await vi.waitFor(() =>
        expect(
          chat.messages.value[chat.messages.value.length - 1]?.content,
        ).toBe('New '),
      );
      releaseOld();
      await oldRequest;
      expect(chat.conversationId.value).toBe('new-conversation');
      expect(chat.usage.value).toBeNull();
      expect(chat.error.value).toBeNull();
      expect(chat.streaming.value).toBe(true);
      releaseNew();
      await newRequest;
      expect(chat.messages.value[chat.messages.value.length - 1]?.content).toBe(
        'New response',
      );
      expect(chat.messages.value[chat.messages.value.length - 1]?.status).toBe(
        'ready',
      );
    },
  );

  it('ignores a late rejection after clear', async () => {
    let fail!: (reason: Error) => void;
    const pendingFailure = new Promise<void>((_resolve, reject) => {
      fail = reject;
    });
    const chat = useStreamingChat({
      async *chat() {
        await pendingFailure;
        yield { type: 'done' };
      },
    });
    const pending = chat.sendMessage('Hello');
    chat.clear();
    fail(new Error('stale error'));
    await pending;
    expect(chat.messages.value).toEqual([]);
    expect(chat.error.value).toBeNull();
  });

  it('aborts on scope disposal and prevents further requests', async () => {
    const scope = effectScope();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let signal: AbortSignal | undefined;
    const chat = scope.run(() =>
      useStreamingChat({
        async *chat(_messages, options) {
          signal = options?.signal;
          await gate;
          yield { type: 'delta', delta: 'late' };
        },
      }),
    );
    if (!chat) throw new Error('Unable to create chat scope');
    const pending = chat.sendMessage('Hello');
    scope.stop();
    expect(signal?.aborted).toBe(true);
    release();
    await pending;
    await chat.sendMessage('After leaving');
    await chat.regenerate();
    expect(chat.messages.value).toHaveLength(2);
    expect(chat.messages.value[chat.messages.value.length - 1]?.content).toBe(
      '',
    );
    expect(chat.streaming.value).toBe(false);
  });
});
