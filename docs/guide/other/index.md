### 1、为什么有多个组件库？

本模版想做到的是尽可能的开箱即用，不用去看别的文档引入相关组件库，毕竟做减法比做加法要容易些，如你不需要某个组件库可以根据[这篇指引](/guide/vue3/ui.html)去移除某个组件库

### 2、我可以用在个人或公司的项目吗？

模版基于 MIT License，你可以根据自己的需求用到不同的项目里，如果对你有帮助点个 star 支持一下呗 🌟

### 3、我是一个新手，有什么好的学习建议吗？

过来人的经验就是熟读文档可以少走很多弯路，很多的人文档没读熟就开始动手，出了问题也不知道如何去解决，墙裂建议先把[文档](https://cn.vuejs.org/)熟读

### 4、为什么 vue3 版本使用 history 模式而不是 hash？

Vue 3 版本默认使用 `createWebHistory`（history 模式），URL 更简洁美观。如需 hash 模式，参考[路由文档](/guide/vue3/router.html)切换

### 5、viewport 适配时 UI 库组件尺寸不对？

项目已通过 `customFun` 自动处理 Vant / NutUI / Varlet 的 375 设计稿和业务代码 750 设计稿的差异，无需手动处理

### 6、如何部署到生产环境？

项目内置了 `Dockerfile` + `nginx.conf`，可直接使用 Docker 部署。如使用 history 模式，确保服务端已配置 fallback
