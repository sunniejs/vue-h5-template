export type ChatRole = 'system' | 'user' | 'assistant';
export type ChatMessageStatus = 'ready' | 'streaming' | 'stopped' | 'error';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  status: ChatMessageStatus;
}

export interface ChatUsage {
  inputTokens: number;
  outputTokens: number;
}

export type ChatChunk =
  | { type: 'start'; conversationId: string }
  | { type: 'delta'; delta: string }
  | ({ type: 'usage' } & ChatUsage)
  | { type: 'done' }
  | { type: 'error'; message: string };

export interface ChatOptions {
  signal?: AbortSignal;
  conversationId?: string;
  headers?: HeadersInit;
}

export interface ChatProvider {
  chat(
    messages: readonly ChatMessage[],
    options?: ChatOptions,
  ): AsyncIterable<ChatChunk>;
}
