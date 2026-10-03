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

  it.each([{ streaming: true }, { disabled: true }])(
    'preserves a draft when submission is blocked by %j',
    async (props) => {
      const wrapper = mount(ChatComposer);
      const textarea = wrapper.get('textarea');
      await textarea.setValue('Next question');
      await wrapper.setProps(props);
      await textarea.trigger('keydown', { key: 'Enter' });
      await wrapper.get('form').trigger('submit');
      expect(wrapper.emitted('send')).toBeUndefined();
      expect(textarea.element.value).toBe('Next question');
      await wrapper.setProps({ streaming: false, disabled: false });
      await textarea.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('send')).toEqual([['Next question']]);
      wrapper.unmount();
    },
  );

  it('keeps Shift+Enter and IME confirmation from sending', async () => {
    const wrapper = mount(ChatComposer);
    const textarea = wrapper.get('textarea');
    await textarea.setValue('你好');
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true });
    await textarea.trigger('keydown', { key: 'Enter', isComposing: true });
    expect(wrapper.emitted('send')).toBeUndefined();
    expect(textarea.element.value).toBe('你好');
    wrapper.unmount();
  });
});
