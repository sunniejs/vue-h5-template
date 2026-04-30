import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { showToast } from 'vant';
import { useUserStore } from '@/store/modules/user';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: false,
  timeout: 15000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res.code !== 200) {
      showToast(res.msg || 'Error');
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res.data;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      const userStore = useUserStore();
      userStore.$reset();
      window.location.hash = '#/login';
    }
    const message = (error.response?.data as any)?.msg || error.message || 'Network Error';
    showToast(message);
    return Promise.reject(error);
  },
);

export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

export default service;
