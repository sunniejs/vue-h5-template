import qs from 'qs'
// axios
import request from '@/utils/request'
//user api

// 登录
export function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify(params)
  })
}
// 用户信息 post 方法
export function getUserInfo(params) {
  return request({
    url: '/user/userinfo',
    method: 'post',
    data: qs.stringify(params),
    hideloading: true
  })
}

// 用户名称 get 方法
export function getUserName(params) {
  return request({
    url: '/user/name?' + qs.stringify(params),
    method: 'get',
    hideloading: true
  })
}
