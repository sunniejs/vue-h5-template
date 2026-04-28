# Pinia 状态管理

下一代 vuex，使用极其方便，ts 兼容好。项目使用 `pinia-plugin-persistedstate` 实现状态持久化。

目录结构

```bash
├── store
│   ├── modules
│   │   └── user.ts
│   ├── index.ts
```

### Options API（当前项目使用）:

```typescript
import { loginPassword } from "@/api";
import { defineStore } from "pinia";

interface StoreUser {
  token: string;
  info: Record<any, any>;
}

export const useUserStore = defineStore("user", {
  state: (): StoreUser => ({
    token: "",
    info: {},
  }),
  getters: {
    getUserInfo(): any {
      return this.info || {};
    },
  },
  actions: {
    setInfo(info: any) {
      this.info = info ?? "";
    },
    async login() {
      try {
        const res = await loginPassword();
        this.setInfo(res);
        this.token = res.token;
        return res;
      } catch (error) {
        console.error("Login failed", error);
        throw error;
      }
    },
  },
  persist: {
    pick: ["token"],
    storage: localStorage,
  },
});
```

### Composition API:

```typescript
export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const info = ref<Record<any, any>>({});

    const getUserInfo = () => info.value || {};

    const setInfo = (data: any) => {
      info.value = data ?? "";
    };

    const login = async () => {
      try {
        const res = await loginPassword();
        setInfo(res);
        token.value = res.token;
        return res;
      } catch (error) {
        console.error("Login failed", error);
        throw error;
      }
    };

    return { token, info, getUserInfo, setInfo, login };
  },
  {
    persist: {
      pick: ["token"],
      storage: localStorage,
    },
  },
);
```

使用

```html
<script lang="ts" setup>
  import { useUserStore } from "@/store/modules/user";
  const userStore = useUserStore();
  userStore.login();
</script>
```
