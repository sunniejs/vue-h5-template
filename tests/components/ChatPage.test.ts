import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatPage from '@/views/ai/chat.vue';

vi.mock('@/api/modules/ai', () => ({
  getChatSuggestions: vi.fn().mockResolvedValue(['Say hello']),
}));
vi.mock('@/services/ai/fetchStreamProvider', () => ({
  defaultChatProvider: {
    async *chat() {
      yield { type: 'delta', delta: 'Hello Vue' };
      yield { type: 'done' };
    },
  },
}));
const clients: QueryClient[] = [];
enableAutoUnmount(afterEach);
beforeEach(() =>
  vi
    .mocked(navigator.clipboard.writeText)
    .mockReset()
    .mockResolvedValue(undefined),
);
afterEach(() => {
  vi.useRealTimers();
  clients.splice(0).forEach((client) => client.clear());
});
async function render() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/ai/chat', component: ChatPage }],
  });
  await router.push('/ai/chat');
  const wrapper = mount(ChatPage, {
    global: { plugins: [router, [VueQueryPlugin, { queryClient: client }]] },
  });
  await vi.waitFor(() => expect(wrapper.text()).toContain('Say hello'));
  await wrapper.get('.suggestions button').trigger('click');
  await flushPromises();
  return wrapper;
}

describe('chat clipboard feedback', () => {
  it('handles clipboard denial and clears its feedback', async () => {
    const wrapper = await render();
    vi.useFakeTimers();
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
      new Error('permission denied'),
    );
    await wrapper.get('.message-actions button').trigger('click');
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toContain('复制失败');
    await vi.advanceTimersByTimeAsync(1200);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it('does not show a late copy result after starting a new conversation', async () => {
    const wrapper = await render();
    let finish!: () => void;
    vi.mocked(navigator.clipboard.writeText).mockReturnValueOnce(
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
    );
    await wrapper.get('.message-actions button').trigger('click');
    await wrapper.get('.chat-header button:last-child').trigger('click');
    finish();
    await flushPromises();
    expect(wrapper.find('.conversation').exists()).toBe(false);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('已复制');
  });

  it('copies the assistant text and restores the action label', async () => {
    const wrapper = await render();
    vi.useFakeTimers();
    await wrapper.get('.message-actions button').trigger('click');
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello Vue');
    expect(wrapper.get('.message-actions button').text()).toBe('已复制');
    await vi.advanceTimersByTimeAsync(1200);
    expect(wrapper.get('.message-actions button').text()).toBe('复制');
  });
});
