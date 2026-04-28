# vue-router

本案例采用 `hash` 模式，开发者根据需求修改 `mode` `base`

**注意**：如果你使用了 `history` 模式， `vite.config.mts` 中的 `base` 要做对应的**修改**

前往: [vite.config.mts 基础配置](/guide/vue3/base)

```typescript
import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "common.tabbar.home",
          keepAlive: true,
        },
      },
      // ... 其他子路由
    ],
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "",
      keepAlive: true,
    },
  },
  // 匹配不到重定向到首页
  {
    path: "/:pathMatch(.*)",
    redirect: "/home",
  },
];
```

路由实例创建：

```typescript
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
```
