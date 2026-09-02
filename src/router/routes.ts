import type { RouteRecordRaw } from 'vue-router';

const useMock = String(import.meta.env.VITE_USE_MOCK) === 'true';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: { name: 'home' },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: 'common.routes.home',
          section: 'home',
          keepAlive: true,
          hideHeader: true,
        },
      },
      {
        path: 'examples',
        name: 'examples',
        component: () => import('@/views/examples/index.vue'),
        meta: {
          title: 'common.routes.examples',
          section: 'examples',
          keepAlive: true,
        },
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import('@/views/shop/index.vue'),
        meta: {
          title: 'common.routes.shop',
          section: 'shop',
          keepAlive: true,
          hideHeader: true,
        },
      },
      {
        path: 'shop/products/:id',
        name: 'product-detail',
        component: () => import('@/views/shop/detail.vue'),
        meta: {
          title: 'common.routes.productDetail',
          section: 'shop',
          hideHeader: true,
          hideAiEntry: true,
        },
      },
      {
        path: 'shop/cart',
        name: 'cart',
        component: () => import('@/views/shop/cart.vue'),
        meta: {
          title: 'common.routes.cart',
          section: 'shop',
          hideAiEntry: true,
        },
      },
      {
        path: 'shop/admin/products',
        name: 'product-admin',
        component: () => import('@/views/shop/admin.vue'),
        meta: {
          title: 'common.routes.productAdmin',
          section: 'shop',
          requiresAuth: true,
        },
      },
      {
        path: 'examples/query',
        name: 'query-example',
        component: () => import('@/views/examples/query.vue'),
        meta: { title: 'common.routes.query', section: 'examples' },
      },
      {
        path: 'examples/request',
        name: 'request-example',
        component: () => import('@/views/examples/request.vue'),
        meta: { title: 'common.routes.request', section: 'examples' },
      },
      {
        path: 'examples/workspace',
        name: 'workspace-example',
        component: () => import('@/views/examples/projects.vue'),
        meta: {
          title: 'common.routes.workspace',
          section: 'examples',
          requiresAuth: true,
        },
      },
      { path: 'examples/projects', redirect: { name: 'workspace-example' } },
      {
        path: 'examples/mobile',
        name: 'mobile-example',
        component: () => import('@/views/examples/mobile.vue'),
        meta: { title: 'common.routes.mobile', section: 'examples' },
      },
      {
        path: 'examples/icons',
        name: 'icons-example',
        component: () => import('@/views/examples/icons.vue'),
        meta: { title: 'common.routes.icons', section: 'examples' },
      },
      {
        path: 'ui-framework',
        name: 'ui-framework',
        component: () => import('@/views/ui/index.vue'),
        meta: { title: 'common.routes.ui', section: 'examples' },
      },
      {
        path: 'member',
        name: 'member',
        component: () => import('@/views/member/index.vue'),
        meta: { title: 'common.routes.member', section: 'member' },
      },
    ],
  },
  {
    path: '/ai/chat',
    name: 'ai-chat',
    component: () => import('@/views/ai/chat.vue'),
    meta: {
      title: 'common.routes.aiChat',
      section: 'ai',
      fullscreen: true,
      requiresAuth: !useMock,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'common.routes.login', guestOnly: true, fullscreen: true },
  },
  {
    path: '/offline',
    name: 'offline',
    component: () => import('@/views/system/offline.vue'),
    meta: { title: 'common.routes.offline', fullscreen: true },
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
];

export default routes;
