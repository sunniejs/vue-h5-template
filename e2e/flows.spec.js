const { test, expect } = require('@playwright/test')

async function login(page, name) {
  await page.getByLabel('用户名').fill(name)
  await page.getByLabel('密码').fill('secret')
  await page.getByRole('button', { name: '登录', exact: true }).click()
}

test('catalog, details and cart keep their data across reload', async ({ page }) => {
  await page.goto('/#/shop')
  await page.getByText('Aurora 降噪耳机').click()
  await expect(page).toHaveURL(/#\/shop\/products\/1$/)
  await page.getByRole('button', { name: '加入购物车', exact: true }).click()
  await page.goto('/#/shop/cart')
  await expect(page.getByText('Aurora 降噪耳机')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: /结算（1）/ })).toBeEnabled()
})

test('sign-in returns to the requested product editor', async ({ page }) => {
  await page.goto('/#/shop/admin/products')
  await expect(page).toHaveURL(/#\/login\?redirect=/)
  await login(page, 'editor')
  await expect(page).toHaveURL(/#\/shop\/admin\/products$/)
  await page.getByRole('button', { name: /新增商品/ }).click()
  await expect(page.getByRole('dialog').getByLabel('SKU')).toBeVisible()
})

test('favoriting stays scoped to a signed-in user', async ({ page }) => {
  await page.goto('/#/login')
  await login(page, 'favorite tester')
  await expect(page.getByRole('heading', { name: 'favorite tester' })).toBeVisible()
  await page.goto('/#/shop/products/1')
  const favorite = page.locator('.favorite-control button')
  await expect(favorite).toHaveAttribute('aria-pressed', 'false')
  await favorite.click()
  await expect(favorite).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(favorite).toHaveAttribute('aria-pressed', 'true')
  await favorite.click()
  await expect(favorite).toHaveAttribute('aria-pressed', 'false')
})

test('chat streams, stops, and retains the next draft', async ({ page }) => {
  await page.goto('/#/ai/chat')
  const input = page.getByRole('textbox')
  await input.fill('What is Vue?')
  await input.press('Enter')
  await expect(page.getByText(/Vue is a progressive/)).toBeVisible()
  await input.fill('Draft for the next turn')
  await page.getByRole('button', { name: '停止生成' }).click()
  await expect(input).toHaveValue('Draft for the next turn')
})

test('switching languages updates the page title and persists', async ({ page }) => {
  await page.goto('/#/home')
  await page.getByRole('combobox', { name: '语言' }).selectOption('ja-JP')
  await expect(page.getByRole('heading', { name: /モバイルプロダクト/ })).toBeVisible()
  await expect(page).toHaveTitle('ホーム · Vue H5')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja-JP')
})
