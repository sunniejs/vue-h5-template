import { apiClient } from '@/api/client';
// The AI gateway has its own base URL; never send this request to Gin.
export const getChatSuggestions = (
  locale: string,
  signal?: AbortSignal,
  baseURL = '/api/ai',
) =>
  apiClient.get<string[]>('/suggestions', {
    baseURL,
    params: { locale: suggestionLocale(locale) },
    signal,
  });

function suggestionLocale(locale: string) {
  if (locale.startsWith('zh')) return 'zh-CN';
  if (locale.startsWith('ja')) return 'ja-JP';
  return 'en-US';
}
