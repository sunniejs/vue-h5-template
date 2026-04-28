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

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: false,
  timeout: 10000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
      showToast(res.msg);
      return Promise.reject(res.msg || "Error");
    } else {
      return res.data;
    }
  },
  (error: AxiosError) => {
    showToast(error.message);
    return Promise.reject(error.message);
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

## useFetchApi 封装

项目同时提供了基于 `@vueuse/core` 的 `createFetch` 封装，支持响应式的请求：

```typescript
import { createFetch } from "@vueuse/core";
import { useCookies } from "@vueuse/integrations/useCookies";
import { showNotify } from "vant";

const useFetchApi = createFetch({
  baseUrl: "",
  options: {
    async beforeFetch({ options }) {
      const myToken =
        useCookies().get(
          (import.meta.env.VITE_TOKEN_KEY as string) || "Authorization",
        ) || "";
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${myToken}`,
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
