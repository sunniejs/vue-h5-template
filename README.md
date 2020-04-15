# vue-h5-template

基于 vue-cli3.0+webpack 4+vant ui + sass+ rem 适配方案+axios 封装，构建手机端模板脚手架

[关于项目介绍](https://juejin.im/post/5cfefc73f265da1bba58f9f7)

[demo](https://solui.cn/vue-h5-template/#/)建议手机端查看

### Node 版本要求

`Vue CLI` 需要 Node.js 8.9 或更高版本 (推荐 8.11.0+)。你可以使用 [nvm](https://github.com/nvm-sh/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 在同一台电脑中管理多个 Node 版本。

本示例 Node.js 12.14.1

<span id="top">目录</span>

- [√ 配置多环境变量](#env)
- [√ rem 适配方案](#rem)
- [√ Vue-cli4](https://cli.vuejs.org/zh/guide/)
- [√ VantUI 组件按需加载](#vant) 
- [√ Sass](#sass)  
- Webpack 4
- Vuex
- Axios 封装
- 生产环境 cdn 优化首屏加速
- babel 低版本浏览器兼容
- Eslint+Pettier 统一开发规范

 
### <span id="env">✅ 配置多环境变量 </span>

&emsp;&emsp;NODE_ENV 和 BASE_URL 是两个特殊变量，在代码中始终可用

`package.json` 里的 `scripts` 配置 `serve` `stage` `build`，通过 `--mode xxx` 来执行不同环境

- 通过 `npm run serve` 启动本地 , 执行 `development`
- 通过 `npm run stage` 打包测试 , 执行 `staging`
- 通过 `npm run build` 打包正式 , 执行 `production`

```javascript
"scripts": {
  "serve": "vue-cli-service serve --open",
  "stage": "vue-cli-service build --mode staging",
  "build": "vue-cli-service build",
}
```

##### 配置介绍

&emsp;&emsp;以 `VUE_APP_` 开头的变量，在代码中可以通过 `process.env.VUE_APP_` 访问。  
&emsp;&emsp;比如,`VUE_APP_ENV = 'development'` 通过`process.env.VUE_APP_ENV` 访问
&emsp;&emsp; 除了 `VUE_APP_*` 变量之外，在你的应用代码中始终可用的还有两个特殊的变量`NODE_ENV` 和`BASE_URL`

在项目根目录中新建.env

- .env.development 本地开发环境配置

```bash
NODE_ENV='development'
# must start with VUE_APP_
VUE_APP_ENV = 'development'

```

- .env.staging 测试环境配置

```bash
NODE_ENV='production'
# must start with VUE_APP_
VUE_APP_ENV = 'staging'
```

- .env.production 正式环境配置

```bash
 NODE_ENV='production'
# must start with VUE_APP_
VUE_APP_ENV = 'production'
```

这里我们并没有定义很多变量，只定义了基础的 VUE_APP_ENV `development` `staging` `production`  
变量我们统一在 src/config/env.\*.js 里进行管理。修改起来方便，不需要重启项目，符合开发习惯。

config/index.js

```javascript
// 根据环境引入不同配置 process.env.NODE_ENV
const config = require('./env.' + process.env.VUE_APP_ENV)
module.exports = config
```

配置对应环境的变量，拿本地环境文件 `env.development.js` 举例，用户可以根据需求修改

```javascript
// 本地环境配置
module.exports = {
  title: 'vue-h5-template',
  baseUrl: 'http://localhost:9018', // 项目地址
  baseApi: 'https://test.xxx.com/api', // 本地api请求地址
  APPID: 'xxx',
  APPSECRET: 'xxx'
}
```

根据环境不同，变量就会不同了

```javascript
// 根据环境不同引入不同baseApi地址
import {baseApi} from '@/config'
console.log(baseApi)
```

[▲ 回顶部](#top)

### <span id="rem">✅ rem 适配方案 </span>

不用担心，项目已经配置好了 `rem` 适配, 下面仅做介绍：

Vant 中的样式默认使用`px`作为单位，如果需要使用`rem`单位，推荐使用以下两个工具:

- [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) 是一款 `postcss` 插件，用于将单位转化为 `rem`
- [lib-flexible](https://github.com/amfe/lib-flexible) 用于设置 `rem` 基准值

##### PostCSS 配置

下面提供了一份基本的 `postcss` 配置，可以在此配置的基础上根据项目需求进行修改

```javascript
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
```

更多详细信息： [vant](https://youzan.github.io/vant/#/zh-CN/quickstart#jin-jie-yong-fa)

**新手必看，老鸟跳过**

很多小伙伴会问我，适配的问题。

举个例子：设计给了你一张 750px \* 1334px 图片，在 iPhone6 上铺满屏幕,其他机型适配。 

- 当`rootValue: 70` , 样式 `width: 750px;height: 1334px;` 图片会撑满 iPhone6 屏幕，这个时候切换其他机型，图片也会跟着撑满。  
- 当`rootValue: 37.5` 的时候，样式 `width: 375px;height: 667px;` 图片会撑满 iPhone6 屏幕。  

本案例采用  Vant 是基于 375 设计稿 , rootValue: 37.5。其他的你就可以根据你设计图，去做对应的设置了。

当然，想要撑满屏幕你可以使用100%，这里只是举例说明。

```html
<img class="image" src="https://imgs.solui.cn/weapp/logo.png" />

<style>
  /* rootValue: 75 */
  .image {
    width: 750px;
    height: 1334px;
  }
  /* rootValue: 37.5 */
  .image {
    width: 375px;
    height: 667px;
  }
</style>
```

[▲ 回顶部](#top)

### <span id="vant">✅ VantUI 组件按需加载 </span>

项目采用[自动按需引入组件 (推荐)](https://youzan.github.io/vant/#/zh-CN/quickstart#fang-shi-yi.-zi-dong-an-xu-yin-ru-zu-jian-tui-jian)

下面安装插件介绍：

[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 是一款 `babel` 插件，它会在编译过程中将 `import` 的写法自动转换为按需引入的方式

# 安装插件

```javascript
npm i babel-plugin-import -D

// 对于使用 babel7 的用户，可以在 babel.config.js 中配置
module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', {useBuiltIns: 'entry'}]],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}
```

# 使用组件

项目在 `src/plugins/vant.js` 下统一管理组件，用哪个引入哪个，无需在页面里重复引用

```javascript
// 按需全局引入 vant组件
import Vue from 'vue'
import {Button, List, Cell, Tabbar, TabbarItem} from 'vant'
Vue.use(Button)
Vue.use(Cell)
Vue.use(List)
Vue.use(Tabbar).use(TabbarItem)

```
[▲ 回顶部](#top)

### <span id="sass">✅ Sass </span>

首先 你可能会遇到 `node-sass` 安装不成功，别放弃多试几次！！！  

在 `src/assets/css/`文件夹下包含了三个文件  
- `index.scss` 主入口，主要引入其他两个scss文件，和公共样式
- `variables.scss` 定义变量
- `mixin.scss` 定义 `mixin` 方法

你可以直接在vue文件下写 sass 语法

```html
<style lang="scss" scoped>
 
</style>

```

[▲ 回顶部](#top)

#### 总结

因为项目刚刚构建起来，后面还会持续更新，实际使用过程中一定还有很多问题，如果文章中有错误希望能够被指正，一起成长

# 关于我

获取更多技术相关文章，关注公众号”前端女塾“。

回复加群，即可加入”前端仙女群“

 <p>
  <img src="./static/gognzhonghao.jpg" width="256" style="display:inline;">
</p>
扫描添加下方的微信并备注 Sol 加交流群，交流学习，及时获取代码最新动态。

<p>
  <img src="./static/me.png" width="256" style="display:inline;">
</p>
 
如果对你有帮助送我一颗小星星（づ￣3￣）づ╭❤～
