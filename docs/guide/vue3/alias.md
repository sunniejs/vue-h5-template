# alias

```javascript
resolve: {
    alias: [{
            find: 'vue-i18n',
            replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
            find: /\/@\//,
            replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
            find: /\/#\//,
            replacement: pathResolve('types') + '/',
        },
    ],
},
```
