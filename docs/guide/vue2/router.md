# Vue-router

本案例采用 `hash` 模式，开发者根据需求修改 `mode` `base`

**注意**：如果你使用了 `history` 模式，`vue.config.js` 中的 `publicPath` 要做对应的**修改**

前往: [vue.config.js 基础配置](#base)

### 路由配置 (router.config.js)

```javascript
export const constantRouterMap = [
  {
    path: "/",
    component: () => import("@/views/layouts/index"),
    redirect: "/home",
    meta: { title: "首页", keepAlive: false },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/index"),
        meta: { title: "首页", keepAlive: false },
      },
      {
        path: "/about",
        name: "About",
        component: () => import("@/views/home/about"),
        meta: { title: "关于我", keepAlive: false },
      },
    ],
  },
  // 404 catch-all
  {
    path: "*",
    redirect: "/home",
  },
];
```

### 路由实例 (router/index.js)

```javascript
import Vue from "vue";
import Router from "vue-router";
import { constantRouterMap } from "./router.config.js";

Vue.use(Router);

const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置 vue.config.js publicPath
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap,
  });

export default createRouter();
```
