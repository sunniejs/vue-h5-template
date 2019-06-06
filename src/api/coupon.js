import qs from 'qs'
import request from '@/utils/request'
import { api } from '@/config'
// 签名
import _bale from '@/utils/package'
// api

// 查询我的优惠券
export function getCouponList(params) {
  return request({
    url: '/coupon/selectMyCoupon',
    method: 'post',
    data: qs.stringify(_bale('selectMyCoupon', params))
  })
}
