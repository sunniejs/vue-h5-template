# AI Chat 与 Streaming

## 为什么不用重型 SDK

Vercel AI SDK 已支持 Vue，但模板只需要文本流、取消、重试和 Provider 替换。直接接入会同时带入其服务端协议与 UI message model。v2 使用轻量标准接口：

```ts
interface ChatProvider {
  chat(
    messages: readonly ChatMessage[],
    options?: ChatOptions,
  ): AsyncIterable<ChatChunk>;
}
```

未来可以增加 OpenAI、Claude、Gemini、DeepSeek 或 Vercel data-stream adapter，而页面不用变化。

## 运行链路

1. `ChatComposer` 提交文本并处理 Enter、IME、自动增高。
2. `useStreamingChat` 添加 user 与 streaming assistant message。
3. `FetchStreamChatProvider` POST `/api/ai/chat`。
4. `parseSseStream` 从 `ReadableStream` 解析跨网络 chunk 的 SSE event。
5. 每个 delta 追加到消息；done 完成；error 进入可重试状态。
6. Stop 调用 `AbortController.abort()`，请求立即终止并标记 stopped。

开发 Mock 是真实 chunked SSE middleware，不是一次性 `setTimeout` 响应。生产环境 Mock 默认关闭，真实后端需要保持 `text/event-stream`、关闭代理缓冲，并及时处理客户端断开。

配套 FastAPI AI 服务位于独立 backend 工作区，提供相同的 `/api/ai/chat` 协议、Mock/OpenAI-compatible Provider、可选 Redis 限流、服务 Token、Request ID、健康检查与测试。常规认证和 CRUD 由 Gin 服务负责，避免两个运行时职责重叠。

## Markdown 安全

Markdown-it 禁止 raw HTML，渲染结果再由 DOMPurify 移除脚本、iframe、form、style 和危险 URL。不要直接信任模型 HTML。较重的 Shiki 没有默认安装；需要高亮时应在 AI route 内动态加载。

## 移动端

页面使用 VisualViewport 跟随软键盘高度，输入栏包含 safe-area，textarea 自动增高，用户离开底部时显示 Scroll To Bottom，且不会强制抢回滚动位置。
