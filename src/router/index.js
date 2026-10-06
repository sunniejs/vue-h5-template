import Vue, { watch } from 'vue'
import Router from 'vue-router'
import { locale, t } from '@/locales'
import store from '@/store'
import routes from './routes'

Vue.use(Router)

const createRouter = () => new Router({ routes, scrollBehavior: () => ({ x: 0, y: 0 }) })
const router = createRouter()

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && store.getters.token) {
    next({ name: 'member' })
  } else {
    next()
  }
})

function updateDocumentTitle() {
  document.title = `${t(router.currentRoute.meta.title || 'common.title')} · Vue H5`
}

router.afterEach(updateDocumentTitle)
watch(locale, updateDocumentTitle)

export function resetRouter() {
  router.matcher = createRouter().matcher
}

export default router
