# viewport 适配方案

不用担心，项目已经配置好了 `viewport` 适配，下面仅做介绍：

- [cnjm-postcss-px-to-viewport](https://github.com/cnjm/postcss-px-to-viewport) 是一款 `postcss` 插件，用于将单位转化为 `vw`， 现在很多浏览器对`vw`的支持都很好，适配首选方案。

## PostCSS 配置

下面提供了一份基本的 `postcss` 配置，可以在此配置的基础上根据项目需求进行修改

```javascript
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: {
    autoprefixer: { overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8'] },
    'cnjm-postcss-px-to-viewport': {
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 750, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      include: [],
      exclude: [], // 设置忽略文件，用正则做目录名匹配
      customFun: ({ file }) => {
        // 这个自定义的方法是针对处理vant组件下的设计稿为375问题
        const designWidth = judgeComponent(file) ? 375 : 750;
        return designWidth;
      },
  },
};
```

**新手必看，老鸟跳过**

很多小伙伴会问我，适配的问题, 因为我们使用的是 Vant UI，所以必须根据 Vant UI 375 的设计规范走，一般我们的设计会将 UI 图上传到蓝湖，我们就可以得到需要的尺寸了。下面就简单普及一下 rem 适配的原理。

我们知道 `1rem` 等于 `html` 根元素设定的 `font-size` 的 `px` 值。Vant UI 设置 `rootValue: 37.5` , 你可以看到在 iPhone 6 下看到 （ `1rem 等于 37.5px` ）：

```html
<html data-dpr="1" style="font-size: 37.5px;"></html>
```

切换不同的机型，根元素可能会有不同的 `font-size` 。当你写 css px 样式时，会被程序换算成 `rem` 达到适配。

因为我们用了 Vant 的组件，需要按照 `rootValue: 37.5` 来写样式。

举个例子：设计给了你一张 750px \* 1334px 图片，在 iPhone6 上铺满屏幕, 其他机型适配。

- 当`rootValue: 75` , 样式 `width: 750px;height: 1334px;` 图片会撑满 iPhone6 屏幕，这个时候切换其他机型，图片也会跟着撑满。
- 当`rootValue: 37.5` 的时候，样式 `width: 375px;height: 667px;` 图片会撑满 iPhone6 屏幕。

也就是 iphone 6 下 375px 宽度写 CSS。其他的你就可以根据你设计图，去写对应的样式就可以了。

当然，想要撑满屏幕你可以使用 100%，这里只是举例说明。

```html
<img class="image" src="https://www.sunniejs.cn/static/weapp/logo.png" />

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
