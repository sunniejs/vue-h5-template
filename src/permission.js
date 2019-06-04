import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'
import wechatAuth from './plugins/wechatAuth' // 微信登录插件
const qs = require('qs')
router.beforeEach((to, from, next) => {
  // next()
  console.log(store.getters.loginStatus)
  const loginStatus = Number(store.getters.loginStatus)
  // console.log(loginStatus === 1)
  document.title = getPageTitle(to.meta.title)
  if (loginStatus === 0) {
    // 微信未授权登录跳转到授权登录页面
    const url = window.location.href
    // 解决重复登录url添加重复的code与state问题
    const parseUrl = qs.parse(url.split('?')[1])
    let loginUrl
    if (parseUrl.code && parseUrl.state) {
      delete parseUrl.code
      delete parseUrl.state
      loginUrl = `${url.split('?')[0]}?${qs.stringify(parseUrl)}`
    } else {
      loginUrl = url
    }
    wechatAuth.redirect_uri = loginUrl
    store.dispatch('user/setLoginStatus', 1)
    window.location.href = wechatAuth.authUrl
  } else if (loginStatus === 1) {
    // 微信已经授权回调获取code
    try {
      wechatAuth.returnFromWechat(to.fullPath)
    } catch (err) {
      store.dispatch('user/setLoginStatus', 0)
      next()
    }
    // 重新赋值，不然获取不到code
    const code = wechatAuth.code
    store
      .dispatch('user/loginWechatAuth', code)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          store.dispatch('user/setLoginStatus', 2)
        } else {
          store.dispatch('user/setLoginStatus', 0)
        }
        next()
      })
      .catch(() => {
        store.dispatch('user/setLoginStatus', 0)
        next()
      })
  } else {
    //
    next()
  }
})
