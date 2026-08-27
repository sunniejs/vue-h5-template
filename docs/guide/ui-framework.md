# UI Framework 策略

模板保留 Vant、NutUI 和 Varlet 的选择能力，但 production build 必须单选：

```env
VITE_UI_FRAMEWORK=vant
```

Vite 根据该值选择 resolver、SCSS 注入和 `#ui-demo` alias。因此业务代码无需散落条件判断，另外两套框架不会进入当前构建图。

核心 Layout、AI Chat 与工程示例使用模板自己的轻量样式和 `SvgIcon`，避免跨框架耦合。真实项目应在初始化时选择一个 UI 框架，未来 CLI 会删除未选依赖。

## SVG Icon

产品图标放在 `src/assets/icons/*.svg`，插件自动生成 sprite，统一通过类型化 `<SvgIcon name="ai" />` 使用。UI 框架自带 icon 只在框架局部使用，不加入产品 icon union。

## 样式

全局 Design Tokens 位于 `src/styles/index.scss`，组件复杂布局继续使用 scoped SCSS。项目没有引入 UnoCSS：当前结构不需要第二套原子样式范式。viewport 插件按 750 设计稿转换业务 px，并为 UI 库使用 375 宽度；新增交互需检查转换后的 44 CSS px 触摸目标、safe-area、dark scheme 和 focus-visible。
