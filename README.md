# Vue H5 Template Lite

[English](README.en.md) · [日本語](README.ja.md)

Lite 使用 Vue 3、Vite 7 和 JavaScript，包含商品目录、详情、购物车、收藏、商品管理、登录、会员页、项目工作区、请求示例和可中止的 AI 流式聊天。界面支持简体中文、英语和日语。

## 本地开发

需要 Node.js 20.19+（20.x）或 22.12+，以及 pnpm 9。

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test:coverage
pnpm exec playwright install chromium
pnpm test:e2e
```

开发服务器默认使用 Mock。可使用任意非空用户名和密码试用登录，真实部署使用后端认证。登录凭据保存在当前浏览器标签页的会话中，升级后需要重新登录。旧地址 `/list` 和 `/details` 会转到新商品目录，旧静态商品索引没有对应的新商品 ID。`/demo` 会打开当前选中的 UI 框架示例。

## 配置与构建

- `VITE_UI_FRAMEWORK` 可选 `vant`（默认）、`nutui` 或 `varlet`。每次构建只加载所选框架。
- `pnpm dev:integration` 将业务请求转发给 Gin（默认端口 8002），将 AI 请求转发给 FastAPI（默认端口 8001）。用 `.env.example` 中的变量覆盖地址和前缀，`VITE_URL_PREFIX` 仍可用作业务前缀。本地开发已通过 Mock 验证。完整的真实后端集成要求业务服务实现本分支的 OpenAPI 约定。相邻 Go 服务的路由和登录数据结构不同，且缺少项目及请求示例接口，需要兼容的网关或适配层才能覆盖全部功能。
- `pnpm build` 生成 `dist/`，供支持 History 路由的静态服务器部署。生产环境需配置实际业务和 AI 网关，AI 代理应关闭响应缓冲。Mock 和调试工具仅用于开发。
- 设置 `VITE_PWA_ENABLED=true` 启用 PWA，旧配置 `VITE_USE_PWA=true` 仍兼容。Service Worker 预缓存静态应用资源。关闭 PWA 时，仍应部署 `/sw.js` 并设置 `Cache-Control: no-cache`。旧版浏览器注册会在检查更新时注销并删除原有的 `api-cache`，新访客不会注册 Service Worker。
- API 约定见 [OpenAPI 文件](openapi/schema.yaml)。

[Vue 2 分支](https://github.com/sunniejs/vue-h5-template/tree/vue2-h5-template) · [项目文档](https://sunniejs.github.io/vue-h5-template/)

# 关于我

扫描添加下方的微信并备注加交流群(已超过 200 人，只能邀请)，交流学习，及时获取代码最新动态。

 <p>
  <img src="https://cdn.jsdelivr.net/gh/fonghehe/picture/personal/account.jpg" width="256">
</p>

如果你觉得该项目有给你带来帮助，方便了你的日常开发，可以请作者喝一杯 ☕ 支持持续的迭代

 <table >
  <tr align="center">
  <td>WechatPay</td>
  <td>AliPay</td>
  </tr>
  <tr style="text-align:center">
    <td> <img src="https://cdn.jsdelivr.net/gh/fonghehe/picture/contribute/wechatPay.jpeg" width="256" /></td>
    <td>
      <img src="https://cdn.jsdelivr.net/gh/fonghehe/picture/contribute/aliPay.jpeg" width="256" />
    </td>
  </tr>
</table>

# Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sunniejs/vue-h5-template&type=Timeline)](https://star-history.com/#tobe-fe-dalao/fast-vue3&Timeline)
