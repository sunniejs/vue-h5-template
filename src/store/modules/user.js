import { loginPassword } from '@/api/modules/auth';
import { defineStore } from 'pinia';
import { ApiError } from '@/types/api/common';
const pendingLogins = new WeakMap();
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    info: null,
  }),
  getters: {
    getUserInfo() {
      return this.info;
    },
  },
  actions: {
    setInfo(info) {
      this.info = info;
    },
    async login(params) {
      this.cancelLogin();
      const controller = new AbortController();
      pendingLogins.set(this, controller);
      try {
        const res = await loginPassword(params, controller.signal);
        if (controller.signal.aborted) throw new ApiError('Login cancelled', { kind: 'cancelled' });
        this.setInfo(res);
        if (res.token) this.token = res.token;
        return res;
      } finally {
        if (pendingLogins.get(this) === controller) pendingLogins.delete(this);
      }
    },
    cancelLogin() {
      pendingLogins.get(this)?.abort();
      pendingLogins.delete(this);
    },
    logout() {
      this.cancelLogin();
      this.$reset();
    },
  },
  persist: {
    pick: ['token'],
    storage: sessionStorage,
  },
});
