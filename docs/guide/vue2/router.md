# Vue-router

本案例采用 `hash` 模式，开发者根据需求修改 `mode` `base`

**注意**：如果你使用了 `history` 模式，`vue.config.js` 中的 `publicPath` 要做对应的**修改**

前往: [vue.config.js 基础配置](#base)

```javascript
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export const router = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/home/index"), // 路由懒加载
    meta: {
      title: "首页", // 页面标题
      keepAlive: false, // keep-alive 标识
    },
  },
];
const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置 vue.config.js publicPath
    // base: '/app/',
    scrollBehavior: () => ({ y: 0 }),
    routes: router,
  });

export default createRouter();
```
