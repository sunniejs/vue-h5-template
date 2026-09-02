import { watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { Router } from 'vue-router';
import routes from './routes';
import { i18n } from '@/locales';
import store from '@/store';
import { useUserStore } from '@/store/modules/user';

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

function updateDocumentTitle(titleKey?: unknown) {
  const title = titleKey
    ? String(i18n.global.t(String(titleKey)))
    : String(i18n.global.t('common.title'));
  document.title = `${title} · Vue H5`;
}

router.beforeEach((to) => {
  const userStore = useUserStore(store);
  if (to.meta.requiresAuth && !userStore.token)
    return { name: 'login', query: { redirect: to.fullPath } };
  if (to.meta.guestOnly && userStore.token) return { name: 'member' };

  updateDocumentTitle(to.meta.title);
  return true;
});

watch(i18n.global.locale, () =>
  updateDocumentTitle(router.currentRoute.value.meta.title),
);

export default router;
