# proxy 跨域

在 `vite.config.mts` 的 `server.proxy` 中配置代理，解决开发环境跨域问题：

```javascript
server: {
    proxy: {
        '/api': {
            target: 'https://baidu.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
        }
    }
},
```

项目同时在 `build/vite/proxy.ts` 中提供了基于环境变量的代理配置封装，可根据 `.env.*` 中的 `VITE_URL_PREFIX` 自动生成代理规则。
