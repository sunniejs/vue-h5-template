# 多环境变量

`package.json` 里的 `scripts` 配置 `dev` `build`，通过 `--mode xxx` 来执行不同环境

- 通过 `pnpm dev` 启动本地环境参数，执行 `development`
- 通过 `pnpm build` 打包正式环境参数，执行 `production`

```json
"scripts": {
    "dev": "vite",
    "build": "vite build"
}
```

## 环境变量配置

项目中有三个环境变量文件：

- `.env.development` - 开发环境
- `.env.test` - 测试环境
- `.env.production` - 生产环境

可配置的变量：

```bash
# 是否开启数据mock
VITE_USE_MOCK=true

# Token Key
VITE_TOKEN_KEY=Authorization

# 是否开启调试工具
VITE_USE_ERUDA=true

# 是否开启压缩
VITE_USE_COMPRESS=false

# 是否开启打包后生成报告
VITE_USE_REPORT=false

# 是否开启https
VITE_USE_HTTPS=false

# 是否开启PWA
VITE_USE_PWA=false
```

在代码中通过 `import.meta.env.VITE_XXX` 访问环境变量。
