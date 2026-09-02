import { createApp } from 'vue';
import App from './App.vue';
import { setupI18n } from '@/locales';
import router from '@/router';
import store from '@/store';
import { useUserStore } from '@/store/modules/user';
import { configureApiClient } from '@/api/client';
import { configureStreamingClient } from '@/services/ai/fetchStreamProvider';
import { setupVueQuery } from '@/plugins/query';
import 'virtual:svg-icons-register';
import '@/styles/index.scss';

async function bootstrap() {
  const app = createApp(App);

  app.use(store);
  const userStore = useUserStore(store);

  const clientRuntime = {
    getAccessToken: () => userStore.token || undefined,
    onUnauthorized: () => {
      userStore.logout();
      if (router.currentRoute.value.name !== 'login') {
        return router.replace({
          name: 'login',
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
    },
  };
  configureApiClient(clientRuntime);
  configureStreamingClient(clientRuntime);

  setupVueQuery(app);
  await setupI18n(app);
  app.use(router);
  app.mount('#app');
}

void bootstrap();
