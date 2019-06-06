/**
 *格式化时间
 *yyyy-MM-dd hh:mm:ss
 */
export function formatDate(time, fmt) {
  if (time === undefined || '') {
    return
  }
  const date = new Date(time)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
// 转为unicode 编码
export function encodeUnicode(str) {
  var res = []
  for (var i = 0; i < str.length; i++) {
    res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4)
  }
  return '\\u' + res.join('\\u')
}

// 解码
export function decodeUnicode(str) {
  if (str === undefined || '') {
    return
  }
  str = str.replace(/\\/g, '%')
  return unescape(str)
}
/*
 * 格式化金钱
 */
export function formatMoney(value) {
  return Number(value).toFixed(2)
}
export function formatCentMoney(value) {
  if (value === undefined || '') {
    return
  }
  return Number(value / 100).toFixed(2)
}
// 昵称解码
export function formatName(nickname) {
  if (!nickname) return ''
  return decodeURIComponent(nickname)
}
// 折扣转换
export function formatPercent(percent_off) {
  if (!percent_off) return ''
  if (percent_off == 1) {
    return '原价'
  }
  // 解决精度丢失问题
  return Math.round(percent_off * 100) / 10
}
