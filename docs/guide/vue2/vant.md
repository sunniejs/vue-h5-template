# VantUI 组件按需加载

项目采
用[Vant 自动按需引入组件 (推荐)](https://youzan.github.io/vant/#/zh-CN/quickstart#fang-shi-yi.-zi-dong-an-xu-yin-ru-zu-jian-tui-jian)下
面安装插件介绍：

[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 是一款 `babel` 插件，它会在编译过程中将
`import` 的写法自动转换为按需引入的方式

## 安装插件

```bash
npm i babel-plugin-import -D
```

在`babel.config.js` 设置

```javascript
// 对于使用 babel7 的用户，可以在 babel.config.js 中配置
const plugins = [
  [
    "import",
    {
      libraryName: "vant",
      libraryDirectory: "es",
      style: true,
    },
    "vant",
  ],
];
module.exports = {
  presets: [
    ["@vue/cli-plugin-babel/preset", { useBuiltIns: "usage", corejs: 3 }],
  ],
  plugins,
};
```

## 使用组件

项目在 `src/plugins/vant.js` 下统一管理组件，用哪个引入哪个，无需在页面里重复引用

```javascript
// 按需全局引入 vant组件
import Vue from "vue";
import { Button, List, Cell, Tabbar, TabbarItem } from "vant";
Vue.use(Button);
Vue.use(Cell);
Vue.use(List);
Vue.use(Tabbar).use(TabbarItem);
```
