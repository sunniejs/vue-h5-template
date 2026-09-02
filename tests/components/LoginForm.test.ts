import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginForm from '@/components/auth/LoginForm.vue';

describe('loginForm', () => {
  it('submits validated credentials without exposing password state', async () => {
    const wrapper = mount(LoginForm);
    await wrapper.get('#username').setValue('Ada');
    await wrapper.get('#password').setValue('secret');
    await wrapper.get('form').trigger('submit');
    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { name: 'Ada', password: 'secret' },
    ]);
  });

  it('disables submit while loading', () => {
    const wrapper = mount(LoginForm, { props: { loading: true } });
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
  });

  it('starts empty and discourages personal-account autofill in the public demo', () => {
    const wrapper = mount(LoginForm);
    expect(wrapper.get('form').attributes('autocomplete')).toBe('off');
    expect((wrapper.get('#username').element as HTMLInputElement).value).toBe(
      '',
    );
    expect(wrapper.get('#username').attributes('autocomplete')).toBe('off');
    expect((wrapper.get('#password').element as HTMLInputElement).value).toBe(
      '',
    );
    expect(wrapper.get('#password').attributes('autocomplete')).toBe(
      'new-password',
    );
  });
});
