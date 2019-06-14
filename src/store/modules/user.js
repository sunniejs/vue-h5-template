import { login } from '@/api/user'
import { loginByCode } from '@/api/user'
import {
  saveToken,
  saveLoginStatus,
  saveUserInfo,
  removeToken,
  removeUserInfo,
  removeLoginStatus,
  loadLoginStatus,
  loadToken,
  loadUserInfo
} from '@/utils/cache'
const state = {
  loginStatus: loadLoginStatus(), // 登录状态
  token: loadToken(), // token
  userInfo: loadUserInfo() // 用户登录信息
}

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_LOGIN_STATUS: (state, loginStatus) => {
    state.loginStatus = loginStatus
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  loginUrl({ commit }, path) {
    //    const url = baseUrl + path
    return new Promise((resolve, reject) => {
      login({ redirectUri: path })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 登录相关
  loginWechatAuth({ commit, state }, code) {
    const data = {
      code: code
    }
    return new Promise((resolve, reject) => {
      loginByCode(data)
        .then(res => {
          console.log(res)
          commit('SET_USERINFO', saveUserInfo(res.data.user))
          commit('SET_TOKEN', saveToken(res.data.token))
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 设置状态
  setLoginStatus({ commit, state }, query) {
    if (query === 0 || query === 1) {
      // 上线打开注释，本地调试注释掉
      removeToken()
      removeUserInfo()
    }
    commit('SET_LOGIN_STATUS', saveLoginStatus(query))
  },
  // 保存用户个人信息
  setUserInfo({ commit, state }, query) {
    commit('SET_USERINFO', saveUserInfo(query))
  },
  // 登出
  fedLogOut({ commit, state }, query) {
    removeToken()
    removeUserInfo()
    removeLoginStatus()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
