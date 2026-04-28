# ESLint + Prettier + Stylelint 统一开发规范

根目录下的 `eslint.config.mjs`、`stylelint.config.js`、`prettier.config.js` 内置了 lint 规则，帮助你规范地开发代码，有助于提高团队的代码质量和协作性，可以根据团队的规则进行修改。

项目使用 ESLint flat config（`eslint.config.mjs`），配合 `husky` + `lint-staged` 在 git commit 时自动执行代码检查。

## 常用命令

```bash
# ESLint 检查并修复
pnpm lint:eslint

# Prettier 格式化
pnpm lint:prettier

# Stylelint 检查并修复
pnpm lint:stylelint
```
