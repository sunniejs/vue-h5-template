# alias

项目在 `vite.config.mts` 中配置了路径别名，方便引用 `src` 和 `types` 目录下的文件：

```javascript
import { fileURLToPath, URL } from 'node:url';

resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./types', import.meta.url))
    },
},
```

使用示例：

```typescript
// 引用 src 下的文件
import { http } from '@/utils/request';

// 引用 types 下的类型
import type { UserInfo } from '#/index';
```
