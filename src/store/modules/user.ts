import { AnyObject } from '/#/global';
import { loginPassword } from '/@/api';
import { useCookies } from '@vueuse/integrations/useCookies';
import { defineStore } from 'pinia';
import { watch } from 'vue';

const { VITE_TOKEN_KEY } = import.meta.env;
const token = useCookies().get(VITE_TOKEN_KEY as string);

interface StoreUser {
  token: string;
  info: AnyObject;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): StoreUser => ({
    token: token,
    info: {},
  }),
  getters: {
    getUserInfo(): any {
      return this.info || {};
    },
  },
  actions: {
    setInfo(info: any) {
      this.info = info ? info : '';
    },
    login() {
      return new Promise((resolve) => {
        const { data } = loginPassword();
        watch(data, () => {
          this.setInfo(data.value);
          // useCookies().set(VITE_TOKEN_KEY as string, data.value.token);
          resolve(data.value);
        });
      });
    },
  },
});
