const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const { createDevServer } = require('./build/dev-server')
const OfflineShellPlugin = require('./build/offline-shell')
const pwaEnabled = process.env.NODE_ENV === 'production' && process.env.VUE_APP_PWA_ENABLED === 'true'
const { title } = require('./src/config')
const queryVue = path.dirname(require.resolve('@tanstack/vue-query/package.json'))
const queryCore = path.dirname(require.resolve('@tanstack/query-core/package.json', { paths: [queryVue] }))

module.exports = defineConfig({
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  css: { loaderOptions: { scss: { api: 'modern' } } },
  devServer: createDevServer(process.env),
  transpileDependencies: ['@tanstack/query-core', '@tanstack/vue-query'],
  configureWebpack: { name: title },
  chainWebpack(config) {
    if (pwaEnabled) {
      config.plugin('offline-shell').use(OfflineShellPlugin)
      config.plugin('html').tap(([options]) => [{ ...options, pwaEnabled: true }])
    }
    config.plugins.delete('prefetch')
    config.plugins.delete('progress')
    config.resolve.alias
      // Use Query's downlevel bundle with Vue CLI 5's Babel preset.
      .set('@tanstack/query-core$', path.join(queryCore, 'build/legacy/index.js'))
      .set('@', path.resolve(__dirname, 'src'))
      .set('assets', path.resolve(__dirname, 'src/assets'))
      .set('api', path.resolve(__dirname, 'src/api'))
      .set('views', path.resolve(__dirname, 'src/views'))
      .set('components', path.resolve(__dirname, 'src/components'))
  }
})
