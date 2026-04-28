# Vite 插件集成

基于原生 ES 模块提供了丰富的内建功能，如速度快到惊人的模块热更新（HMR），使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。更多关于 [Vite](https://cn.vitejs.dev/guide/)

模版集成了如下的 vite 插件（配置目录：`build/vite/plugins/`）

- unplugin-auto-import（按需加载，自动引入）
- unplugin-vue-components（按需加载，自动引入组件）
- vite-plugin-compression（开启 .gz 压缩）
- @zhaojjiang/vite-plugin-eruda（控制台，方便移动端调试）
- vite-plugin-imagemin（图片压缩）
- vite-plugin-mock（引入 mockjs，本地模拟接口）
- vite-plugin-pages（动态生成路由）
- vite-plugin-progress（构建显示进度条）
- vite-plugin-restart（监听配置文件修改自动重启 Vite）
- vite-plugin-svg-icons（加载 SVG 文件，自动引入）
- vite-plugin-pwa（PWA 支持）
- vite-plugin-qrcode（开发时生成二维码，方便移动端调试）
- @vitejs/plugin-basic-ssl（本地 HTTPS 开发支持）
- rollup-plugin-visualizer（打包分析报告）
