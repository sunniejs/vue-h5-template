# 项目架构

v2 的目标是让目录本身表达边界，让开发者和 Coding Agent 不需要猜测代码应该放在哪里。

## 分层

```text
views -> components / composables -> api modules / services -> transport / types
main  -> plugins / router / store
build -> Vite plugins
```

- `src/api/client.ts` 只处理 Axios、拦截器、解包和 `ApiError`。
- `src/api/modules` 按业务域声明接口，不包含 Toast、Router 或组件逻辑。
- `src/services` 放框架无关的 Provider、协议解析器和 Adapter。
- `src/composables` 负责 Vue 响应式与生命周期编排。
- `src/store` 只保存 Client State；Server State 交给 TanStack Query。
- `src/views` 是路由级组合层，非首页页面均懒加载。

## 路由决策

项目继续使用显式手写 Router。当前页面规模下，显式 `RouteRecordRaw` 更容易审查权限、Layout、title、KeepAlive 和 bundle 边界。旧 `vite-plugin-pages` 没有恢复；若未来页面达到需要文件约定的规模，应优先评估 `unplugin-vue-router`，并把 typed routes、meta、layout 和迁移测试作为完整方案引入。

## 构建

Vite 8 使用 Rolldown。`VITE_UI_FRAMEWORK` 选择唯一 UI resolver 与 demo alias；AI Chat、Query 示例和非核心页面走动态 import。SVG Sprite 始终可用；Sharp/SVGO、PWA、Gzip 和 bundle report 都由环境变量控制。

## 受保护的约束

- 请求层不依赖 UI 或 Router。
- Service Worker 不默认缓存 API。
- 三套 UI 不同时进入 production graph。
- AI/Markdown 输出必须净化。
- pnpm 是唯一包管理器。
