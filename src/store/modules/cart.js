import { loadState } from '../storage.js'

const selectedLines = state => state.lines.filter(line => line.selected)
const count = lines => lines.reduce((total, line) => total + line.quantity, 0)
const findLine = (state, id) => state.lines.find(line => line.product.id === id)

export default {
  namespaced: true,
  state: () => {
    const stored = loadState('localStorage', 'h5.cart', [])
    const lines = Array.isArray(stored) ? stored.filter(line => line?.product && line.quantity > 0) : []
    return { lines }
  },
  getters: {
    itemCount: state => count(state.lines),
    selectedCount: state => count(selectedLines(state)),
    selectedTotal: state =>
      selectedLines(state).reduce((total, line) => total + line.product.priceCents * line.quantity, 0),
    allSelected: state => state.lines.length > 0 && state.lines.every(line => line.selected)
  },
  mutations: {
    add(state, { product, quantity }) {
      if (product.stock <= 0 || product.status !== 'on_sale') return
      const current = findLine(state, product.id)
      const newQuantity = Math.min(product.stock, (current?.quantity || 0) + Math.max(1, quantity))
      if (current) {
        current.product = product
        current.quantity = newQuantity
        current.selected = true
      } else {
        state.lines.push({ product, quantity: newQuantity, selected: true })
      }
    },
    setQuantity(state, { id, quantity }) {
      const line = findLine(state, id)
      if (line && Number.isFinite(quantity)) {
        line.quantity = Math.min(line.product.stock, Math.max(1, Math.trunc(quantity)))
      }
    },
    toggle(state, id) {
      const line = findLine(state, id)
      if (line) line.selected = !line.selected
    },
    toggleAll(state) {
      const selected = !state.lines.every(line => line.selected)
      state.lines.forEach(line => {
        line.selected = selected
      })
    },
    remove(state, id) {
      state.lines = state.lines.filter(line => line.product.id !== id)
    },
    clearSelected(state) {
      state.lines = state.lines.filter(line => !line.selected)
    }
  }
}
