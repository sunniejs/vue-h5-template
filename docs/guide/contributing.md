# 参与贡献

## 开发约定

- 使用 pnpm，不提交 `package-lock.json` 或 `yarn.lock`。
- API 函数必须声明请求参数和响应类型。
- 避免 `any`；边界数据先使用 `unknown`，验证后再缩小类型。
- Mock 默认只用于开发环境。
- 自动生成的组件和自动导入声明需要与源码一并提交。

## 提交前检查

```bash
pnpm check
```

Pull Request 应说明行为变化、验证方式和可能影响的环境变量。

## 更新文档

文档维护在 `docs` 分支：

```bash
git switch docs
pnpm install
pnpm dev
```

功能文档需要同步更新简体中文与 English 页面。导航定义在 `docs/.vitepress/config.js`，提交前运行 `pnpm build` 检查链接和 VitePress 配置。
