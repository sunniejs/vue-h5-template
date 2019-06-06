import Vue from 'vue'
import '@babel/polyfill'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/css/index.scss' // global css
// 移动端适配
import 'lib-flexible/flexible.js'
import App from './App'
import store from './store'
import router from './router'
import '@/filters' // filters
import '@/utils/directives' // directives
import '@/permission' // permission control
import wechatAuth from './plugins/wechatAuth' // 微信登录插件
Vue.use(wechatAuth, {
  appid: process.env.VUE_APP_WECHAT_APPID
})
import VCconsole from 'vconsole'
Vue.use(VCconsole)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
