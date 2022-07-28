<template>
  <div class="index-container">
    <div class="warpper">
      <h1 class="demo-home__title">
        <img src="https://www.sunniejs.cn/static/weapp/logo.png" /><span> VUE H5开发模板</span>
      </h1>
      <h2 class="demo-home__desc">A vue h5 template with Vant UI</h2>
    </div>
    <van-cell icon="success" v-for="item in list" :key="item" :title="item" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

let list = ref([
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
  '添加 IE 兼容',
  'Eslint+Pettier 统一开发规范'
])
</script>

<style lang="scss" scoped>
.index-container {
  .warpper {
    padding: 24px;
    background: #fff;
    .demo-home__title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 6px;
      font-size: 56px;
      .demo-home__title img,
      .demo-home__title span {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        width: 64px;
      }
      span {
        margin-left: 16px;
        font-weight: 500;
      }
    }
    .demo-home__desc {
      text-align: center;
      margin: 0 0 20px;
      color: rgba(69, 90, 100, 0.6);
      font-size: 28px;
    }
  }
}
</style>
