### <span id="ie">✅ 添加 IE 兼容 </span>

之前的方式 会报 `@babel/polyfill` is deprecated. Please, use required parts of `core-js` and
`regenerator-runtime/runtime` separately

`@babel/polyfill` 废弃，使用 `core-js` 和 `regenerator-runtime`

```bash
npm i --save core-js regenerator-runtime
```

在 `main.js` 中添加

```javascript
// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

配置 `babel.config.js`

```javascript
const plugins = []

module.exports = {
    presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'usage', corejs: 3 }]],
    plugins,
}
```
