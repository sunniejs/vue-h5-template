import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MobilePage from '@/views/examples/mobile.vue';

afterEach(() => vi.unstubAllGlobals());

describe('mobile capabilities feedback', () => {
  it('keeps the page usable when clipboard access is denied', async () => {
    vi.stubGlobal('navigator', {
      onLine: true,
      clipboard: {
        writeText: async () => {
          throw new DOMException('Denied', 'NotAllowedError');
        },
      },
    });
    const wrapper = mount(MobilePage);
    try {
      await wrapper.get('button').trigger('click');
      expect(wrapper.get('[role="status"]').text()).toContain('复制失败');
      expect(wrapper.get('h1').isVisible()).toBe(true);
    } finally {
      wrapper.unmount();
    }
  });

  it.each([
    ['AbortError', ''],
    ['NotAllowedError', '分享失败'],
  ])(
    'handles native share %s without an uncaught rejection',
    async (name, expected) => {
      vi.stubGlobal('navigator', {
        onLine: true,
        share: async () => {
          throw new DOMException('Share interrupted', name);
        },
      });
      const wrapper = mount(MobilePage);
      try {
        await wrapper.findAll('button')[1]?.trigger('click');
        const notices = wrapper.findAll('[role="status"]');
        expect(notices).toHaveLength(expected ? 1 : 0);
        expect(notices.map((notice) => notice.text()).join('')).toContain(
          expected,
        );
      } finally {
        wrapper.unmount();
      }
    },
  );
});
