<template>
  <div>
    <van-tabbar fixed route>
      <van-tabbar-item to="/" icon="home-o">
        首页
      </van-tabbar-item>
      <van-tabbar-item to="/about" icon="user-o">
        关于我
      </van-tabbar-item>
      </van-tabbar>
   <!--  <van-tabbar fixed v-model="active" @change="onChange">
      <van-tabbar-item  to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item  to="/about" icon="user-o">关于我</van-tabbar-item>
    </van-tabbar> -->
  </div>
</template>

<script>

export default {
  name: 'TabBar',
  data() {
    return {
      active: 0
    }
  },
  methods: {
  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
