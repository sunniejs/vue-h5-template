import menu from "./menu";

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
    sidebar: menu,

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
      appId: "CV2I8NGBKZ",
      apiKey: "63c37a467485b00383daacf7340b4ca0",
      indexName: "vue-h5-template",
    },
  },
};

function nav() {
  return [
    { text: "介绍", link: "/guide/" },
    { text: "加入我们", link: "/guide/about/" },
    {
      text: "github仓库",
      link: "https://github.com/sunniejs/vue-h5-template",
    },
  ];
}
