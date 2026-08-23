# 质量保障

## 本地检查

```bash
pnpm check
```

执行顺序如下：

1. ESLint 检查 `src`、`mock`、`build`、`tests` 和配置文件。
2. `vue-tsc --build` 检查 Vue SFC 与 TypeScript。
3. Vitest 运行单元测试。
4. Vite 执行生产构建。

## 测试结构

`tests/router/routes.test.ts` 提供最小测试基线，确认主 Tab 页面、详情、登录和兜底路由存在。新增业务逻辑时，优先测试以下边界：

- API 参数与响应转换
- Store 状态变化和持久化范围
- 路由守卫与权限
- 有条件渲染和用户交互

组件测试使用 `@vue/test-utils`，DOM 环境由 jsdom 提供。

## CI

`.github/workflows/ci.yml` 在 push 和 pull request 时使用冻结锁文件安装依赖，并依次运行 lint、typecheck、test 和 build。
