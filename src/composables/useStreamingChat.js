import { computed, getCurrentScope, onScopeDispose, ref, shallowRef } from 'vue'
import { defaultChatProvider } from '@/services/ai/fetchStreamProvider'
function createId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
}
function createMessage(role, content, status = 'ready') {
  return { id: createId(role), role, content, createdAt: Date.now(), status }
}
export function useStreamingChat(provider = defaultChatProvider) {
  const messages = ref([])
  const error = ref(null)
  const activeController = shallowRef(null)
  const conversationId = ref(createId('conversation'))
  const usage = ref(null)
  const streaming = computed(() => activeController.value !== null)
  let activeAssistant
  let disposed = false
  const run = async context => {
    messages.value.push(createMessage('assistant', '', 'streaming'))
    const assistant = messages.value[messages.value.length - 1]
    if (!assistant) return
    const controller = new AbortController()
    activeController.value = controller
    activeAssistant = assistant
    error.value = null
    usage.value = null
    try {
      for await (const chunk of provider.chat(context, {
        signal: controller.signal,
        conversationId: conversationId.value
      })) {
        if (activeController.value !== controller || controller.signal.aborted) return
        if (chunk.type === 'start') conversationId.value = chunk.conversationId
        if (chunk.type === 'delta') assistant.content += chunk.delta
        if (chunk.type === 'usage')
          usage.value = {
            inputTokens: chunk.inputTokens,
            outputTokens: chunk.outputTokens
          }
        if (chunk.type === 'error') throw new Error(chunk.message)
        if (chunk.type === 'done') break
      }
      if (activeController.value === controller) assistant.status = 'ready'
      // catch 参数若命名为 error 会遮蔽外层 error ref，故用 caught 并禁用命名规则
      // oxlint-disable-next-line unicorn/catch-error-name
    } catch (caught) {
      if (activeController.value !== controller) return
      if (controller.signal.aborted) {
        assistant.status = 'stopped'
      } else {
        const normalized = caught instanceof Error ? caught : new Error('Chat request failed')
        assistant.status = 'error'
        error.value = normalized
      }
    } finally {
      if (activeController.value === controller) {
        activeController.value = null
        activeAssistant = undefined
      }
    }
  }
  const sendMessage = async content => {
    const normalized = content.trim()
    if (!normalized || streaming.value || disposed) return
    const userMessage = createMessage('user', normalized)
    messages.value.push(userMessage)
    await run([...messages.value])
  }
  const stop = () => {
    const controller = activeController.value
    if (!controller) return
    activeController.value = null
    if (activeAssistant) activeAssistant.status = 'stopped'
    activeAssistant = undefined
    controller.abort()
  }
  if (getCurrentScope()) {
    onScopeDispose(() => {
      disposed = true
      stop()
    })
  }
  const findLastMessageIndex = predicate => {
    for (let index = messages.value.length - 1; index >= 0; index -= 1) {
      const message = messages.value[index]
      if (message && predicate(message)) return index
    }
    return -1
  }
  const regenerate = async assistantId => {
    if (streaming.value || disposed) return
    const targetIndex = assistantId
      ? messages.value.findIndex(message => message.id === assistantId)
      : findLastMessageIndex(message => message.role === 'assistant')
    if (targetIndex < 0) return
    const context = messages.value.slice(0, targetIndex)
    if (!context.some(message => message.role === 'user')) return
    messages.value = context
    await run([...context])
  }
  const retry = () => {
    const index = findLastMessageIndex(message => message.status === 'error')
    return regenerate(index >= 0 ? messages.value[index]?.id : undefined)
  }
  const clear = () => {
    stop()
    messages.value = []
    error.value = null
    usage.value = null
    conversationId.value = createId('conversation')
  }
  return {
    messages,
    conversationId,
    usage,
    streaming,
    error,
    sendMessage,
    stop,
    regenerate,
    retry,
    clear
  }
}
