import qs from 'qs'
// axios
import request from '@/utils/request'
//user api

// 登录
export function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify(params),
   // hideloading: true
  })
}
// 用户信息
export function getUserInfo(params) {
  return request({
    url: '/user/userinfo',
    method: 'get',
    data: qs.stringify(params)
  })
}
