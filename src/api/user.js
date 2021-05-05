import homeApi from './home'
// axios
import request from '@/utils/request'

// 用户提交图片 & 手机号
export function registerForWalkingFestival(data) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: homeApi.registerForWalkingFestival,
    method: 'post',
    data
    // hideloading: true
  })
}
