# 从 v1 迁移到 v2

## Breaking Changes

- Node.js 最低版本改为 22.12，构建升级到 Vite 8 / Rolldown。
- 登录 endpoint 从 `/api/login` 改为 `/api/auth/login`。
- 请求入口改为 `src/api/client.ts` + `src/api/modules`；旧 `utils/request` 只保留兼容 re-export。
- `VITE_USE_PWA` 改为 `VITE_PWA_ENABLED`。
- UI 由三套 resolver 同开改为 `VITE_UI_FRAMEWORK` 单选。
- Token 持久化从 `localStorage` 改为 `sessionStorage`。
- 主导航和 route names 重构为 Home / Examples / AI / Member。

## 迁移步骤

1. 升级 Node/pnpm 并重新执行 `pnpm install`。
2. 对照 `.env.example` 迁移环境变量，明确 UI 框架。
3. 将页面 Axios 调用移动到 `src/api/modules`，使用 `ApiError`。
4. 将远程列表/详情从 Pinia 移至 TanStack Query。
5. 替换 `openapi/schema.yaml` 并运行 `pnpm api:generate`。
6. 将产品 SVG 放入 `src/assets/icons` 并扩展 `SvgIconName`。
7. 检查自定义路由 meta、权限和登录 redirect。
8. 运行 `pnpm check` 与关键 `pnpm test:e2e`。

## 未恢复的旧实现

旧 `vite-plugin-pages` 没有恢复，因为隐式路由在当前规模收益不足。旧 imagemin 二进制链替换为 Sharp/SVGO。旧 iconfont 被 SVG Sprite 取代。QRCode/restart 插件因 Vite 8 peer incompatibility 移除；Vite 自身会重载配置，设备调试可使用终端局域网 URL 或后续 CLI。
