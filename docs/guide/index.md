# 项目介绍

Vue H5 Template 是面向移动端 H5 应用的 Vue 3 工程模板。它提供一套可以直接运行、构建和部署的基础结构，同时保留足够清晰的扩展边界。

## 技术栈

| 分类 | 方案 |
| --- | --- |
| 核心 | Vue 3.5、Vite 7、TypeScript 5.9 |
| 路由与状态 | Vue Router 4、Pinia 3、状态持久化 |
| 网络与国际化 | Axios、Vue I18n 11 |
| UI | Vant 4、NutUI 4、Varlet 3 |
| 工程质量 | ESLint 9、Prettier、Stylelint、Vitest、GitHub Actions |
| 部署 | Docker、Nginx、可选 Gzip 与 PWA |

## 设计取舍

- 路由表维护在 `src/router/routes.ts`，没有启用文件路由。
- 图标示例使用 NutUI Icons 和 iconfont，没有启用 SVG 雪碧图插件。
- 三套 UI 库用于模板能力展示。业务项目应选定一套主 UI 后删除不再使用的依赖、resolver 和示例。
- 应用只保留 Axios 请求层，避免多套请求约定并存。
- Mock 仅用于本地开发，测试和生产环境默认关闭。

从[快速开始](./start.md)创建本地环境，或先阅读[项目架构](./architecture.md)了解各模块职责。
