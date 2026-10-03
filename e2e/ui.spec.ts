import { expect, test } from '@playwright/test';

test('chat and cart controls keep 44px targets on narrow screens', async ({
  page,
}) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/ai/chat');
    const send = page.getByRole('button', { name: '发送消息' });
    const box = await send.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    const input = page.getByRole('textbox');
    await input.focus();
    const focus = await page
      .locator('.chat-composer')
      .evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(focus).toBe('solid');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    ).toBeLessThanOrEqual(0);
  }
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/shop');
  await page
    .getByRole('button', { name: /将Aurora 降噪耳机加入购物车/ })
    .click();
  await page.getByRole('link', { name: '打开购物车' }).click();
  const buttons = page.locator('.line-actions button');
  await expect(buttons).toHaveCount(3);
  for (const button of await buttons.all()) {
    const box = await button.boundingBox();
    if (!box) throw new Error('Expected visible cart control bounds');
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
  }
});

test('chat composer remains visible when the visual viewport shrinks', async ({
  page,
}) => {
  await page.goto('/ai/chat');
  await page.getByRole('textbox').fill('Draft before keyboard resize');
  await page.evaluate(() => {
    const viewport = window.visualViewport;
    if (!viewport) throw new Error('Visual viewport is required');
    Object.defineProperty(viewport, 'height', {
      configurable: true,
      value: 400,
    });
    viewport.dispatchEvent(new Event('resize'));
  });
  await expect(page.locator('.chat-page')).toHaveCSS('height', '400px');
  const composer = await page.locator('.chat-composer').boundingBox();
  if (!composer) throw new Error('Expected visible chat composer bounds');
  expect(composer.y).toBeGreaterThanOrEqual(0);
  expect(composer.y + composer.height).toBeLessThanOrEqual(400);
  await expect(page.getByRole('textbox')).toHaveValue(
    'Draft before keyboard resize',
  );
});

test('layout remains restrained on mobile, tablet and desktop', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/home');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();

    const metrics = await page.evaluate(() => {
      const title = document.querySelector('h1');
      const navigation = document.querySelector('nav');
      const page = document.querySelector('.page');
      if (!title || !navigation || !page)
        throw new Error('Expected home title, page and navigation');
      const titleStyle = getComputedStyle(title);
      const pageStyle = getComputedStyle(page);
      const navigationBox = navigation.getBoundingClientRect();
      return {
        titleSize: Number.parseFloat(titleStyle.fontSize),
        pagePadding: Number.parseFloat(pageStyle.paddingLeft),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        navigationTop: navigationBox.top,
        navigationBottom: navigationBox.bottom,
      };
    });

    expect(metrics.titleSize).toBeLessThanOrEqual(44);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    if (viewport.width >= 768) {
      expect(metrics.pagePadding).toBeLessThanOrEqual(24);
      expect(metrics.navigationTop).toBeLessThan(24);
    } else {
      expect(metrics.pagePadding).toBeLessThanOrEqual(16);
      expect(
        Math.abs(metrics.navigationBottom - viewport.height),
      ).toBeLessThanOrEqual(2);
    }
  }
});

test('dark mode uses the dark design tokens without changing layout', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/shop');
  await expect(page.locator('.product-card').first()).toBeVisible();

  const theme = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const card = document.querySelector('.product-card');
    if (!card) throw new Error('Expected a product card');
    const cardStyle = getComputedStyle(card);
    return {
      colorScheme: root.colorScheme,
      background: root.getPropertyValue('--color-background').trim(),
      surface: cardStyle.backgroundColor,
      radius: Number.parseFloat(cardStyle.borderRadius),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });

  expect(theme.colorScheme).toBe('dark');
  expect(theme.background).toBe('#111113');
  expect(theme.surface).not.toBe('rgb(255, 255, 255)');
  expect(theme.radius).toBeLessThanOrEqual(12);
  expect(theme.scrollWidth).toBeLessThanOrEqual(theme.clientWidth);
});

test('mobile routes use consistent page gutters without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await page.getByLabel('用户名').fill('layout-tester');
  await page.getByLabel('密码').fill('secret');
  await page.getByRole('button', { name: '登录', exact: true }).click();
  const routes = [
    { path: '/home', gutter: 16 },
    { path: '/shop', gutter: 16 },
    { path: '/shop/cart', gutter: 16 },
    { path: '/examples', gutter: 16 },
    { path: '/examples/query', gutter: 16 },
    { path: '/examples/request', gutter: 16 },
    { path: '/examples/workspace', gutter: 16 },
    { path: '/examples/mobile', gutter: 16 },
    { path: '/examples/icons', gutter: 16 },
    { path: '/ui-framework', gutter: 16 },
    { path: '/shop/admin/products', gutter: 16 },
    { path: '/member', gutter: 16 },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    const metrics = await page.locator('.page').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        left: Number.parseFloat(style.paddingLeft),
        right: Number.parseFloat(style.paddingRight),
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      };
    });
    expect(metrics.left, route.path).toBe(route.gutter);
    expect(metrics.right, route.path).toBe(route.gutter);
    expect(metrics.overflow, route.path).toBeLessThanOrEqual(0);
  }
});

test('desktop root pages use one navigation layer and expose language switching', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/examples');

  await expect(page.locator('.top-bar')).toBeHidden();
  await expect(page.getByRole('combobox', { name: '语言' })).toBeVisible();
  await page.getByRole('combobox', { name: '语言' }).selectOption('en-US');
  await expect(
    page.getByRole('heading', { name: 'More than a component playground' }),
  ).toBeVisible();
});
