import { describe, expect, it, vi } from 'vitest';
import { usePullToRefresh } from '@/composables/usePullToRefresh';

function touchEvent(currentTarget: HTMLElement, clientY: number): TouchEvent {
  return { currentTarget, touches: [{ clientY }] } as unknown as TouchEvent;
}

describe('usePullToRefresh', () => {
  it('refreshes only after pulling past the threshold at the top', async () => {
    const scroller = document.createElement('main');
    scroller.className = 'page-scroll';
    const page = document.createElement('div');
    scroller.append(page);
    Object.defineProperty(scroller, 'scrollTop', {
      configurable: true,
      value: 0,
      writable: true,
    });
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    const pull = usePullToRefresh({ onRefresh, threshold: 60 });

    pull.onTouchStart(touchEvent(page, 100));
    pull.onTouchMove(touchEvent(page, 250));
    expect(pull.ready.value).toBe(true);
    await pull.onTouchEnd();
    expect(onRefresh).toHaveBeenCalledOnce();
    expect(pull.distance.value).toBe(0);
  });

  it('does not start while the page is already scrolled', async () => {
    const scroller = document.createElement('main');
    scroller.className = 'page-scroll';
    const page = document.createElement('div');
    scroller.append(page);
    Object.defineProperty(scroller, 'scrollTop', {
      configurable: true,
      value: 20,
      writable: true,
    });
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    const pull = usePullToRefresh({ onRefresh });

    pull.onTouchStart(touchEvent(page, 100));
    pull.onTouchMove(touchEvent(page, 260));
    await pull.onTouchEnd();
    expect(onRefresh).not.toHaveBeenCalled();
  });
});
