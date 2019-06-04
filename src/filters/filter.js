// 转为unicode 编码
exports.encodeUnicode = str => {
  var res = []
  for (var i = 0; i < str.length; i++) {
    res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4)
  }
  return '\\u' + res.join('\\u')
}

// 解码
exports.decodeUnicode = str => {
  if (str === undefined || '') {
    return
  }
  str = str.replace(/\\/g, '%')
  return unescape(str)
}
/*
 * 格式化金钱
 */
exports.formatMoney = value => {
  return Number(value).toFixed(2)
}
exports.formatCentMoney = value => {
  if (value === undefined || '') {
    return
  }
  return Number(value / 100).toFixed(2)
}
// 昵称解码
exports.formatName = nickname => {
  if (!nickname) return ''
  return decodeURIComponent(nickname)
}
