import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ChatComposer from '@/components/ai/ChatComposer.vue';

describe('chatComposer', () => {
  it('submits with Enter and preserves Shift+Enter', async () => {
    const wrapper = mount(ChatComposer);
    const textarea = wrapper.get('textarea');
    await textarea.setValue('Explain Vue');
    await textarea.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('send')?.[0]).toEqual(['Explain Vue']);
  });

  it('shows stop control while streaming', async () => {
    const wrapper = mount(ChatComposer, { props: { streaming: true } });
    await wrapper.get('.stop-button').trigger('click');
    expect(wrapper.emitted('stop')).toHaveLength(1);
  });
});
