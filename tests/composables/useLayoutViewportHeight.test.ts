import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import { useLayoutViewportHeight } from '@/composables/useLayoutViewportHeight';

function mountShell() {
  return mount({
    setup() {
      const height = useLayoutViewportHeight();
      return () => h('div', { style: { height: height.value } });
    },
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('useLayoutViewportHeight', () => {
  it('leaves height to CSS when dynamic viewport units are supported', () => {
    vi.stubGlobal('CSS', { supports: () => true });
    const shell = mountShell();

    expect(shell.element.style.height).toBe('');
    shell.unmount();
  });

  it('tracks visual viewport height on legacy browsers and removes its listeners', async () => {
    vi.stubGlobal('CSS', { supports: () => false });
    const viewport = Object.assign(new EventTarget(), { height: 600.2 });
    vi.stubGlobal('visualViewport', viewport);
    const removeListener = vi.spyOn(viewport, 'removeEventListener');
    const shell = mountShell();

    await nextTick();
    expect(shell.element.style.height).toBe('600px');

    viewport.height = 440.6;
    viewport.dispatchEvent(new Event('resize'));
    await nextTick();
    expect(shell.element.style.height).toBe('441px');

    shell.unmount();
    expect(removeListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('falls back to the window height when the visual viewport API is absent', async () => {
    vi.stubGlobal('CSS', undefined);
    vi.stubGlobal('visualViewport', undefined);
    vi.stubGlobal('innerHeight', 640);
    const shell = mountShell();

    await nextTick();
    expect(shell.element.style.height).toBe('640px');

    vi.stubGlobal('innerHeight', 500);
    window.dispatchEvent(new Event('resize'));
    await nextTick();
    expect(shell.element.style.height).toBe('500px');
    shell.unmount();
  });
});
