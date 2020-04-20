<!-- home -->
<template>
  <div class="app-container">
    <div class="warpper">
      <h1 class="demo-home__title"><img src="https://imgs.solui.cn/weapp/logo.png" /><span>VUE H5开发模板</span></h1>
      <h2 class="demo-home__desc">
        A vue h5 template with Vant UI
      </h2>
      <div class="list">
        <div class="item">项目地址: <a href="https://github.com/sunniejs">https://github.com/sunniejs</a></div>
        <div class="item">项目作者: sunnie</div>
        <div class="item"></div>
        <div class="author"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 请求接口
import { getUserInfo } from '@/api/user.js'

export default {
  data() {
    return {

    }
  },

  computed: {},

  mounted() {

    this.initData()
  },

  methods: {
    // 请求数据案例
    initData() {
      // 请求接口数据，仅作为展示，需要配置src->config下环境文件
      const params = { user: 'sunnie' }
      getUserInfo(params)
        .then(() => { })
        .catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .warpper {
    padding: 12px;
    background: $background-color;
    .demo-home__title {
      margin: 0 0 6px;
      font-size: 32px;
      .demo-home__title img,
      .demo-home__title span {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        width: 32px;
      }
      span {
        margin-left: 16px;
        font-weight: 500;
      }
    }
    .demo-home__desc {
      margin: 0 0 20px;
      color: rgba(69, 90, 100, 0.6);
      font-size: 14px;
    }
    .list {
      display: flex;
      flex-direction: column;
      color: #666;
      font-size: 14px;
      .item {
        font-size: 14px;
        line-height: 24px;
      }
    }

    .author {
      margin:10px auto;
      width: 200px;
      height: 200px;
      background: url($cdn+'/weapp/me.png') center / contain no-repeat;
    }
  }
}
</style>
