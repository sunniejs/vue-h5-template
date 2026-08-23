# 项目架构

## 目录职责

```text
├── build/
│   ├── utils.ts                 # 环境变量解析与默认值
│   └── vite/
│       ├── plugins/             # Vite 插件工厂
│       └── proxy.ts             # 开发代理
├── mock/                        # 本地 Mock 接口
├── public/                      # 不经 Vite 转换的静态资源
├── src/
│   ├── api/                     # 请求参数与响应类型、API 函数
│   ├── layout/                  # 导航栏、内容区和底部 Tabbar
│   ├── locales/                 # 语言加载器与 JSON 语言包
│   ├── router/                  # history 路由与手写路由表
│   ├── store/                   # Pinia Store
│   ├── styles/                  # 全局样式和 SCSS 变量
│   ├── utils/request/           # Axios 实例、拦截器与泛型方法
│   └── views/                   # 页面
├── tests/                       # Vitest 测试
└── types/                       # 全局与模块类型声明
```

## 运行链路

1. `src/main.ts` 创建 Vue 应用并安装 Router、Vue I18n 和 Pinia。
2. `src/router/routes.ts` 懒加载页面；`src/layout/index.vue` 提供移动端壳层。
3. 页面通过 `src/api` 调用 `http`，请求拦截器读取用户 Store 中的令牌。
4. 响应拦截器解包统一响应体；遇到业务码或 HTTP 状态 401 时清理登录态并进入登录页。
5. `src/locales/index.ts` 按语言和命名空间懒加载 JSON。

## 构建链路

`vite.config.mts` 只负责组合配置：

- `build/utils.ts` 将字符串环境变量转换为布尔值并提供默认值。
- `build/vite/proxy.ts` 在配置 `VITE_API_TARGET` 后代理 `/api`。
- `build/vite/plugins` 根据环境开关启用 Mock、Eruda、PWA、HTTPS、Gzip 和分析报告。
- 生产构建使用 esbuild 压缩，并按 Vue 运行时和 UI 库拆分 vendor chunk。

自动生成的 `types/auto-imports.d.ts` 与 `types/components.d.ts` 需要提交，确保新安装后可直接类型检查。
