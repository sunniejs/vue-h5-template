# vite.config.ts 基础配置

如果你的 `Vue Router` 模式是 hash

```javascript
base: './',
```

如果你的 `Vue Router` 模式是 history 这里的 publicPath 和你的 `Vue Router` `base` **保持一致**

```javascript
base: '/app/',
```

```javascript
export default function ({ command }: ConfigEnv): UserConfigExport {
  const isProduction = command === "build";
  return {
    server: {
      host: "0.0.0.0",
    },
    plugins: [
      vue(),
      vueJsx(),
      createStyleImportPlugin({
        resolves: [NutuiResolve()],
      }),
      eruda(),
      viteMockServe({
        mockPath: "./src/mock",
        localEnabled: command === "serve",
        logger: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 配置 nutui 全局 scss 变量
          additionalData: `@import "@nutui/nutui/dist/styles/variables.scss";`,
        },
      },
    },
  };
}
```
