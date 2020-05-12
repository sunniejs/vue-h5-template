
const list = [
  'Vue-cli4',
  '配置多环境变量',
  'VantUI 组件按需加载',
  'Sass 全局样式',
  'Webpack 4',
  'Vuex 状态管理',
  'Axios 封装及接口管理',
  'Vue-router',
  'Webpack 4 vue.config.js 基础配置',
  '配置 proxy 跨域',
  '配置 alias 别名',
  '配置 打包分析',
  '配置 externals 引入 cdn 资源',
  '去掉 console.log',
  'splitChunks 单独打包第三方模块',
  ' 添加 IE 兼容'
]

exports.default = [

  // mock get all home form server
  {
    url: '/home/tagList',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: list
      }
    }
  }
]
