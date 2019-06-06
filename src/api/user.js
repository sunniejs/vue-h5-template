import qs from 'qs'
import request from '@/utils/request'
import { api } from '@/config'
// 签名
import _bale from '@/utils/package'
// api
// 登录
export function login(params) {
  return request({
    url:  '/wechat/login.do',
    method: 'post',
    data: qs.stringify(_bale('login', params))
  })
}
/**
 * 登录接口请求token与userinfo
 * @param params
 */
export function loginByCode(params) {
  return request({
    url:   '/wechat/auth2',
    method: 'post',
    data: qs.stringify(_bale('auth2', params))
  })
}
/**
 * 获取登录用户信息
 * @param params
 */
export function getUserInfo(params) {
  return request({
    url:  '/user/get_user',
    method: 'post',
    data: qs.stringify(_bale('get_user', params))
  })
}

/**
 * 公众号会员中心
 * @param params
 */
export function getAccountInfo(params) {
  return request({
    url:   '/wechat/selectVipUserInfo',
    method: 'post',
    data: qs.stringify(_bale('selectVipUserInfo', params))
  })
}

/**
 * 发送手机验证码
 * @param params
 */
export function sendCode(params) {
  return request({
    url:  '/wechat/send_phone_code',
    method: 'post',
    data: qs.stringify(_bale('send_phone_code', params))
  })
}

/**
 * 微信公众号添加手机号
 * @param params
 */
export function bindPhoneNumber(params) {
  return request({
    url:  '/wechat/addPhoneNumber',
    method: 'post',
    data: qs.stringify(_bale('addPhoneNumber', params))
  })
}
