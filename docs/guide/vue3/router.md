# vue-router

本案例采用 `hash` 模式，开发者根据需求修改 `mode` `base`

**注意**：如果你使用了 `history` 模式， `vue.config.js` 中的 `publicPath` 要做对应的**修改**

前往: [vite.config.js 基础配置](#base)

```javascript
import Vue from "vue";
import { createRouter, createWebHistory, Router } from "vue-router";

Vue.use(Router);
export const router = [
  {
    name: "root",
    path: "/",
    redirect: "/home",
    component: () => import("@/layout/basic/index.vue"),
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
```
