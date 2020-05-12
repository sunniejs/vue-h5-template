import qs from 'qs'
// axios
import request from '@/utils/request'
//home api

// tag list
export function getTagList() {
  return request({
    url: '/dev-api/home/tagList',
    method: 'get',
    hideloading: true
  })
}
