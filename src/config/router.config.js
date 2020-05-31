/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/layouts/AppLayout'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/',
        component: () => import('@/layouts/TabBarLayout'),
        redirect: '/home',
        meta: {
          title: '首页',
          keepAlive: false
        },
        children: [
          {
            path: '/home',
            name: 'Home',
            component: () => import('@/views/home/index'),
            meta: { title: '首页', keepAlive: false }
          },
          {
            path: '/about',
            name: 'About',
            component: () => import('@/views/home/about'),
            meta: { title: '关于我', keepAlive: false }
          }
        ]
      }
    ]
  }
]
