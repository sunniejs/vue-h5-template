const getters = {
  // user
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  loginStatus: state => state.user.loginStatus
}
export default getters
