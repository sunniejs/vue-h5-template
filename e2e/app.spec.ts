import { expect, test } from '@playwright/test';

test('home presents the product template', async ({ page }) => {
  await page.goto('/home');
  await expect(page.getByRole('heading', { name: /Vue 3 起点/ })).toBeVisible();
  await expect(page.getByRole('navigation').getByText('示例')).toBeVisible();
  await expect(page.getByRole('link', { name: 'AI 助手' })).toBeVisible();
});

test('language switch updates content, navigation, title and html lang', async ({
  page,
}) => {
  await page.goto('/home');
  await page.getByRole('combobox', { name: '语言' }).selectOption('en-US');
  await expect(
    page.getByRole('heading', { name: /real mobile products/i }),
  ).toBeVisible();
  await expect(page.getByRole('navigation').getByText('Shop')).toBeVisible();
  await expect(page).toHaveTitle('Home · Vue H5');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');

  await page.getByRole('combobox', { name: 'Language' }).selectOption('ja-JP');
  await expect(
    page.getByRole('heading', { name: /モバイルプロダクト/ }),
  ).toBeVisible();
  await expect(page).toHaveTitle('ホーム · Vue H5');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja-JP');
});

test('shop supports a localized catalog and product detail flow', async ({
  page,
}) => {
  await page.goto('/shop');
  await expect(
    page.getByRole('heading', { name: '把日常好物带回生活' }),
  ).toBeVisible();
  await expect(page.getByText('Aurora 降噪耳机')).toBeVisible();
  await page.getByText('Aurora 降噪耳机').click();
  await expect(page).toHaveURL(/\/shop\/products\/1$/);
  await expect(page.getByRole('button', { name: '加入购物车' })).toBeVisible();
});

test('shop adds products to a persistent cart', async ({ page }) => {
  await page.goto('/shop');
  await page
    .getByRole('button', { name: /将Aurora 降噪耳机加入购物车/ })
    .click();
  await page.getByRole('link', { name: '打开购物车' }).click();
  await expect(page).toHaveURL(/\/shop\/cart$/);
  await expect(page.getByText('Aurora 降噪耳机')).toBeVisible();
  await expect(page.getByRole('button', { name: /结算（1）/ })).toBeEnabled();
});

test('login uses the mock API and reaches profile', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel('用户名')).toHaveValue('');
  await expect(page.getByLabel('密码')).toHaveValue('');
  await page.getByLabel('用户名').fill('Ada');
  await page.getByLabel('密码').fill('secret');
  await page.getByRole('button', { name: '登录', exact: true }).click();
  await expect(page).toHaveURL(/\/member$/);
  await expect(page.getByRole('heading', { name: 'Ada' })).toBeVisible();
});

test('mock API returns type-safe server data', async ({ request }) => {
  const response = await request.get('/api/examples/tasks');
  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as { code: number; data: unknown[] };
  expect(payload.code).toBe(200);
  expect(payload.data).toHaveLength(3);
});

test('AI chat renders streaming chunks and can stop', async ({ page }) => {
  await page.goto('/ai/chat');
  await page.getByRole('button', { name: '解释这个模板的流式架构' }).click();
  await expect(page.getByText(/Vue is a progressive/)).toBeVisible();
  const stop = page.getByRole('button', { name: '停止生成' });
  if (await stop.isVisible()) await stop.click();
});

test('401 clears auth and redirects to login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('用户名').fill('Ada');
  await page.getByLabel('密码').fill('secret');
  await page.getByRole('button', { name: '登录', exact: true }).click();
  await page.goto('/examples/request');
  await page
    .locator('.error-list article')
    .filter({ hasText: '登录已失效' })
    .getByRole('button', { name: '触发错误' })
    .click();
  await expect(page).toHaveURL(/\/login\?redirect=/);
});

test('request examples normalize common HTTP, business and timeout errors', async ({
  page,
}) => {
  await page.goto('/examples/request');
  const scenarios = [
    { title: '请求参数错误', kind: 'http' },
    { title: '权限不足', kind: 'http' },
    { title: '资源不存在', kind: 'http' },
    { title: '数据版本冲突', kind: 'http' },
    { title: '业务校验失败', kind: 'business' },
    { title: '服务端异常', kind: 'http' },
    { title: '请求超时', kind: 'timeout' },
  ];

  for (const scenario of scenarios) {
    const row = page
      .locator('.error-list article')
      .filter({ hasText: scenario.title });
    await row.getByRole('button', { name: '触发错误' }).click();
    await expect(row.locator('dl')).toContainText(scenario.kind);
  }
});

test('delivery workspace supports create, view, edit, filter and delete', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('用户名').fill('workspace-tester');
  await page.getByLabel('密码').fill('secret');
  await page.getByRole('button', { name: '登录', exact: true }).click();
  await page.goto('/examples/workspace');

  const projectName = `Playwright delivery ${Date.now()}`;
  const updatedName = `${projectName} updated`;
  await page.getByRole('button', { name: /新建项目/ }).click();
  await page.getByLabel('项目名称').fill(projectName);
  await page.getByLabel('项目说明').fill('验证 Mock 与页面交互的完整操作。');
  await page.getByLabel('项目状态').selectOption('paused');
  await page.getByRole('button', { name: '保存项目' }).click();

  let row = page
    .locator('.workspace-list article')
    .filter({ hasText: projectName });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: '查看' }).click();
  await expect(page.getByRole('dialog')).toContainText(projectName);
  await page
    .getByRole('dialog')
    .locator('footer')
    .getByRole('button', { name: '关闭' })
    .click();

  await row.getByRole('button', { name: '编辑' }).click();
  await page.getByLabel('项目名称').fill(updatedName);
  await page.getByRole('button', { name: '保存项目' }).click();
  row = page
    .locator('.workspace-list article')
    .filter({ hasText: updatedName });
  await expect(row).toBeVisible();

  await page.getByLabel('状态筛选').selectOption('paused');
  await expect(row).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await row.getByRole('button', { name: '删除' }).click();
  await expect(row).toHaveCount(0);
});
