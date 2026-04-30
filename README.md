<div align="center">
  <h1>Vue H5 Template</h1>
  <p>基于 Vue 3 + Vite 7 + TypeScript + 多 UI 组件库 + Pinia + viewport 适配方案，构建移动端快速开发脚手架</p>

  <p>
    <img src="https://img.shields.io/github/license/sunniejs/vue-h5-template" alt="license" />
    <img src="https://img.shields.io/github/stars/sunniejs/vue-h5-template?style=social" alt="stars" />
    <img src="https://img.shields.io/github/forks/sunniejs/vue-h5-template?style=social" alt="forks" />
  </p>

  <p>
    <a href="https://sunniejs.github.io/vue-h5-template/">在线文档</a> ·
    <a href="https://github.com/sunniejs/vue-h5-template/issues">问题反馈</a>
  </p>
</div>

---

## 特性

- **Vue 3.5** + **Vite 7** + **TypeScript 5.9** — 最新技术栈
- **多 UI 组件库** — 同时支持 Vant、NutUI、Varlet，按需自动引入
- **Pinia 状态管理** — 配合 `pinia-plugin-persistedstate` 实现持久化
- **viewport（vw）适配** — 基于 `cnjm-postcss-px-to-viewport`，自动处理 UI 库 375/750 设计稿差异
- **Axios + useFetch 双请求方案** — 支持传统 Axios 和 `@vueuse/core` 的 `createFetch`
- **vue-i18n 多语言** — 按需懒加载语言包
- **文件路由** — 基于 `vite-plugin-pages` 自动生成路由
- **丰富的 Vite 插件** — Mock、Eruda 调试、PWA、QRCode、图片压缩、gzip 压缩、打包分析等
- **代码规范** — ESLint flat config + Prettier + Stylelint + Husky + lint-staged
- **Docker 部署** — 内置 Dockerfile + Nginx 配置

## 环境要求

| 工具    | 版本       |
| ------- | ---------- |
| Node.js | >= 20.10.0 |
| pnpm    | >= 9.12.0  |

## 快速开始

```bash
# 拉取项目
git clone https://github.com/sunniejs/vue-h5-template.git

# 进入项目目录
cd vue-h5-template

# 安装依赖
pnpm install

# 启动项目
pnpm dev

# 打包
pnpm build

# 预览打包结果
pnpm preview
```

## 项目结构

```
├── build/                  # Vite 构建相关配置
│   ├── vite/plugins/       # Vite 插件配置（auto-import、component、mock、eruda 等）
│   └── utils.ts            # 构建工具函数
├── mock/                   # Mock 数据
├── public/                 # 静态资源
├── src/
│   ├── api/                # 接口管理
│   ├── assets/             # 项目资源（字体、图片等）
│   ├── layout/             # 布局组件
│   ├── locales/            # 国际化语言包
│   ├── router/             # 路由配置
│   ├── store/              # Pinia 状态管理
│   ├── styles/             # 全局样式 & SCSS 变量
│   ├── utils/              # 工具函数（Axios 封装、useFetch 封装）
│   ├── views/              # 页面组件
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── types/                  # TypeScript 类型声明
├── .env.*                  # 多环境变量配置
├── vite.config.mts         # Vite 配置
├── postcss.config.js       # PostCSS 配置（viewport 适配）
├── Dockerfile              # Docker 部署配置
└── nginx.conf              # Nginx 配置
```

## 集成的 Vite 插件

| 插件                            | 说明                 |
| ------------------------------- | -------------------- |
| `unplugin-auto-import`          | 按需自动引入 API     |
| `unplugin-vue-components`       | 按需自动引入组件     |
| `vite-plugin-pages`             | 文件系统路由         |
| `vite-plugin-mock`              | 本地 Mock 数据       |
| `@zhaojjiang/vite-plugin-eruda` | 移动端调试工具       |
| `vite-plugin-svg-icons`         | SVG 图标             |
| `vite-plugin-compression`       | Gzip 压缩            |
| `vite-plugin-imagemin`          | 图片压缩             |
| `vite-plugin-pwa`               | PWA 支持             |
| `vite-plugin-qrcode`            | 开发时二维码         |
| `vite-plugin-restart`           | 配置文件修改自动重启 |
| `vite-plugin-progress`          | 构建进度条           |
| `@vitejs/plugin-basic-ssl`      | 本地 HTTPS           |
| `rollup-plugin-visualizer`      | 打包分析             |

## 其他版本

- **vue-h5-template-lite**（纯 JS 版）— [点击查看](https://github.com/sunniejs/vue-h5-template/tree/vue-h5-template-lite)
- **vue2-h5-template**（Vue 2 版）— [点击查看](https://github.com/sunniejs/vue-h5-template/tree/vue2-h5-template)
- **monorepo 版**（Monorepo 架构）— [点击查看](https://github.com/fonghehe/vue-h5-template)

## 文档

详细的使用文档请查看 [在线文档](https://sunniejs.github.io/vue-h5-template/)

如果对你有帮助，欢迎 Star 支持 ⭐

## 关于我

扫描添加下方的微信并备注加交流群，交流学习，及时获取代码最新动态。

<p>
  <img src="https://cdn.jsdelivr.net/gh/fonghehe/picture/personal/account.jpg" width="256" />
</p>

如果你觉得该项目有给你带来帮助，可以请作者喝一杯 ☕ 支持持续的迭代

<table>
  <tr align="center">
    <td>WechatPay</td>
    <td>AliPay</td>
  </tr>
  <tr align="center">
    <td><img src="https://cdn.jsdelivr.net/gh/fonghehe/picture/contribute/wechatPay.jpeg" width="256" /></td>
    <td><img src="https://cdn.jsdelivr.net/gh/fonghehe/picture/contribute/aliPay.jpeg" width="256" /></td>
  </tr>
</table>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sunniejs/vue-h5-template&type=Timeline)](https://star-history.com/#sunniejs/vue-h5-template&Timeline)

## License

[MIT](./License)
