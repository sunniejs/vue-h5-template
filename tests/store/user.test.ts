import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import type { LoginResult } from '@/api/modules/auth';

const { loginPassword } = vi.hoisted(() => ({ loginPassword: vi.fn() }));
vi.mock('@/api/modules/auth', () => ({ loginPassword }));

describe('user store', () => {
  it.each(['logout', 'new login'])(
    'ignores a late login response after %s',
    async (action) => {
      let resolveOld: ((value: LoginResult) => void) | undefined;
      let oldSignal: AbortSignal | undefined;
      loginPassword.mockImplementationOnce((_params, signal: AbortSignal) => {
        oldSignal = signal;
        return new Promise<LoginResult>((resolve) => {
          resolveOld = resolve;
        });
      });
      const store = useUserStore();
      const pending = store.login({ name: 'Ada', password: 'secret' });
      const outcome = pending.catch((error: unknown) => error);
      if (action === 'logout') store.logout();
      else {
        loginPassword.mockResolvedValueOnce({
          name: 'Lin',
          token: 'token-b',
          expiresIn: 3600,
        });
        await store.login({ name: 'Lin', password: 'secret' });
      }
      resolveOld?.({ name: 'Ada', token: 'token-a', expiresIn: 3600 });
      await expect(outcome).resolves.toMatchObject({ kind: 'cancelled' });
      expect(oldSignal?.aborted).toBe(true);
      expect(store.token).toBe(action === 'logout' ? '' : 'token-b');
      expect(store.info?.name).toBe(action === 'logout' ? undefined : 'Lin');
    },
  );
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
