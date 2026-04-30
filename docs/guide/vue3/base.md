# vite.config.mts 基础配置

如果你的 `Vue Router` 模式是 hash

```javascript
base: './',
```

如果你的 `Vue Router` 模式是 history 这里的 base 和你的 `Vue Router` `base` **保持一致**

```javascript
base: '/app/',
```

完整配置：

```javascript
export default function ({ command, mode }: ConfigEnv): UserConfig {
  const isProduction = command === "build";
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  const devOptimizeDepsInclude: Array<string> = ["eruda"];
  // 开发环境自动扫描 UI 库组件目录，优化依赖预构建
  if (!isProduction) {
    const uiLibraries = [
      { name: "vant/es", path: "node_modules/vant/es" },
      { name: "@nutui/nutui/dist/packages", path: "node_modules/@nutui/nutui/dist/packages" },
      { name: "@varlet/ui/es", path: "node_modules/@varlet/ui/es" },
    ];
    // ...自动将组件样式加入 optimizeDeps.include
  }

  return {
    base: "/",
    root,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "#": fileURLToPath(new URL("./types", import.meta.url)),
      },
    },
    server: {
      host: true,
      hmr: true,
    },
    plugins: createVitePlugins(viteEnv, isProduction),
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          // 生产环境时移除 console
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 配置 nutui 全局 scss 变量
          additionalData: `@use "@/styles/variable.scss" as *;@use "@nutui/nutui/dist/styles/variables.scss" as *;`,
          quietDeps: true,
        },
      },
    },
    optimizeDeps: {
      include: [...devOptimizeDepsInclude],
    },
  };
}
```

## optimizeDeps 说明

项目在开发环境下会自动扫描 Vant、NutUI、Varlet 组件目录，将组件样式文件加入 `optimizeDeps.include`，避免首次加载组件时出现页面刷新，提升开发体验。
