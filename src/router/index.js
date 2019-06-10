import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export const constantRoutes = [
  {
    path: '/',
    redirect: '/account'
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/account/index'),
    meta: {
      title: '个人中心',
      keepAlive: false
    }
  },
  
  {
    path: '/coupon',
    name: 'coupon',
    component: () => import('@/views/account/coupon'),
    meta: {
      title: '优惠券',
      keepAlive: false
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index'),
    meta: {
      keepAlive: false
    }
  }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    base: '/antpublic',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

export default createRouter()
