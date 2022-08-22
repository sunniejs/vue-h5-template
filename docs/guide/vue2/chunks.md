# splitChunks 单独打包第三方模块

```javascript
module.exports = {
  chainWebpack: (config) => {
    config.when(IS_PROD, (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // 将 runtime 作为内联引入不单独存在
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true, // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: "chunk-libs",
            chunks: "initial", // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
          vantUI: {
            name: "chunk-vantUI", // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
  },
};
```
