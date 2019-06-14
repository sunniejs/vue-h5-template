import cookies from 'js-cookie'
import storage from 'good-storage'

const LoginStatusKey = 'Login-Status' // 登录态 0未授权未登录 1授权未登录 2 登陆成功
const TokenKey = 'Access-Token' // token
const UserInfoKey = 'User-Info' // 用户信息 {} {...}

export function loadLoginStatus() {
  return cookies.get(LoginStatusKey) || 0
}

// export function saveLoginStatus(status) {
//   cookies.set(LoginStatusKey, status, { expires: 7 })
//   return status
// }

 
export function saveLoginStatus(status) {
  //storage.set(LoginStatusKey, status)
    var date=new Date();
    date.setTime(date.getTime()+5*60*1000); //设置date为当前时间+5分
    document.cookie=LoginStatusKey+"="+status+"; expires="+date.toGMTString(); //将date赋值给expires
  return status
}

export function removeLoginStatus() {
  cookies.remove(LoginStatusKey)
  return ''
}

export function loadToken() {
  return storage.get(TokenKey, '')
}

export function saveToken(token) {
  storage.set(TokenKey, token)
  return token
}

export function removeToken() {
  storage.remove(TokenKey)
  return ''
}

export function loadUserInfo() {
  return storage.get(UserInfoKey, {})
}

export function saveUserInfo(userInfo) {
  storage.set(UserInfoKey, userInfo)
  return userInfo
}

export function removeUserInfo() {
  storage.remove(UserInfoKey)
  return {}
}
