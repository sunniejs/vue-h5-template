module.exports = {
  lang: "zh-CN",
  title: "Vue-H5-Template",
  base: "/vue-h5-template/",
  description: "一个开箱即用的vue h5脚手架",
  lastUpdated: true,
  head: [
    // 添加图标
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  themeConfig: {
    nav: nav(),
    sidebar: {
      "/guide/": sidebarGuide(),
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/sunniejs/vue-h5-template" },
    ],
    editLink: {
      pattern:
        "https://github.com/sunniejs/vue-h5-template/blob/docs/docs/:path",
      text: "在GitHub编辑此页",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2022-present Fonghehe",
    },
    algolia: {
      appId: "5ZHOMUV2DI",
      apiKey: "d1de686f0fd4404abc0897093c246ffb",
      indexName: "vue-h5-template",
    },
  },
};

function nav() {
  return [
    { text: "介绍", link: "/guide/" },
    { text: "加入我们", link: "https://github.com/sunniejs/vue-h5-template" },
  ];
}

function sidebarGuide() {
  return [
    {
      text: "介绍",
      collapsible: true,
      items: [
        { text: "介绍", link: "/guide/" },
        { text: "快速上手", link: "/guide/start" },
        { text: "参与编辑", link: "/guide/edit" },
      ],
    },
    {
      text: "vue3-template",
      collapsible: true,
      items: [
        { text: "启动项目", link: "/guide/vue3/start" },
        { text: "vite.config.ts 基础配置", link: "/guide/vue3/base" },
        { text: "vite插件集成", link: "/guide/vue3/vite" },
        { text: "多环境变量", link: "/guide/vue3/env" },
        { text: "viewport 适配方案", link: "/guide/vue3/viewport" },
        { text: "UI组件库", link: "/guide/vue3/ui" },
        { text: "Pinia 状态管理", link: "/guide/vue3/pinia" },
        { text: "vue-router", link: "/guide/vue3/router" },
        { text: "axios 封装及接口管理", link: "/guide/vue3/axios" },
        { text: "alias", link: "/guide/vue3/alias" },
        { text: "proxy 跨域", link: "/guide/vue3/proxy" },
        { text: "多语言解决方案", link: "/guide/vue3/i18n" },
        {
          text: "统一开发规范",
          link: "/guide/vue3/lint",
        },
      ],
    },
    {
      text: "vue2-template",
      collapsible: true,
      collapsed: true,
      items: [
        { text: "启动项目", link: "/guide/vue2/start" },
        { text: "多环境变量", link: "/guide/vue2/env" },
        { text: "rem 适配方案", link: "/guide/vue2/rem" },
        { text: "vw 适配方案", link: "/guide/vue2/vw" },
        { text: "VantUI 组件按需加载", link: "/guide/vue2/vant" },
        { text: "Sass 全局样式", link: "/guide/vue2/sass" },
        { text: "Vuex 状态管理", link: "/guide/vue2/vuex" },
        { text: "Vue-router", link: "/guide/vue2/router" },
        { text: "Axios 封装及接口管理", link: "/guide/vue2/axios" },
        { text: "vue.config.js 基础配置", link: "/guide/vue2/base" },
        { text: "配置 alias 别名", link: "/guide/vue2/alias" },
        { text: "配置 proxy 跨域", link: "/guide/vue2/proxy" },
        { text: "配置 打包分析", link: "/guide/vue2/bundle" },
        { text: "配置 externals 引入 cdn 资源", link: "/guide/vue2/externals" },
        { text: "去掉 console.log", link: "/guide/vue2/console" },
        { text: "splitChunks 打包第三方模块", link: "/guide/vue2/chunks" },
        { text: "添加 IE 兼容", link: "/guide/vue2/ie" },
        { text: "统一开发规范", link: "/guide/vue2/lint" },
      ],
    },
  ];
}
