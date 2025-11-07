import { http } from '@/utils/request';

/**
 * 账号密码登录
 * @returns UseAxiosReturn
 */
export function loginPassword() {
  return http.post(`/mock-api/login`, {
    data: { name: '123' },
  });
}
