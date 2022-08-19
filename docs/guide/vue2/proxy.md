### <span id="proxy">✅ 配置 proxy 跨域 </span>

如果你的项目需要跨域设置，你需要打来 `vue.config.js` `proxy` 注释 并且配置相应参数

<u>**!!!注意：你还需要将 `src/config/env.development.js` 里的 `baseApi` 设置成 '/'**</u>

```javascript
module.exports = {
    devServer: {
        // ....
        proxy: {
            //配置跨域
            '/api': {
                target: 'https://test.xxx.com', // 接口的域名
                // ws: true, // 是否启用websockets
                changOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                pathRewrite: {
                    '^/api': '/',
                },
            },
        },
    },
}
```

使用 例如: `src/api/home.js`

```javascript
export function getUserInfo(params) {
    return request({
        url: '/api/userinfo',
        method: 'post',
        data: qs.stringify(params),
    })
}
```
