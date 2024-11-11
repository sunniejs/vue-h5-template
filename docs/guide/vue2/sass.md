# Sass 全局样式

首先 你可能会遇到 `node-sass` 安装不成功，别放弃多试几次！！！

每个页面自己对应的样式都写在自己的 .vue 文件之中 `scoped` 它顾名思义给 css 加了一个域的概念。

```html
<style lang="scss">
  /* global styles */
</style>

<style lang="scss" scoped>
  /* local styles */
</style>
```

#### 目录结构

vue-h5-template 所有全局样式都在 `@/src/assets/css` 目录下设置

```bash
├── assets
│   ├── css
│   │   ├── index.scss               # 全局通用样式
│   │   ├── mixin.scss               # 全局mixin
│   │   └── variables.scss           # 全局变量
```

#### 自定义 vant-ui 样式

现在我们来说说怎么重写 `vant-ui` 样式。由于 `vant-ui` 的样式我们是在全局引入的，所以你想在某个页面里面覆盖它的样式就不能加 `scoped`，但你又想只覆盖这个页面的 `vant` 样式，你就可在它的父级加一个 `class`，用命名空间来解决问题。

```css
.about-container {
  /* 你的命名空间 */
  .van-button {
    /* vant-ui 元素*/
    margin-right: 0px;
  }
}
```

#### 父组件改变子组件样式 深度选择器

当你子组件使用了 `scoped` 但在父组件又想修改子组件的样式可以 通过 `>>>` 来实现：

```css
<style scoped>
.a >>> .b { /* ... */ }
</style>
```

#### 全局变量

`vue.config.js` 配置使用 `css.loaderOptions` 选项，注入 `sass` 的 `mixin` `variables` 到全局，不需要手动引入，配置`$cdn`通过变量形式引入 cdn 地址，这样向所有 Sass/Less 样式传入共享的全局变量：

```javascript
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const defaultSettings = require("./src/config/index.js");
module.exports = {
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      // 给 scss-loader 传递选项
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
};
```

设置 js 中可以访问 `$cdn`，`.vue` 文件中使用`this.$cdn`访问

```javascript
// 引入全局样式
import "@/assets/css/index.scss";

// 设置 js中可以访问 $cdn
// 引入cdn
import { $cdn } from "@/config";
Vue.prototype.$cdn = $cdn;
```

在 css 和 js 使用

```html
<script>
  console.log(this.$cdn);
</script>
<style lang="scss" scoped>
  .logo {
    width: 120px;
    height: 120px;
    background: url($cdn + "/weapp/logo.png") center / contain no-repeat;
  }
</style>
```
