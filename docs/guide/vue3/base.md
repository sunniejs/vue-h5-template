# vite.config.mts 基础配置

如果你的 `Vue Router` 模式是 hash

```javascript
base: './',
```

如果你的 `Vue Router` 模式是 history 这里的 base 和你的 `Vue Router` `base` **保持一致**

```javascript
base: '/app/',
```

```javascript
export default function ({ command, mode }: ConfigEnv): UserConfig {
  const isProduction = command === "build";
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

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
          //生产环境时移除console
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
  };
}
```
