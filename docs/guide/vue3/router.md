# vue-router

本案例采用 `history` 模式，开发者可根据需求切换为 `hash` 模式

**注意**：如果你使用了 `history` 模式，`vite.config.mts` 中的 `base` 要做对应的**修改**，部署时也需要服务端（如 Nginx）配置 fallback

前往: [vite.config.mts 基础配置](/guide/vue3/base)

## 路由配置

`src/router/routes.ts`：

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
      {
        path: "list",
        component: () => import("@/views/list/index.vue"),
        meta: {
          title: "common.tabbar.list",
          keepAlive: true,
        },
      },
      {
        path: "member",
        component: () => import("@/views/member/index.vue"),
        meta: {
          title: "common.tabbar.member",
          keepAlive: true,
        },
      },
      {
        path: "demo",
        component: () => import("@/views/demo/index.vue"),
        meta: {
          title: "common.tabbar.demo",
          keepAlive: true,
        },
      },
      {
        name: "listDetails",
        path: "/details",
        component: () => import("@/views/list/details/index.vue"),
        meta: {
          title: "common.list.details",
          border: false,
        },
      },
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

## 路由实例

`src/router/index.ts`：

```typescript
import { createRouter, createWebHistory } from "vue-router";
import type { Router } from "vue-router";
import routes from "./routes";

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (_to, _from, next) => {
  next();
});

export default router;
```

## 切换为 hash 模式

如需使用 hash 模式，只需修改 `src/router/index.ts`：

```typescript
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
```
