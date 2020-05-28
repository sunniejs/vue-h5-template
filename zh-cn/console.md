### <span id="console">✅ 去掉 console.log </span>

保留了测试环境和本地环境的 `console.log`

```bash
npm i -D babel-plugin-transform-remove-console
```

在 babel.config.js 中配置

```javascript
// 获取 VUE_APP_ENV 非 NODE_ENV，测试环境依然 console
const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)
const plugins = [
    [
        'import',
        {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true,
        },
        'vant',
    ],
]
// 去除 console.log
if (IS_PROD) {
    plugins.push('transform-remove-console')
}

module.exports = {
    presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'entry' }]],
    plugins,
}
```
