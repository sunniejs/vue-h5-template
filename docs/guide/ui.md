# UI 与移动端适配

## UI 组件库

模板同时接入 Vant、NutUI 和 Varlet，`unplugin-vue-components` 与 `unplugin-auto-import` 负责按需引入。示例页面用于比较三套组件库，不代表业务项目应长期混用。

开始正式项目时建议：

1. 选定一套主 UI 组件库。
2. 删除 `package.json` 中不再使用的 UI 包和 resolver。
3. 清理 `build/vite/plugins/component.ts`、`autoImport.ts` 与 `src/main.ts` 中对应配置。
4. 删除 Demo 页面中其他组件库的示例，再运行 `pnpm check`。

## Viewport 适配

`postcss.config.mjs` 使用 `cnjm-postcss-px-to-viewport`：

- 业务样式按 750px 设计稿转换。
- Vant、NutUI 和 Varlet 的依赖样式按 375px 设计宽度转换。
- 小于或等于 1px 的值不转换，避免细边框被放大。
- 默认目标为 Android 8+、iOS 15+ 和 Chrome 80+。

## 安全区与滚动

- 布局内容区使用 `100dvh`、独立纵向滚动和 `overscroll-behavior`。
- Tabbar 使用组件库的底部安全区能力。
- 详情页固定购买栏通过 `env(safe-area-inset-bottom)` 预留空间。

新增底部固定操作区时，需要同时给内容区补足底部 padding，避免内容被遮挡。
