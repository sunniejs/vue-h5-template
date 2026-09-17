# 商城示例

商城不是按钮 Demo，而是一条真实 Server State 链路。

## 页面

- `/shop`：公开商品列表、关键词搜索、分类、排序和 Infinite Query。
- `/shop/products/:id`：商品详情、数量、Safe Area 底部购买栏。
- `/shop/admin/products`：登录且为 admin 后的商品查询、创建、编辑、上下架和软删除。

商品卡片与编辑器位于 `src/components/shop`，页面只负责路由级组合。业务接口集中在 `src/api/modules/products.ts`，缓存、取消、Mutation 与失效由 TanStack Query 管理，不进入 Pinia。

## 类型与数据

商品类型由 `openapi/schema.yaml` 生成。金额以整数分存储，避免浮点误差；展示时由 `Intl.NumberFormat` 格式化。名称、卖点和详情必须包含 `zh-CN`、`en-US` 与 `ja-JP`，切换语言后读取对应字段。

封面只允许同源路径或 HTTPS URL，异常值回退到本地占位图。后台删除使用软删除，公开 API 只展示 `on_sale` 商品。

## Mock 与真实后端

`pnpm dev` 使用 `mock/index.ts`，无需 Docker 即可浏览和编辑商品。`pnpm dev:integration` 配置 Gin／FastAPI 代理。启用代理不代表所有旧业务契约已匹配，见下方接入边界。

## 收藏交互与会话隔离

`FavoriteButton` 接收数值 `productId` 和当前 `session` Token。未登录时显示登录链接，不请求私有状态；登录后先读取已保存的状态，再启用操作。读取失败可重试，写入失败保留最后确认的状态并提示错误。读取和保存期间禁用重复提交。

收藏状态由 TanStack Query 管理。缓存键包含控件实例、会话代数和商品 ID，不包含 Token。Mutation 捕获提交时的缓存键，旧响应只更新原来的缓存，不能覆盖另一个账号或商品。重新挂载、切换会话后重新读取服务端。操作提交明确的布尔值，不让服务端反转一个未知状态。

```text
GET  /api/product/favorite?id=1
POST /api/product/favorite
{ "productId": 1, "favorite": true }
```

`src/components/shop/FavoriteButton.vue` → `src/api/modules/favorites.ts` → `apiClient`.

响应包装兼容不会自动转换路径或业务字段。单应用商品模块仍使用 `/api/products` 与多语言 `name`／`priceCents`，当前 Gin 商品接口为 `/api/product/list` 与 `title`／`price`；登录也存在 `name`／`token` 与 `username`／`accessToken` 的差异。完整联调前需要核对其余契约或增加明确的领域适配。新增收藏路径已与 Gin 对齐，但鉴权仍需要兼容的已签发 JWT。

[API](./request.md) · [测试](./testing.md)
