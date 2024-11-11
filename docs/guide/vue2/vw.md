# vm 适配方案

本项目使用的是 `rem` 的 适配方案，其实无论你使用哪种方案，都不需要你去计算 12px 是多少 `rem` 或者 `vw`, 会有专门的工具去帮你做
。如果你想用 `vw`，你可以按照下面的方式切换。

## 1.安装依赖

```bash

npm install postcss-px-to-viewport -D

```

## 2.修改 .postcssrc.js

将根目录下 .postcssrc.js 文件修改如下

```javascript
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
      ],
    },
    "postcss-px-to-viewport": {
      viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: "vw", // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: [".ignore", ".hairlines"], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false, // 允许在媒体查询中转换`px`
    },
  },
};
```

## 3.删除原来的 rem 相关代码

src/main.js 删除如下代码

```javascript
// 移动端适配
import "lib-flexible/flexible.js";
```

package.json 删除如下代码

```javascript
"lib-flexible": "^0.3.2",
"postcss-pxtorem": "^5.1.1",
```

运行起来，F12 元素 css style 就是 vw 单位了
