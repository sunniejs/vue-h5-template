# 配置 externals 引入 cdn 资源

这个版本 CDN 不再引入，我测试了一下使用引入 CDN 和不使用，不使用会比使用时间少。网上不少文章测试 CDN 速度块，这个开发者可
以实际测试一下。

另外项目中使用的是公共 CDN 不稳定，域名解析也是需要时间的（如果你要使用请尽量使用同一个域名）

因为页面每次遇到`<script>`标签都会停下来解析执行，所以应该尽可能减少`<script>`标签的数量 `HTTP`请求存在一定的开销，100K
的文件比 5 个 20K 的文件下载的更快，所以较少脚本数量也是很有必要的

暂时还没有研究放到自己的 cdn 服务器上。

```javascript
const defaultSettings = require("./src/config/index.js");
const name = defaultSettings.title || "vue mobile template";
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

// externals
const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  vant: "vant",
  axios: "axios",
};
// CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [],
  },
  // 生产环境
  build: {
    css: ["https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.css"],
    js: [
      "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js",
      "https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js",
      "https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js",
      "https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js",
      "https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.min.js",
    ],
  },
};
module.exports = {
  configureWebpack: (config) => {
    config.name = name;
    // 为生产环境修改配置...
    if (IS_PROD) {
      // externals
      config.externals = externals;
    }
  },
  chainWebpack: (config) => {
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中
     */
    config.plugin("html").tap((args) => {
      if (IS_PROD) {
        args[0].cdn = cdn.build;
      } else {
        args[0].cdn = cdn.dev;
      }
      return args;
    });
  },
};
```

在 public/index.html 中添加

```javascript
    <!-- 使用CDN的CSS文件 -->
    <% for (var i in
      htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.css) { %>
      <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="preload" as="style" />
      <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="stylesheet" />
    <% } %>
     <!-- 使用CDN加速的JS文件，配置在vue.config.js下 -->
    <% for (var i in
      htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.js) { %>
      <script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
    <% } %>
```
