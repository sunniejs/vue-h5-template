import { loginPassword } from '@/api/modules/auth'
import { ApiError } from '@/types/api/common'

let pendingLogin

export function cancelLogin() {
  pendingLogin?.abort()
  pendingLogin = undefined
}

export async function login({ commit }, params) {
  cancelLogin()
  const controller = new AbortController()
  pendingLogin = controller
  try {
    const user = await loginPassword(params, controller.signal)
    if (controller.signal.aborted) throw new ApiError('Login cancelled', { kind: 'cancelled' })
    commit('SET_USER', user)
    return user
  } finally {
    if (pendingLogin === controller) pendingLogin = undefined
  }
}
