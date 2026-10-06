export function loadState(storage, key, fallback) {
  try {
    return JSON.parse(window[storage].getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function saveState(storage, key, value) {
  try {
    window[storage].setItem(key, JSON.stringify(value))
  } catch {
    // Vuex remains usable when browser storage is unavailable.
  }
}

export function persistClientState(store) {
  store.subscribe(({ type }, state) => {
    if (type.startsWith('cart/')) saveState('localStorage', 'h5.cart', state.cart.lines)
    if (type === 'SET_USER' || type === 'SET_TOKEN') {
      saveState('sessionStorage', 'h5.session', state.app.token)
    }
  })
}
