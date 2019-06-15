import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'
import wechatAuth from './plugins/wechatAuth' // 微信登录插件
const qs = require('qs')

router.beforeEach((to, from, next) => {
  const loginStatus = Number(store.getters.loginStatus)
  console.log('loginStatus=' + loginStatus)
  console.log('token=' + store.getters.token)
  // 页面标题
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
    // 设置微信授权回调地址
    wechatAuth.redirect_uri = loginUrl
    // 无论拒绝还是授权都设置成1
    store.dispatch('user/setLoginStatus', 1)
    // 跳转到微信授权页面
    window.location.href = wechatAuth.authUrl
  } else if (loginStatus === 1) {
    // 用户已授权，获取code
    try {
      // 通过回调链接设置code status
      wechatAuth.returnFromWechat(to.fullPath)
    } catch (err) {
      // 失败，设置状态未登录，刷新页面
      store.dispatch('user/setLoginStatus', 0)
      location.reload()
    }
    // 同意授权 to.fullPath 携带code参数，拒绝授权没有code参数
    const code = wechatAuth.code
    if (code) {
      // 拿到code 访问服务端的登录接口
      store
        .dispatch('user/loginWechatAuth', code)
        .then(res => {
          // 成功设置已登录状态
          store.dispatch('user/setLoginStatus', 2)
          next()
        })
        .catch(() => {
          // 失败，设置状态未登录，刷新页面
          store.dispatch('user/setLoginStatus', 0)
          location.reload()
        })
    } else {
      store.dispatch('user/setLoginStatus', 0)
      location.reload()
    }
  } else {
   // 已登录直接进入
    next()
  }
})
