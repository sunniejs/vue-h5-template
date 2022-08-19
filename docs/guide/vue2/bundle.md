### <span id="bundle">✅ 配置 打包分析 </span>

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    chainWebpack: config => {
        // 打包分析
        if (IS_PROD) {
            config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: 'static',
                },
            ])
        }
    },
}
```

```bash
npm run build
```
