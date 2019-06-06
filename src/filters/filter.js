/*
* 隐藏用户手机号中间四位
*/
export const hidePhone = phone => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}