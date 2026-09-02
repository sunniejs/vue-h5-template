import { loginPassword } from '@/api/modules/auth';
import type { LoginParams, LoginResult } from '@/api/modules/auth';
import { defineStore } from 'pinia';

interface UserState {
  token: string;
  info: LoginResult | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    info: null,
  }),
  getters: {
    getUserInfo(): LoginResult | null {
      return this.info;
    },
  },
  actions: {
    setInfo(info: LoginResult) {
      this.info = info;
    },
    async login(params: LoginParams): Promise<LoginResult> {
      const res = await loginPassword(params);
      this.setInfo(res);
      if (res.token) {
        this.token = res.token;
      }
      return res;
    },
    logout() {
      this.$reset();
    },
  },
  persist: {
    pick: ['token'],
    storage: sessionStorage,
  },
});
