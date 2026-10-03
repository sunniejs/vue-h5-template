import { afterEach, describe, expect, it, vi } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import type { AxiosAdapter } from 'axios';
import {
  apiClient,
  axiosInstance,
  configureApiClient,
  normalizeApiError,
} from '@/api/client';
import { ApiError } from '@/types/api/common';

const originalAdapter = axiosInstance.defaults.adapter;

afterEach(() => {
  axiosInstance.defaults.adapter = originalAdapter;
  configureApiClient({ getAccessToken: undefined, onUnauthorized: undefined });
  vi.unstubAllEnvs();
});

describe('api client', () => {
  it.each([
    null,
    '<html>Proxy error</html>',
    { data: true },
    { code: '200', data: true },
    { code: 200 },
  ])('rejects malformed JSON envelopes as ApiError: %j', async (data) => {
    axiosInstance.defaults.adapter = async (config) => ({
      data,
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config,
    });
    await expect(apiClient.get('/test')).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'unknown',
      message: 'Invalid API response',
    });
  });
  it.each(['http', 'business'])(
    'does not expire a new session for an old %s 401',
    async (kind) => {
      let token = 'old-token';
      const onUnauthorized = vi.fn();
      configureApiClient({ getAccessToken: () => token, onUnauthorized });
      let respond: (() => void) | undefined;
      axiosInstance.defaults.adapter = (config) =>
        new Promise((resolve, reject) => {
          respond = () => {
            const response = {
              data: { code: 401, data: null, msg: 'Expired' },
              status: kind === 'http' ? 401 : 200,
              statusText: 'Expired',
              headers: new AxiosHeaders(),
              config,
            };
            if (kind === 'http')
              reject(
                new AxiosError(
                  'Expired',
                  'ERR_BAD_REQUEST',
                  config,
                  undefined,
                  response,
                ),
              );
            else resolve(response);
          };
        });
      const request = apiClient.get('/private');
      const outcome = request.catch((error: unknown) => error);
      await vi.waitFor(() => expect(respond).toBeTypeOf('function'));
      token = 'new-token';
      respond?.();
      await expect(outcome).resolves.toMatchObject({ name: 'ApiError' });
      expect(onUnauthorized).not.toHaveBeenCalled();
    },
  );

  it('injects auth and request id, then unwraps data', async () => {
    vi.stubEnv('VITE_REQUEST_ID_ENABLED', 'true');
    configureApiClient({ getAccessToken: () => 'token-123' });
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      expect(config.headers.get('Authorization')).toBe('Bearer token-123');
      expect(config.headers.get('X-Request-ID')).toMatch(
        /^req-|^[0-9a-f-]{36}$/i,
      );
      return {
        data: { code: 200, data: { id: 1 }, msg: 'ok' },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
      };
    });
    axiosInstance.defaults.adapter = adapter;
    await expect(apiClient.get<{ id: number }>('/test')).resolves.toEqual({
      id: 1,
    });
  });

  it('turns business failures into ApiError and invokes unauthorized', async () => {
    const onUnauthorized = vi.fn();
    configureApiClient({ onUnauthorized });
    axiosInstance.defaults.adapter = async (config) => ({
      data: { code: 401, data: null, msg: 'Expired' },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config,
    });
    await expect(apiClient.get('/test')).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'business',
      code: 401,
    });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it('accepts successful 2xx business codes', async () => {
    axiosInstance.defaults.adapter = async (config) => ({
      data: { code: 201, data: { id: 1 }, msg: 'created' },
      status: 201,
      statusText: 'Created',
      headers: new AxiosHeaders(),
      config,
    });
    await expect(apiClient.post<{ id: number }>('/projects')).resolves.toEqual({
      id: 1,
    });
  });

  it('normalizes timeout, network and unknown failures', () => {
    expect(
      normalizeApiError(new AxiosError('late', 'ECONNABORTED')),
    ).toMatchObject({ kind: 'timeout' });
    expect(normalizeApiError(new AxiosError('offline'))).toMatchObject({
      kind: 'network',
    });
    expect(normalizeApiError('bad')).toBeInstanceOf(ApiError);
  });
});

it('accepts real service envelopes and preserves their error messages', async () => {
  axiosInstance.defaults.adapter = async (config) => ({
    data: { code: 0, message: 'ok', data: true },
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config,
  });
  await expect(apiClient.get('/product/favorite')).resolves.toBe(true);
  axiosInstance.defaults.adapter = async (config) => ({
    data: { code: 422, message: 'Invalid favorite', data: null },
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config,
  });
  await expect(apiClient.get('/product/favorite')).rejects.toMatchObject({
    message: 'Invalid favorite',
    code: 422,
  });
});
