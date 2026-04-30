<template>
  <div class="index-container">
    <div class="warpper">
      <h1 class="demo-home__title">
        <img src="https://cdn.jsdelivr.net/gh/fonghehe/picture/vue-h5-template/logo.png" /><span> VUE H5开发模板</span>
      </h1>
      <h2 class="demo-home__desc">A vue h5 template with Vant UI</h2>
    </div>
    <van-cell icon="success" v-for="item in list" :key="item" :title="item" />
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      list: [
        'Vue 2.7 + Vue CLI 5',
        '配置多环境变量',
        'VantUI 组件按需加载',
        'Sass 全局样式',
        'Vuex 状态管理',
        'Axios 封装及接口管理',
        'Vue-router',
        'vue.config.js 基础配置',
        '配置 proxy 跨域',
        '配置 alias 别名',
        '配置 打包分析',
        'postcss-px-to-viewport 适配',
        'splitChunks 单独打包第三方模块',
        'ESLint + Prettier 统一开发规范'
      ]
    }
  }
}
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
