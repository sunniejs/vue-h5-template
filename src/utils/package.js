/*
 * @Author: sunnie.Song
 * @Date: 2019-05-27 10:01:46
 * @Description: 接口签名说明文档
 */

import { APPID, APPSECRET } from '../config/index'
import CryptoJS from 'crypto-js'
/**
 *对排序后的key值取值并生成
 */
function objKeySort(obj) {
  // 将obj中的所有key取出放入数组中,并按照ASCII排序 返回排序后的数组
  var newKey = Object.keys(obj).sort()

  var sortString = ''
  // 将obj转化为排序后的键值对使用'key=value&key=value'方式转为字符串
  for (var i = 0; i < newKey.length; i++) {
    sortString = sortString + newKey[i] + '=' + obj[newKey[i]] + '&'
  }
  // 返回字符串去除最有一个'&'
  return sortString.substring(0, sortString.length - 1)
}
/* 参数编码序列*/
function serializeParams(obj) {
  const arr = []
  // key的vaule为空的时候，删除该key
  const params = Object.assign({}, obj)
  for (const key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }
  Object.keys(params).forEach(key => {
    let value = params[key]
    // 如果值为undefined,置空
    if (typeof value === 'undefined') {
      value = ''
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    arr.push([key, encodeURIComponent(value)].join('='))
  })
  return arr.join('&')
}
function isChineseChar(str) {
  var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]|[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/

  return reg.test(str)
}
function encodeParams(obj) {
  // const arr = []
  // key的vaule为空的时候，删除该key
  const params = Object.assign({}, obj)
  // for (const key in params) {
  //   if (!params[key]) {
  //     delete params[key]
  //   }
  // }
  Object.keys(params).forEach(key => {
    let value = params[key]
    // 如果值为undefined,置空
    if (typeof value === 'undefined') {
      value = ''
    }
    // 如果有汉子
    if (isChineseChar(value)) {
      params[key] = encodeURIComponent(value)
    } else {
      params[key] = value
    }
  })
  return params
}
/**
 * 将参数打包
 * apiName: 接口名称
 * param: 参数obj 可选
 * isReturnStr: Boolean 可选  post是否返回string
 */

function baleParams(apiName, param, isReturnStr) {
  // 获取系统当前时间戳(精确到毫秒13位) //1511257250001
  var timestamp = new Date().valueOf()
  /**
   * appId ： 10010  系统账号 （参与签名）
   * appSecret ：10011 系统账号密码（参与签名）
   * apiName :接口名称（参与签名）
   * params : 接口参数json格式 （参与签名,没有则不参与）
   */

  const paramObj = {
    appId: APPID,
    appSecret: APPSECRET,
    apiName: apiName,
    timeStamp: timestamp
  }
  // 参数
  if (param !== undefined) {
    // 将参数转为json字符串
    const encode = encodeParams(param)
    paramObj.params = JSON.stringify(encode)
  }
  // 参数按ASCII排序,返回使用'=','&'拼接的字符串
  const sort = objKeySort(paramObj)
  // 将排序好的字符串使用MD5签名,并返回大写字符串
  // const sign = MD5.hexMD5(sort).toLocaleUpperCase()
  var sign = CryptoJS.MD5(sort)
    .toString(CryptoJS.enc.Hex)
    .toLocaleUpperCase()
  // 将appid, apiname, 时间戳 ,签名 重新作为参数传给服务器
  let parameters = {
    appId: paramObj.appId,
    timeStamp: timestamp,
    apiName: apiName,
    sign: sign,
    params: paramObj.params
  }
  // 是否序列表
  if (isReturnStr === true) {
    parameters = serializeParams(parameters)
  }
  return parameters
}
export default baleParams
