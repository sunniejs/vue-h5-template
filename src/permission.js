import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'
import wechatAuth from './plugins/wechatAuth' // 微信登录插件
const qs = require('qs')

router.beforeEach((to, from, next) => {
  //  store.dispatch('user/fedLogOut').then(() => {
  // })
  const loginStatus = Number(store.getters.loginStatus)
  console.log('loginStatus=' + loginStatus)
  console.log('token=' + store.getters.token)
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
    // alert(loginUrl)
    wechatAuth.redirect_uri = loginUrl
    // 无论拒绝还是授权都设置成1
    store.dispatch('user/setLoginStatus', 1)
    window.location.href = wechatAuth.authUrl
  } else if (loginStatus === 1) {
    // 微信已经授权回调获取code
    try {
      wechatAuth.returnFromWechat(to.fullPath)
    } catch (err) {
      store.dispatch('user/setLoginStatus', 0)
      location.reload()
      //  next()
    }
    // 同意授权 to.fullPath 携带code参数，拒绝授权没有code参数
    // alert(to.fullPath)
    // 重新赋值，不然获取不到code
    const code = wechatAuth.code
    // alert(code)
    if (code) {
      store
        .dispatch('user/loginWechatAuth', code)
        .then(res => {
          store.dispatch('user/setLoginStatus', 2)
          next()
        })
        .catch(() => {
          store.dispatch('user/setLoginStatus', 0)
          location.reload()
        })
    } else {
      store.dispatch('user/setLoginStatus', 0)
      location.reload()
    }
  } else {
    // alert(to.fullPath)
    next()
  }
})
