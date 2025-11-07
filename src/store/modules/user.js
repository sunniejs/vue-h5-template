import { loginPassword } from '@/api';
import { useCookies } from '@vueuse/integrations/useCookies';
import { defineStore } from 'pinia';

const { VITE_TOKEN_KEY } = import.meta.env;
const token = useCookies().get(VITE_TOKEN_KEY);
console.log(token);

export const useUserStore = defineStore('user', {
  state: () => ({
    token: 'token',
    info: {},
  }),
  getters: {
    getUserInfo() {
      return this.info || {};
    },
  },
  actions: {
    setInfo(info) {
      this.info = info ?? '';
    },
    async login() {
      try {
        const res = await loginPassword(); // 调用登录接口
        this.setInfo(res); // 设置用户信息
        this.token = res.token; // 假设返回的 res 包含 token
        return res;
      } catch (error) {
        console.error('Login failed', error);
        throw error;
      }
    },
  },
  persist: {
    pick: ['token'],
    storage: localStorage,
  },
});
