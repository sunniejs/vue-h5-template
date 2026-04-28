import { createFetch } from '@vueuse/core';
import { useCookies } from '@vueuse/integrations/useCookies';
import { showNotify } from 'vant';

const useFetchApi = createFetch({
  baseUrl: '',
  options: {
    async beforeFetch({ options }) {
      const myToken = useCookies().get((import.meta.env.VITE_TOKEN_KEY as string) || 'Authorization') || '';
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${myToken}`,
      };
      return { options };
    },
    afterFetch(ctx) {
      const { data, response } = ctx;
      if (response.status >= 200 && response.status < 300) {
        try {
          const jsonObj = data;
          if (jsonObj.code !== 200) {
            showNotify({ type: 'danger', message: jsonObj.message || 'Error' });
          }

          ctx.data = jsonObj.data;
        } catch (error) {
          console.error(error);
          ctx.data = null;
        }
      } else {
        showNotify({ type: 'danger', message: response.statusText || 'Error' });
        ctx.data = null;
      }

      return ctx;
    },
  },
});

export default useFetchApi;
