# Vuex 状态管理

目录结构

```bash
├── store
│   ├── modules
│   │   └── app.js
│   ├── index.js
│   ├── getters.js
```

`main.js` 引入

```javascript
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
```

### Store 模块（modules/app.js）

```javascript
const state = {
  userName: "",
  token: "",
};
const mutations = {
  SET_USER_NAME(state, name) {
    state.userName = name;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
};
const actions = {
  setUserName({ commit }, name) {
    commit("SET_USER_NAME", name);
  },
  // 前端登出
  fedLogOut({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_USER_NAME", "");
      resolve();
    });
  },
};
```

### Getters

```javascript
const getters = {
  userName: (state) => state.app.userName,
  token: (state) => state.app.token,
};
```

### 使用

```html
<script>
  import { mapGetters } from "vuex";
  export default {
    computed: {
      ...mapGetters(["userName"]),
    },

    methods: {
      // Action 通过 store.dispatch 方法触发
      doDispatch() {
        this.$store.dispatch(
          "setUserName",
          "真乖，赶紧关注公众号，组织都在等你~",
        );
      },
    },
  };
</script>
```
