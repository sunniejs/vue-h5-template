import { defineConfig } from "vitepress";

const repository = "https://github.com/sunniejs/vue-h5-template";
const socialLinks = [{ icon: "github", link: repository }];

const zhSidebar = [
  {
    text: "指南",
    items: [
      { text: "项目介绍", link: "/guide/" },
      { text: "快速开始", link: "/guide/start" },
      { text: "项目架构", link: "/guide/architecture" },
      { text: "环境与构建", link: "/guide/environment" },
      { text: "请求与鉴权", link: "/guide/request" },
      { text: "UI 与移动端适配", link: "/guide/ui" },
      { text: "国际化", link: "/guide/i18n" },
      { text: "质量保障", link: "/guide/testing" },
      { text: "部署", link: "/guide/deployment" },
      { text: "参与贡献", link: "/guide/contributing" },
    ],
  },
];

const enSidebar = [
  {
    text: "Guide",
    items: [
      { text: "Introduction", link: "/en/guide/" },
      { text: "Getting Started", link: "/en/guide/start" },
      { text: "Architecture", link: "/en/guide/architecture" },
      { text: "Environment & Build", link: "/en/guide/environment" },
      { text: "Requests & Auth", link: "/en/guide/request" },
      { text: "UI & Mobile", link: "/en/guide/ui" },
      { text: "Internationalization", link: "/en/guide/i18n" },
      { text: "Quality", link: "/en/guide/testing" },
      { text: "Deployment", link: "/en/guide/deployment" },
      { text: "Contributing", link: "/en/guide/contributing" },
    ],
  },
];

export default defineConfig({
  base: "/vue-h5-template/",
  cleanUrls: true,
  lastUpdated: true,
  head: [["meta", { name: "theme-color", content: "#0f766e" }]],
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "Vue H5 Template",
      description: "基于 Vue 3、Vite 7 和 TypeScript 的移动端 H5 项目模板",
      themeConfig: {
        nav: [
          { text: "指南", link: "/guide/" },
          { text: "GitHub", link: repository },
        ],
        sidebar: zhSidebar,
        outline: { label: "本页目录" },
        docFooter: { prev: "上一篇", next: "下一篇" },
        lastUpdated: { text: "最后更新" },
        editLink: {
          pattern: `${repository}/edit/docs/docs/:path`,
          text: "在 GitHub 上编辑此页",
        },
        socialLinks,
        footer: {
          message: "基于 MIT License 发布",
          copyright: "Copyright © 2022-present Fonghehe",
        },
      },
    },
    en: {
      label: "English",
      lang: "en-US",
      link: "/en/",
      title: "Vue H5 Template",
      description: "A mobile H5 starter built with Vue 3, Vite 7, and TypeScript",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/en/guide/" },
          { text: "GitHub", link: repository },
        ],
        sidebar: enSidebar,
        outline: { label: "On this page" },
        docFooter: { prev: "Previous", next: "Next" },
        lastUpdated: { text: "Last updated" },
        editLink: {
          pattern: `${repository}/edit/docs/docs/:path`,
          text: "Edit this page on GitHub",
        },
        socialLinks,
        footer: {
          message: "Released under the MIT License",
          copyright: "Copyright © 2022-present Fonghehe",
        },
      },
    },
  },
});
