const state = {
  userName: '',
  token: ''
}
const mutations = {
  SET_USER_NAME(state, name) {
    state.userName = name
  },
  SET_TOKEN(state, token) {
    state.token = token
  }
}
const actions = {
  // 设置name
  setUserName({ commit }, name) {
    commit('SET_USER_NAME', name)
  },
  // 前端登出
  fedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USER_NAME', '')
      resolve()
    })
  }
}
export default {
  state,
  mutations,
  actions
}
