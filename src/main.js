import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { configureApiClient } from '@/api/client'
import { configureStreamingClient } from '@/services/ai/fetchStreamProvider'
import { restoreLanguage } from '@/locales'
import { registerOfflineShell } from '@/plugins/offline'
import { setupVueQuery } from '@/plugins/query'
import SvgIcon from '@/components/common/SvgIcon.vue'
import { $cdn } from '@/config'
import '@/styles/index.scss'
import './filters'

Vue.config.productionTip = false
Vue.prototype.$cdn = $cdn
Vue.component('SvgIcon', SvgIcon)
setupVueQuery(Vue)
restoreLanguage()

const clientRuntime = {
  getAccessToken: () => store.getters.token || undefined,
  onUnauthorized: () => {
    store.dispatch('fedLogOut')
    if (router.currentRoute.name !== 'login') {
      const redirect = router.currentRoute.fullPath
      router.replace(
        { name: 'login', query: { redirect } },
        () => {},
        () => {}
      )
    }
  }
}
configureApiClient(clientRuntime)
configureStreamingClient(clientRuntime)

new Vue({ router, store, render: h => h(App) }).$mount('#app')

registerOfflineShell()
