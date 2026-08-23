# 快速开始

## 环境要求

| 工具 | 版本 |
| --- | --- |
| Node.js | `>= 20.10.0` |
| pnpm | `>= 9.12.0` |

仓库只维护 `pnpm-lock.yaml`。不要混用 npm、Yarn 和 pnpm。

## 安装与启动

```bash
git clone https://github.com/sunniejs/vue-h5-template.git
cd vue-h5-template
git switch vue-h5-template
pnpm install
pnpm dev
```

Vite 默认监听所有本地网卡，并在终端显示可供手机扫码访问的地址。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生成生产产物到 `dist` |
| `pnpm preview` | 本地预览生产产物 |
| `pnpm lint` | 检查 ESLint |
| `pnpm typecheck` | 执行 Vue 和 TypeScript 类型检查 |
| `pnpm test` | 运行 Vitest |
| `pnpm check` | 依次运行 lint、typecheck、test 和 build |

## 首次配置

1. 查看 `.env.example`，按后端环境设置 `VITE_API_TARGET`。
2. 确认 `src/router/routes.ts` 中只保留业务需要的页面。
3. 从三套 UI 库中选定业务主库，并删除其余演示代码和依赖。
4. 在提交前运行 `pnpm check`。
