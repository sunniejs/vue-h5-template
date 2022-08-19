# proxy 跨域

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
