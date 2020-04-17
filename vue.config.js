'use strict'
const path = require('path')
const defaultSettings = require('./src/config/index.js')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = defaultSettings.title || 'vue mobile template' // page title

const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  vant: 'vant',
  axios: 'axios'
}
// cdn
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: []
  },
  // 生产环境
  build: {
    css: ['https://cdn.jsdelivr.net/npm/vant@beta/lib/index.css'],
    js: [
      'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.6/vue-router.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1/vuex.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js',
      'https://cdn.jsdelivr.net/npm/vant@beta/lib/vant.min.js'
    ]
  }
}
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
module.exports = {
  publicPath: './', // 署应用包时的基本 URL。 vue-router hash 模式使用
  //  publicPath: '/app/', //署应用包时的基本 URL。  vue-router history模式使用
  outputDir: 'dist', //  生产环境构建文件的目录
  assetsDir: 'static', //  outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  devServer: {
    port: 9020, // 端口
    open: false, // 启动后打开浏览器
    overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true
    },
    // proxy: {
    //   //配置跨域
    //   '/api': {
    //       target: "https://test.xxx.com",
    //       // ws:true,
    //       changOrigin:true,
    //       pathRewrite:{
    //           '^/api':'/'
    //       }
    //   }
    // }
  },

  configureWebpack: config => {
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === 'production') {
      // externals里的模块不打包
      Object.assign(config, {
        name: name,
        externals: externals
      })
    }
    // 为开发环境修改配置...
    // if (process.env.NODE_ENV === 'development') {
    // }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    // alias
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))

    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          },
          libs: {
            name: 'chunk-libs',
            chunks: 'initial', // only package third parties that are initially dependent
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
