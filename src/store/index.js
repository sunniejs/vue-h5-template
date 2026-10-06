import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import cart from './modules/cart'
import { persistClientState } from './storage'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { app, cart },
  getters,
  plugins: [persistClientState]
})
