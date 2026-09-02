import { expect, test } from '@playwright/test';

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
