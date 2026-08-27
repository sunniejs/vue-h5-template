# 状态管理

## Pinia：Client State

适合认证会话、主题、Feature Flags、用户本地偏好等由浏览器拥有的状态。`user` Store 保存短生命周期 Token，并提供 `login/logout`。

## TanStack Query：Server State

适合远程数据缓存、请求状态、重试、取消、Mutation、Pagination 和 Infinite Query。全局 Query Client 默认：

- `staleTime` 30 秒；
- `gcTime` 5 分钟；
- 网络/5xx 最多重试两次；
- 4xx 不重试；
- Query Function 透传 `AbortSignal`。

`/examples/query` 同时展示任务 Query、toggle Mutation 和 cursor Infinite Query。Mutation 更新 Query Cache，而不是复制一份到 Pinia。

## 局部与流式状态

表单值留在组件。AI 会话由 `useStreamingChat` 管理，因为它的生命周期与 Provider/AbortController 紧密相关，不应写入 Pinia 或 Query Cache。只有出现跨会话持久化产品需求时才增加存储层。
