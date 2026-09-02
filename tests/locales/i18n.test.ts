import { afterEach, describe, expect, it } from 'vitest';
import { i18n, setLang, SUPPORTED_LOCALES } from '@/locales';

describe('i18n', () => {
  afterEach(() => setLang('zh-CN'));

  it('loads Chinese, English, and Japanese messages reactively', async () => {
    expect(SUPPORTED_LOCALES).toEqual(['zh-CN', 'en-US', 'ja-JP']);

    await setLang('zh-CN');
    expect(i18n.global.t('common.home.title')).toContain('移动业务');

    await setLang('en-US');
    expect(i18n.global.t('common.home.title')).toContain('mobile products');

    await setLang('ja-JP');
    expect(i18n.global.t('common.home.title')).toContain('モバイル');
    expect(document.documentElement.lang).toBe('ja-JP');
  });

  it('falls back to Chinese for unsupported persisted values', async () => {
    await setLang('invalid-locale');
    expect(i18n.global.locale.value).toBe('zh-CN');
  });
});
