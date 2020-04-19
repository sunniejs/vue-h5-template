<template>
  <div>
    <van-tabbar fixed v-model="active" @change="onChange">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="good-job-o">github</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import _ from 'lodash'
console.log(_.join(['a', 'b'], '~'))
export default {
  name: 'TabBar',
  data() {
    return {
      active: 0
    }
  },
  methods: {
    onChange(index) {
      if (index === 1) window.location.href = 'https://github.com/sunniejs/vue-h5-template'
    }
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
