# axios 封装及接口管理

`utils/request/index.ts` 封装 axios，开发者需要根据后台接口做修改。

- `service.interceptors.request.use` 里可以设置请求头，比如设置 `token`
- `service.interceptors.response.use` 里可以对接口返回数据处理，比如 401 删除本地信息，重新登录

## Axios 封装

```typescript
import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
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
      showToast(res.msg || "Error");
      return Promise.reject(new Error(res.msg || "Error"));
    }
    return res.data;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      const userStore = useUserStore();
      userStore.$reset();
      window.location.hash = "#/login";
    }
    const message =
      (error.response?.data as any)?.msg || error.message || "Network Error";
    showToast(message);
    return Promise.reject(error);
  },
);

export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },
  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.post(url, data, config);
  },
  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.put(url, data, config);
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

export default service;
```

### 主要特点

- **请求拦截器**：自动从 Pinia store 注入 `Authorization` token
- **响应拦截器**：统一处理业务错误码和 HTTP 错误
- **401 处理**：自动清除登录态并跳转登录页
- **泛型支持**：`http.get<UserInfo>(url)` 获得正确的类型推导

## useFetchApi 封装

项目同时提供了基于 `@vueuse/core` 的 `createFetch` 封装，支持响应式的请求：

```typescript
import { createFetch } from "@vueuse/core";
import { showNotify } from "vant";
import { useUserStore } from "@/store/modules/user";

const useFetchApi = createFetch({
  baseUrl: "",
  options: {
    async beforeFetch({ options }) {
      const userStore = useUserStore();
      const token = userStore.token || "";
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
      return { options };
    },
    afterFetch(ctx) {
      // 处理响应数据...
      return ctx;
    },
  },
});

export default useFetchApi;
```

> 两种请求方案均统一从 Pinia `useUserStore` 获取 token，保持认证策略一致。

## 接口管理

在 `src/api/index.ts` 中统一管理接口：

```typescript
import { http } from "@/utils/request";

export function loginPassword() {
  return http.post("/mock-api/login", {
    data: { name: "123" },
  });
}
```
