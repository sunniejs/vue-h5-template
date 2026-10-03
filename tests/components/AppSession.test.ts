import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { QueryClient, useQuery, VueQueryPlugin } from '@tanstack/vue-query';
import App from '@/App.vue';
import AppErrorBoundary from '@/components/common/AppErrorBoundary.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { useUserStore } from '@/store/modules/user';

describe('application session boundary', () => {
  it('clears old cached data and local drafts when the account changes', async () => {
    const pinia = createPinia();
    const user = useUserStore(pinia);
    user.token = 'account-a';
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    client.setQueryData(['private-inactive'], 'Account A secret');
    const Page = defineComponent({
      setup() {
        const draft = ref('');
        const profile = useQuery({
          queryKey: ['user', 'profile'],
          queryFn: async () => user.token,
          staleTime: Infinity,
        });
        return () =>
          h('main', [
            h('p', profile.data.value),
            h('input', {
              value: draft.value,
              onInput: (event: Event) => {
                draft.value = (event.target as HTMLInputElement).value;
              },
            }),
          ]);
      },
    });
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Page }],
    });
    await router.push('/');
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, [VueQueryPlugin, { queryClient: client }]],
        components: { AppErrorBoundary, SvgIcon },
      },
    });
    try {
      await flushPromises();
      expect(wrapper.text()).toContain('account-a');
      await wrapper.get('input').setValue('Private draft');
      user.token = 'account-b';
      await flushPromises();
      expect(wrapper.text()).toContain('account-b');
      expect(wrapper.text()).not.toContain('account-a');
      expect(wrapper.get('input').element.value).toBe('');
      expect(client.getQueryData(['private-inactive'])).toBeUndefined();
    } finally {
      wrapper.unmount();
      client.clear();
    }
  });

  it('aborts a previous account query and ignores its late result', async () => {
    const pinia = createPinia();
    const user = useUserStore(pinia);
    user.token = 'account-a';
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    let oldSignal: AbortSignal | undefined;
    let resolveOld: ((value: string) => void) | undefined;
    const Page = defineComponent({
      setup() {
        const profile = useQuery({
          queryKey: ['user', 'profile'],
          queryFn: ({ signal }) => {
            if (user.token !== 'account-a')
              return Promise.resolve(user.token || 'Guest');
            oldSignal = signal;
            return new Promise<string>((resolve) => {
              resolveOld = resolve;
            });
          },
        });
        return () => h('p', profile.data.value);
      },
    });
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Page }],
    });
    await router.push('/');
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, [VueQueryPlugin, { queryClient: client }]],
        components: { AppErrorBoundary, SvgIcon },
      },
    });
    try {
      await flushPromises();
      user.logout();
      await flushPromises();
      expect(oldSignal?.aborted).toBe(true);
      resolveOld?.('Account A secret');
      await flushPromises();
      expect(wrapper.text()).toBe('Guest');
      expect(client.getQueryData(['user', 'profile'])).toBe('Guest');
    } finally {
      wrapper.unmount();
      client.clear();
    }
  });
});
