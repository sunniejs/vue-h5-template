import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import QueryPage from '@/views/examples/query.vue';
import { getTasks, toggleTask } from '@/api/modules/examples';
import type { Task } from '@/api/modules/examples';

vi.mock('@/api/modules/examples', () => ({
  getTasks: vi.fn(),
  toggleTask: vi.fn(),
  getFeed: async () => ({ list: [], hasMore: false }),
}));

describe('query page mutation lifecycle', () => {
  it('ignores task writes after disposal instead of updating the new account cache', async () => {
    vi.mocked(getTasks).mockResolvedValue([
      { id: 1, title: 'Task', done: false },
    ]);
    let finish: ((task: Task) => void) | undefined;
    vi.mocked(toggleTask).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = mount(QueryPage, {
      global: { plugins: [[VueQueryPlugin, { queryClient: client }]] },
    });
    try {
      await flushPromises();
      await wrapper.get('.task-list button').trigger('click');
      client.clear();
      wrapper.unmount();
      client.setQueryData(
        ['examples', 'tasks'],
        [{ id: 1, title: 'New account task', done: false }],
      );
      finish?.({ id: 1, title: 'Old account task', done: true });
      await flushPromises();
      expect(client.getQueryData(['examples', 'tasks'])).toEqual([
        { id: 1, title: 'New account task', done: false },
      ]);
    } finally {
      wrapper.unmount();
      client.clear();
    }
  });
});
