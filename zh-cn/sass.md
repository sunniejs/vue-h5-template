### <span id="sass">✅ Sass 全局样式</span>

首先 你可能会遇到 `node-sass` 安装不成功，别放弃多试几次！！！

目录结构，在 `src/assets/css/`文件夹下包含了三个文件

```bash
├── assets
│   ├── css
│   │   ├── index.scss               # 全局通用样式
│   │   ├── mixin.scss               # 全局mixin
│   │   └── variables.scss           # 全局变量
```

每个页面自己对应的样式都写在自己的 .vue 文件之中

```html
<style lang="scss">
    /* global styles */
</style>

<style lang="scss" scoped>
    /* local styles */
</style>
```

`vue.config.js` 配置注入 `sass` 的 `mixin` `variables` 到全局，不需要手动引入 ,配置`$cdn`通过变量形式引入 cdn 地址

```javascript
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const defaultSettings = require('./src/config/index.js')
module.exports = {
    css: {
        extract: IS_PROD,
        sourceMap: false,
        loaderOptions: {
            scss: {
                // 注入 `sass` 的 `mixin` `variables` 到全局, $cdn可以配置图片cdn
                // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
                prependData: `
          @import "assets/css/mixin.scss";
          @import "assets/css/variables.scss";
          $cdn: "${defaultSettings.$cdn}";
          `,
            },
        },
    },
}
```

在 `main.js` 中引用全局样式（发现在上面的，prependData 里设置`@import "assets/css/index.scss";`并没有应用全局样式这里在
main.js 引入）

设置 js 中可以访问 `$cdn`,`.vue` 文件中使用`this.$cdn`访问

```javascript
// 引入全局样式
import '@/assets/css/index.scss'

// 设置 js中可以访问 $cdn
// 引入cdn
import { $cdn } from '@/config'
Vue.prototype.$cdn = $cdn
```

在 css 和 js 使用

```html
<script>
    console.log(this.$cdn)
</script>
<style lang="scss" scoped>
    .logo {
        width: 120px;
        height: 120px;
        background: url($cdn+'/weapp/logo.png') center / contain no-repeat;
    }
</style>
```
