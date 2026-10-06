import store from './index'
import { cancelLogin } from './modules/session'

const userStore = {
  get token() {
    return store.getters.token
  },
  get getUserInfo() {
    return store.state.app.info
  },
  login: params => store.dispatch('login', params),
  cancelLogin,
  logout: () => store.dispatch('fedLogOut')
}

export function useUserStore() {
  return userStore
}

const cartStore = {
  get lines() {
    return store.state.cart.lines
  },
  get itemCount() {
    return store.getters['cart/itemCount']
  },
  get selectedCount() {
    return store.getters['cart/selectedCount']
  },
  get selectedTotal() {
    return store.getters['cart/selectedTotal']
  },
  get allSelected() {
    return store.getters['cart/allSelected']
  },
  add: (product, quantity = 1) => store.commit('cart/add', { product, quantity }),
  setQuantity: (id, quantity) => store.commit('cart/setQuantity', { id, quantity }),
  toggle: id => store.commit('cart/toggle', id),
  toggleAll: () => store.commit('cart/toggleAll'),
  remove: id => store.commit('cart/remove', id),
  clearSelected: () => store.commit('cart/clearSelected')
}

export function useCartStore() {
  return cartStore
}
