<template>
  <div class="chat-page" :style="pageStyle">
    <header class="chat-header">
      <button
        type="button"
        :aria-label="t('common.ai.back')"
        @click="router.back()"
      >
        ‹
      </button>
      <div>
        <strong>{{ t('common.ai.assistant') }}</strong
        ><span><i /> {{ t('common.ai.status') }}</span>
      </div>
      <button type="button" :aria-label="t('common.ai.newChat')" @click="clear">
        ＋
      </button>
    </header>

    <main ref="messageList" class="message-list" @scroll="updateScrollState">
      <section v-if="messages.length === 0" class="empty-state">
        <span class="ai-mark"><SvgIcon name="ai" /></span>
        <h1>{{ t('common.ai.emptyTitle') }}</h1>
        <p>{{ t('common.ai.emptyDescription') }}</p>
        <div class="suggestions">
          <button
            v-for="prompt in prompts"
            :key="prompt"
            type="button"
            @click="sendMessage(prompt)"
          >
            {{ prompt }}<span>↗</span>
          </button>
        </div>
      </section>

      <div v-else class="conversation" aria-live="polite">
        <article
          v-for="message in messages"
          :key="message.id"
          class="message"
          :class="`message--${message.role}`"
        >
          <span v-if="message.role === 'assistant'" class="assistant-avatar"
            ><SvgIcon name="ai"
          /></span>
          <div class="message__content">
            <div v-if="message.role === 'user'" class="user-bubble">
              {{ message.content }}
            </div>
            <div v-else class="assistant-content">
              <SafeMarkdown v-if="message.content" :source="message.content" />
              <span v-else-if="message.status === 'streaming'" class="typing"
                ><i /><i /><i
              /></span>
              <i
                v-if="message.status === 'streaming' && message.content"
                class="streaming-cursor"
              />
              <p v-if="message.status === 'stopped'" class="message-status">
                {{ t('common.ai.stopped') }}
              </p>
              <p
                v-if="message.status === 'error'"
                class="message-status message-status--error"
              >
                {{ t('common.ai.failed', { message: error?.message ?? '' }) }}
              </p>
            </div>
            <div
              v-if="message.role === 'assistant' && message.content"
              class="message-actions"
            >
              <button
                type="button"
                @click="copyMessage(message.id, message.content)"
              >
                {{
                  copiedId === message.id
                    ? t('common.ai.copied')
                    : t('common.ai.copy')
                }}
              </button>
              <button
                v-if="message.status !== 'streaming'"
                type="button"
                @click="regenerate(message.id)"
              >
                {{ t('common.ai.regenerate') }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>

    <button
      v-if="showScrollButton"
      class="scroll-button"
      type="button"
      :aria-label="t('common.ai.scrollBottom')"
      @click="scrollToBottom('smooth')"
    >
      ↓
    </button>
    <footer class="composer-area">
      <ChatComposer :streaming="streaming" @send="send" @stop="stop" /><small>{{
        t('common.ai.disclaimer')
      }}</small>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStreamingChat } from '@/composables/useStreamingChat';
import { useVisualViewport } from '@/composables/useVisualViewport';

const router = useRouter();
const { t, tm } = useI18n();
const { messages, streaming, error, sendMessage, stop, regenerate, clear } =
  useStreamingChat();
const { viewportHeight } = useVisualViewport();
const messageList = useTemplateRef<HTMLElement>('messageList');
const showScrollButton = ref(false);
const copiedId = ref('');
const prompts = computed(() => tm('common.ai.prompts') as string[]);
const pageStyle = computed(() => ({
  height: viewportHeight.value ? `${viewportHeight.value}px` : '100dvh',
}));
const isNearBottom = () => {
  const element = messageList.value;
  return (
    !element ||
    element.scrollHeight - element.scrollTop - element.clientHeight < 160
  );
};
const scrollToBottom = (behavior: ScrollBehavior = 'auto') =>
  void nextTick(() =>
    messageList.value?.scrollTo({
      top: messageList.value.scrollHeight,
      behavior,
    }),
  );
const updateScrollState = () => {
  showScrollButton.value = !isNearBottom();
};
const send = (content: string) => {
  void sendMessage(content);
  scrollToBottom();
};
const copyMessage = async (id: string, content: string) => {
  await navigator.clipboard.writeText(content);
  copiedId.value = id;
  window.setTimeout(() => {
    copiedId.value = '';
  }, 1200);
};
watch(
  messages,
  () => {
    if (!showScrollButton.value) scrollToBottom();
  },
  { deep: true, flush: 'post' },
);
</script>

<style scoped lang="scss">
.chat-page {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  max-width: var(--content-max-width);
  min-height: 0;
  margin: 0 auto;
  background: var(--color-background);
}

.chat-header {
  display: grid;
  grid-template-columns: 3.25rem 1fr 3.25rem;
  align-items: center;
  min-height: 3.25rem;
  padding-top: env(safe-area-inset-top);
  background: var(--color-surface);
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);

  > button {
    min-height: var(--touch-target);
    font-size: 1.625rem;
    color: var(--color-text);
    background: transparent;
    border: 0;
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 0;
    text-align: center;
  }

  strong {
    font-size: var(--text-body);
    font-weight: 650;
  }

  span {
    font-size: 0.6875rem;
    color: var(--color-text-secondary);
  }

  span i {
    display: inline-block;
    width: 0.375rem;
    height: 0.375rem;
    margin-right: var(--space-1);
    background: var(--color-success);
    border-radius: 50%;
  }
}

.message-list {
  flex: 1;
  min-height: 0;
  overflow: hidden auto;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}

.empty-state {
  display: grid;
  align-content: center;
  min-height: 100%;
  padding: var(--space-10) var(--space-5);
  text-align: center;

  .ai-mark {
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    margin: 0 auto;
    color: var(--color-primary);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);

    .svg-icon {
      font-size: 1.25rem;
    }
  }

  h1 {
    margin: var(--space-5) 0 var(--space-2);
    font-size: var(--text-page-title);
    font-weight: 680;
    letter-spacing: -0.02em;
  }

  > p {
    margin: 0 0 var(--space-5);
    color: var(--color-text-secondary);
  }
}

.suggestions {
  display: grid;
  gap: var(--space-2);
  width: min(100%, 37.5rem);
  margin: 0 auto;

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: var(--touch-target);
    padding: 0 var(--space-3);
    color: var(--color-text);
    text-align: left;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);

    span {
      font-size: 1rem;
      color: var(--color-text-muted);
    }
  }
}

.conversation {
  width: min(100%, 51rem);
  padding: var(--space-6) var(--space-5) 5rem;
  margin: 0 auto;
}

.message {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.message--user {
  justify-content: flex-end;
  padding-left: 20%;
}

.assistant-avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.message__content {
  min-width: 0;
}

.user-bubble {
  padding: 0.75rem var(--space-4);
  line-height: 1.55;
  color: var(--color-primary-contrast);
  white-space: pre-wrap;
  background: var(--color-primary);
  border-radius: var(--radius-lg);
}

.assistant-content {
  position: relative;
  min-height: 2rem;
  padding-top: 0.25rem;
}

.message-actions {
  display: flex;
  gap: var(--space-1);
  margin-top: var(--space-2);

  button {
    min-height: 2rem;
    padding: 0 var(--space-2);
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    background: transparent;
    border: 0;
  }
}

.message-status {
  margin: var(--space-2) 0 0;
  font-size: var(--text-secondary);
  color: var(--color-text-secondary);
}

.message-status--error {
  color: var(--color-danger);
}

.typing {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-3) 0;

  i {
    width: 0.375rem;
    height: 0.375rem;
    background: var(--color-text-secondary);
    border-radius: 50%;
    animation: pulse 1s infinite alternate;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

.streaming-cursor {
  display: inline-block;
  width: 2px;
  height: 1.125rem;
  margin-left: 0.25rem;
  vertical-align: -0.125rem;
  background: var(--color-primary);
  animation: blink 0.8s infinite;
}

.composer-area {
  padding: var(--space-2) var(--space-4)
    calc(var(--space-2) + env(safe-area-inset-bottom));
  background: var(--color-background);
  border-top: 1px solid var(--color-border);

  small {
    display: block;
    margin-top: var(--space-1);
    font-size: 0.6875rem;
    color: var(--color-text-secondary);
    text-align: center;
  }
}

.scroll-button {
  position: absolute;
  right: var(--space-5);
  bottom: calc(7rem + env(safe-area-inset-bottom));
  z-index: 4;
  width: var(--touch-target);
  height: var(--touch-target);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-float);
}

@keyframes pulse {
  to {
    opacity: 0.35;
  }
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
