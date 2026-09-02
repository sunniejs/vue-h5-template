import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '@/store/modules/user';

const { loginPassword } = vi.hoisted(() => ({ loginPassword: vi.fn() }));
vi.mock('@/api/modules/auth', () => ({ loginPassword }));

describe('user store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    loginPassword.mockReset();
  });

  it('stores typed login state and resets it on logout', async () => {
    loginPassword.mockResolvedValue({
      name: 'Ada',
      token: 'token',
      expiresIn: 3600,
    });
    const store = useUserStore();
    await store.login({ name: 'Ada', password: 'secret' });
    expect(store.token).toBe('token');
    expect(store.getUserInfo?.name).toBe('Ada');
    store.logout();
    expect(store.token).toBe('');
    expect(store.getUserInfo).toBeNull();
  });
});
