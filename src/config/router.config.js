/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/layouts/TabBarLayout'), // 路由懒加载
    redirect: '/home',
    meta: {
      title: '首页', // 页面标题
      keepAlive: false // keep-alive 标识
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
        meta: {
          title: '关于我',
          keepAlive: false
        }
      }
    ]
  }
]
