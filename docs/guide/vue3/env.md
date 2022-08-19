`package.json` 里的 `scripts` 配置 `dev` `dev:test` `dev:prod` ，通过 `--mode xxx` 来执行不同环境

- 通过 `yarn dev` 启动本地环境参数 , 执行 `development`
- 通过 `yarn dev:test` 启动测试环境参数 , 执行 `test`
- 通过 `yarn dev:prod` 启动正式环境参数 , 执行 `prod`

```javascript
"scripts": {
    "dev": "vite",
    "dev:test": "vite --mode test",
    "dev:prod": "vite --mode production",
}
```
