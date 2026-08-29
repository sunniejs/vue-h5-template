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

`pnpm dev` 使用 `mock/index.ts`，无需 Docker 即可浏览和编辑商品。`pnpm dev:integration` 把同一套 API 调用转发到 Gin，数据保存到 PostgreSQL。页面代码不包含环境条件分支。

