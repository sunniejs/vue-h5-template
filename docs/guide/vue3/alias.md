# alias

```javascript
import { fileURLToPath, URL } from 'node:url';

resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./types', import.meta.url))
    },
},
```
