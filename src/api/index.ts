import useAxiosApi from '/@/utils/useAxiosApi';

/**
 * 账号密码登录
 * @returns UseAxiosReturn
 */
export function loginPassword() {
  return useAxiosApi(`/api/login`, {
    method: 'POST',
    data: { name: '123' },
  });
}
