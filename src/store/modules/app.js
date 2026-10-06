import { cancelLogin, login } from './session'
import { loadState } from '../storage'

export default {
  state: () => ({
    userName: '',
    info: null,
    token: loadState('sessionStorage', 'h5.session', '')
  }),
  mutations: {
    SET_USER_NAME(state, name) {
      state.userName = name
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER(state, info) {
      state.userName = info?.name || ''
      state.info = info
      state.token = info?.token || ''
    }
  },
  actions: {
    setUserName({ commit }, name) {
      commit('SET_USER_NAME', name)
    },
    login,
    fedLogOut({ commit }) {
      cancelLogin()
      commit('SET_USER', null)
    }
  }
}
