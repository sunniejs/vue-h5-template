import { apiClient } from '@/api/client';
// The AI gateway has its own base URL; never send this request to Gin.
export const getChatSuggestions = (locale, signal, baseURL = '/api/ai') =>
  apiClient.get('/suggestions', {
    baseURL,
    params: { locale: suggestionLocale(locale) },
    signal,
  });
function suggestionLocale(locale) {
  if (locale.startsWith('zh')) return 'zh-CN';
  if (locale.startsWith('ja')) return 'ja-JP';
  return 'en-US';
}
