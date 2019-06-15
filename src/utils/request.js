import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
import { api } from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: api.base_api, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    if (store.getters.token) {
      config.headers['token'] = store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    // 这里注意修改成你访问的服务端接口规则
    if (res.status && res.status !== 200) {
      Toast({
        message: res.info
      })
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch('user/fedLogOut').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
