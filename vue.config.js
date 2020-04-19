'use strict'
const path = require('path')
const defaultSettings = require('./src/config/index.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const resolve = dir => path.join(__dirname, dir)
// page title
const name = defaultSettings.title || 'vue mobile template'
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

// externals
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  vant: 'vant',
  axios: 'axios'
}
// CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    css: [
    ],
    js: []
  },
  // 生产环境
  build: {
    css: ['https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.css'],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.min.js'
    ]
  }
}
// const cdn = {
//   css: ['https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.css'],
//   js: [
//     'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js',
//     'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.5/vue-router.min.js',
//     'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js',
//     'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.2/vuex.min.js',
//     'https://cdn.jsdelivr.net/npm/vant@2.4.7/lib/index.min.js',
//     'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js',

//   ]
// }

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
    }
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
    config.name = name
    // 为生产环境修改配置...
    if (IS_PROD) {
      // externals
      config.externals = externals
    }
    // 为开发环境修改配置...
    // if (process.env.NODE_ENV === 'development') {
    // }
  },

  chainWebpack: config => {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // 别名 alias
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))
    //  打包分析
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中
     */
    config.plugin('html').tap(args => {
      if (IS_PROD) {
        args[0].cdn = cdn.build
      } else {
        args[0].cdn = cdn.dev
      }

      return args
     })
    // set preserveWhitespace
    // config.module
    //   .rule('vue')
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .tap(options => {
    //     options.compilerOptions.preserveWhitespace = true
    //     return options
    //   })
    //   .end()

    // config
    //   // https://webpack.js.org/configuration/devtool/#development
    //   .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))

    // config.when(IS_PROD, config => {
    //   config
    //     .plugin('ScriptExtHtmlWebpackPlugin')
    //     .after('html')
    //     .use('script-ext-html-webpack-plugin', [
    //       {
    //         // `runtime` must same as runtimeChunk name. default is `runtime`
    //         inline: /runtime\..*\.js$/
    //       }
    //     ])
    //     .end()
    //   config.optimization.splitChunks({
    //     chunks: 'all',
    //     cacheGroups: {
    //       // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
    //       commons: {
    //         name: 'chunk-commons',
    //         test: resolve('src/components'),
    //         minChunks: 3, //  被至少用三次以上打包分离
    //         priority: 5, // 优先级
    //         reuseExistingChunk: true // 复用其他chunk内已拥有的模块
    //       },
    //       // vantUI: {
    //       //   name: 'chunk-vantUI', // 将 vant 打包到单独文件
    //       //   priority: 20,
    //       //   test: /[\\/]node_modules[\\/]_?vant(.*)/ // in order to adapt to cnpm
    //       // },
    //       libs: {
    //         name: 'chunk-libs',
    //         chunks: 'initial', // only package third parties that are initially dependent
    //         test: /[\\/]node_modules[\\/]/,
    //         priority: 10
    //       }
    //     }
    //   })
    //   config.optimization.runtimeChunk('single')
    // })
  }
}
