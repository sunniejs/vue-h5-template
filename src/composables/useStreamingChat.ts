import { computed, ref, shallowRef } from 'vue';
import { defaultChatProvider } from '@/services/ai/fetchStreamProvider';
import type { ChatMessage, ChatProvider, ChatUsage } from '@/types/ai';

function createId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
}

function createMessage(
  role: ChatMessage['role'],
  content: string,
  status: ChatMessage['status'] = 'ready',
): ChatMessage {
  return { id: createId(role), role, content, createdAt: Date.now(), status };
}

export function useStreamingChat(provider: ChatProvider = defaultChatProvider) {
  const messages = ref<ChatMessage[]>([]);
  const error = ref<Error | null>(null);
  const activeController = shallowRef<AbortController | null>(null);
  const conversationId = ref(createId('conversation'));
  const usage = ref<ChatUsage | null>(null);
  const streaming = computed(() => activeController.value !== null);

  const run = async (context: ChatMessage[]) => {
    messages.value.push(createMessage('assistant', '', 'streaming'));
    const assistant = messages.value[messages.value.length - 1];
    if (!assistant) return;
    const controller = new AbortController();
    activeController.value = controller;
    error.value = null;
    usage.value = null;

    try {
      for await (const chunk of provider.chat(context, {
        signal: controller.signal,
        conversationId: conversationId.value,
      })) {
        if (chunk.type === 'start') conversationId.value = chunk.conversationId;
        if (chunk.type === 'delta') assistant.content += chunk.delta;
        if (chunk.type === 'usage')
          usage.value = {
            inputTokens: chunk.inputTokens,
            outputTokens: chunk.outputTokens,
          };
        if (chunk.type === 'error') throw new Error(chunk.message);
        if (chunk.type === 'done') break;
      }
      assistant.status = 'ready';
      // catch 参数若命名为 error 会遮蔽外层 error ref，故用 caught 并禁用命名规则
      // oxlint-disable-next-line unicorn/catch-error-name
    } catch (caught) {
      if (controller.signal.aborted) {
        assistant.status = 'stopped';
      } else {
        const normalized =
          caught instanceof Error ? caught : new Error('Chat request failed');
        assistant.status = 'error';
        error.value = normalized;
      }
    } finally {
      if (activeController.value === controller) activeController.value = null;
    }
  };

  const sendMessage = async (content: string) => {
    const normalized = content.trim();
    if (!normalized || streaming.value) return;
    const userMessage = createMessage('user', normalized);
    messages.value.push(userMessage);
    await run([...messages.value]);
  };

  const stop = () => activeController.value?.abort();

  const findLastMessageIndex = (
    predicate: (message: ChatMessage) => boolean,
  ) => {
    for (let index = messages.value.length - 1; index >= 0; index -= 1) {
      const message = messages.value[index];
      if (message && predicate(message)) return index;
    }
    return -1;
  };

  const regenerate = async (assistantId?: string) => {
    if (streaming.value) return;
    const targetIndex = assistantId
      ? messages.value.findIndex((message) => message.id === assistantId)
      : findLastMessageIndex((message) => message.role === 'assistant');
    if (targetIndex < 0) return;
    const context = messages.value.slice(0, targetIndex);
    if (!context.some((message) => message.role === 'user')) return;
    messages.value = context;
    await run([...context]);
  };

  const retry = () => {
    const index = findLastMessageIndex((message) => message.status === 'error');
    return regenerate(index >= 0 ? messages.value[index]?.id : undefined);
  };
  const clear = () => {
    stop();
    messages.value = [];
    error.value = null;
    usage.value = null;
    conversationId.value = createId('conversation');
  };

  return {
    messages,
    conversationId,
    usage,
    streaming,
    error,
    sendMessage,
    stop,
    regenerate,
    retry,
    clear,
  };
}
