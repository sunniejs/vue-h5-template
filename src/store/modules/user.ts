import { loginPassword } from '@/api';
import { defineStore } from 'pinia';

interface StoreUser {
  token: string;
  info: Record<any, any>;
}

export const useUserStore = defineStore('user', {
  state: (): StoreUser => ({
    token: '',
    info: {},
  }),
  getters: {
    getUserInfo(): any {
      return this.info || {};
    },
  },
  actions: {
    setInfo(info: any) {
      this.info = info ?? '';
    },
    async login() {
      const res = await loginPassword();
      this.setInfo(res);
      if (res?.token) {
        this.token = res.token;
      }
      return res;
    },
  },
  persist: {
    pick: ['token'],
    storage: localStorage,
  },
});
