import qs from 'qs'
import request from '@/utils/request'

/**
 * 登录接口请求token与userinfo
 * @param params {code: code}
 */
export function loginByCode(params) {
  return request({
    url: '/wechat/auth2',
    method: 'post',
    data: qs.stringify(params)
  })
}
/**
 * 获取登录用户信息
 * @param params
 */
export function getUserInfo(params) {
  return request({
    url: '/user/get_user',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * 默认请求url import { api } from '@/config' 的 base_api + /wechat/auth2
 * 请求common_api打头的参照如下示例：
 * import { api } from '@/config'
 * export function loginByCode(params) {
 *  return request({
 *     url:api.common_api+ '/wechat/auth2',
 *     method: 'post',
 *     data: qs.stringify(params)
 *  })
 * }
 */
