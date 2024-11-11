<!--
 * @Author: Vinton
 * @Date: 2022-08-22 10:39:13
 * @Description: file content
-->
# Pinia 状态管理

下一代 vuex，使用极其方便，ts 兼容好

目录结构

```bash
├── store
│   ├── modules
│   │   └── user.js
│   ├── index.js
```
目前pinia分为两种编程模式，Options API 和 Composition API，我们这边都会列举出来实现的业务逻辑效果是一样的，提供大家思路

### Options API:

```javascript
interface StoreUser {
  token: string;
  info: Record<any, any>;
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
```

### Composition API:
```javascript
export const useUserStore = defineStore('app-user', () => {
  const Token = ref(token);
  const info = ref<Record<any, any>>({});
  const setInfo = (info: any) => {
    info.value = info ? info : '';
  };
  const getUserInfo = () => {
    return info || {};
  };
  const login = () => {
    return new Promise((resolve) => {
      const { data } = loginPassword();
      watch(data, () => {
        setInfo(data.value);
        // useCookies().set(VITE_TOKEN_KEY as string, data.value.token);
        resolve(data.value);
      });
    });
  };
  return {
    Token,
    info,
    setInfo,
    login,
    getUserInfo,
  };
})
```

使用

```html
<script lang="ts" setup>
  import { useUserStore } from "@/store/modules/user";
  const userStore = useUserStore();
  userStore.login();
</script>
```
