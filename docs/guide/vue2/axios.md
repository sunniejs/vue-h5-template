# Axios 封装及接口管理

`utils/request.js` 封装 axios ，开发者需要根据后台接口做修改。

- `service.interceptors.request.use` 里可以设置请求头，比如设置 `token`
- `config.hideloading` 是在 api 文件夹下的接口参数里设置，下文会讲
- `service.interceptors.response.use` 里可以对接口返回数据处理，比如 401 删除本地信息，重新登录

```javascript
import axios from "axios";
import store from "@/store";
import { Toast } from "vant";
// 根据环境不同引入不同api地址
import { baseApi } from "@/config";
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request 拦截器 request interceptor
service.interceptors.request.use(
  (config) => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true,
      });
    }
    if (store.getters.token) {
      config.headers["X-Token"] = "";
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
// respone拦截器
service.interceptors.response.use(
  (response) => {
    Toast.clear();
    const res = response.data;
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch("FedLogOut").then(() => {
          location.reload();
        });
      }
      return Promise.reject(res || "error");
    } else {
      return Promise.resolve(res);
    }
  },
  (error) => {
    Toast.clear();
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);
export default service;
```

#### 接口管理

在`src/api` 文件夹下统一管理接口

- 你可以建立多个模块对接接口, 比如 `home.js` 里是首页的接口这里讲解 `user.js`
- `url` 接口地址，请求的时候会拼接上 `config` 下的 `baseApi`
- `method` 请求方法
- `data` 请求参数 `qs.stringify(params)` 是对数据系列化操作
- `hideloading` 默认 `false`，设置为 `true` 后，不显示 loading ui 交互中有些接口不需要让用户感知

```javascript
import qs from "qs";
// axios
import request from "@/utils/request";
//user api

// 用户信息
export function getUserInfo(params) {
  return request({
    url: "/user/userinfo",
    method: "post",
    data: qs.stringify(params),
    hideloading: true, // 隐藏 loading 组件
  });
}
```

#### 如何调用

```javascript
// 请求接口
import { getUserInfo } from "@/api/user.js";

const params = { user: "sunnie" };
getUserInfo(params)
  .then(() => {})
  .catch(() => {});
```
