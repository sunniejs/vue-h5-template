/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
	{
    path: '/',
    name: 'index',
    component: () => import('@/views/home/index'), // 路由懒加载
    meta: {
      title: '首页', // 页面标题
      keepAlive: false // keep-alive 标识
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/home/about'),
    meta: {
      title: '关于我',
      keepAlive: false
    }
  }
]