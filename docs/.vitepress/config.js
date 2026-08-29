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
      { text: "后端服务与联调", link: "/guide/backend" },
      { text: "商城示例", link: "/guide/commerce" },
      { text: "环境与构建", link: "/guide/environment" },
      { text: "请求与鉴权", link: "/guide/request" },
      { text: "状态管理", link: "/guide/state-management" },
      { text: "AI Chat", link: "/guide/ai-chat" },
      { text: "UI 框架策略", link: "/guide/ui-framework" },
      { text: "国际化", link: "/guide/i18n" },
      { text: "质量保障", link: "/guide/testing" },
      { text: "部署", link: "/guide/deployment" },
      { text: "迁移到 v2", link: "/guide/migration-v2" },
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
      { text: "Backend Integration", link: "/en/guide/backend" },
      { text: "Commerce Example", link: "/en/guide/commerce" },
      { text: "Environment & Build", link: "/en/guide/environment" },
      { text: "Requests & Auth", link: "/en/guide/request" },
      { text: "State Management", link: "/en/guide/state-management" },
      { text: "AI Chat", link: "/en/guide/ai-chat" },
      { text: "UI Frameworks", link: "/en/guide/ui-framework" },
      { text: "Internationalization", link: "/en/guide/i18n" },
      { text: "Quality", link: "/en/guide/testing" },
      { text: "Deployment", link: "/en/guide/deployment" },
      { text: "Migrate to v2", link: "/en/guide/migration-v2" },
      { text: "Contributing", link: "/en/guide/contributing" },
    ],
  },
];

const jaSidebar = [
  {
    text: "ガイド",
    items: [
      { text: "プロジェクト紹介", link: "/ja/guide/" },
      { text: "クイックスタート", link: "/ja/guide/start" },
      { text: "アーキテクチャ", link: "/ja/guide/architecture" },
      { text: "バックエンド連携", link: "/ja/guide/backend" },
      { text: "コマース実装例", link: "/ja/guide/commerce" },
      { text: "環境とビルド", link: "/ja/guide/environment" },
      { text: "リクエストと認証", link: "/ja/guide/request" },
      { text: "状態管理", link: "/ja/guide/state-management" },
      { text: "AI Chat", link: "/ja/guide/ai-chat" },
      { text: "UI フレームワーク", link: "/ja/guide/ui-framework" },
      { text: "国際化", link: "/ja/guide/i18n" },
      { text: "テスト", link: "/ja/guide/testing" },
      { text: "デプロイ", link: "/ja/guide/deployment" },
      { text: "v2 移行", link: "/ja/guide/migration-v2" },
      { text: "コントリビューション", link: "/ja/guide/contributing" },
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
      description: "基于 Vue 3、Vite 8 和 TypeScript 的现代移动端 H5 工程模板",
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
      description: "A modern mobile H5 starter built with Vue 3, Vite 8, and TypeScript",
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
    ja: {
      label: "日本語",
      lang: "ja-JP",
      link: "/ja/",
      title: "Vue H5 Template",
      description: "Vue 3、Vite 8、TypeScript によるモダンなモバイル H5 テンプレート",
      themeConfig: {
        nav: [
          { text: "ガイド", link: "/ja/guide/" },
          { text: "GitHub", link: repository },
        ],
        sidebar: jaSidebar,
        outline: { label: "目次" },
        docFooter: { prev: "前へ", next: "次へ" },
        lastUpdated: { text: "最終更新" },
        editLink: {
          pattern: `${repository}/edit/docs/docs/:path`,
          text: "GitHub で編集",
        },
        socialLinks,
        footer: {
          message: "MIT License で公開",
          copyright: "Copyright © 2022-present Fonghehe",
        },
      },
    },
  },
});
