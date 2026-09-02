import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import { i18n, setLang } from '@/locales';

await setLang('zh-CN');
config.global.plugins = [i18n];

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(navigator, 'clipboard', {
  configurable: true,
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
});
Element.prototype.scrollTo = vi.fn();

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [0];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
