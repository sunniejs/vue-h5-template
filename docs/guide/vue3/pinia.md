# Pinia 状态管理

下一代 vuex，使用极其方便，ts 兼容好

目录结构

```bash
├── store
│   ├── modules
│   │   └── user.js
│   ├── index.js
```

使用

```html
<script lang="ts" setup>
  import { useUserStore } from "@/store/modules/user";
  const userStore = useUserStore();
  userStore.login();
</script>
```
