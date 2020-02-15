import qs from 'qs'
import request from '@/utils/request'
// api

// 登录
export function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify(params)
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
