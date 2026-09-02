<template>
  <form class="chat-composer" @submit.prevent="submit">
    <textarea
      ref="textarea"
      v-model="input"
      rows="1"
      :disabled="disabled"
      :aria-label="t('common.ai.inputLabel')"
      :placeholder="t('common.ai.placeholder')"
      @input="resize"
      @keydown="handleKeydown"
      @compositionstart="composing = true"
      @compositionend="composing = false"
    />
    <button
      v-if="streaming"
      class="stop-button"
      type="button"
      :aria-label="t('common.ai.stop')"
      @click="$emit('stop')"
    >
      <span />
    </button>
    <button
      v-else
      class="send-button"
      type="submit"
      :disabled="disabled || !input.trim()"
      :aria-label="t('common.ai.send')"
    >
      ↑
    </button>
  </form>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
defineProps<{ disabled?: boolean; streaming?: boolean }>();
const emit = defineEmits<{ send: [content: string]; stop: [] }>();
const { t } = useI18n();
const input = ref('');
const composing = ref(false);
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea');
const resize = () => {
  const element = textarea.value;
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${Math.min(element.scrollHeight, 220)}px`;
};
const submit = () => {
  const content = input.value.trim();
  if (!content) return;
  emit('send', content);
  input.value = '';
  void nextTick(resize);
};
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey && !composing.value) {
    event.preventDefault();
    submit();
  }
};
</script>

<style scoped lang="scss">
.chat-composer {
  display: flex;
  gap: var(--space-2);
  align-items: end;
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
}

textarea {
  flex: 1;
  min-height: var(--touch-target);
  max-height: 220px;
  padding: 0.625rem var(--space-2);
  overflow: auto;
  line-height: 1.45;
  color: var(--color-text);
  resize: none;
  outline: 0;
  background: transparent;
  border: 0;
}

button {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  border: 0;
  border-radius: var(--radius-md);

  &:disabled {
    opacity: 0.4;
  }
}

.send-button {
  font-size: 1.25rem;
  font-weight: 700;
}

.stop-button span {
  width: 0.75rem;
  height: 0.75rem;
  background: currentcolor;
  border-radius: 0.125rem;
}
</style>
