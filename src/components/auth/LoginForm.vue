<template>
  <form class="login-form" autocomplete="off" @submit.prevent="submit">
    <label for="username">{{ t('common.login.username') }}</label>
    <input
      id="username"
      v-model.trim="name"
      name="demo-account"
      autocomplete="off"
      required
      :placeholder="t('common.login.usernamePlaceholder')"
    />
    <label for="password">{{ t('common.login.password') }}</label>
    <input
      id="password"
      v-model="password"
      name="demo-password"
      type="password"
      autocomplete="new-password"
      required
      :placeholder="t('common.login.passwordPlaceholder')"
    />
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <button type="submit" :disabled="loading || !canSubmit">
      {{ loading ? t('common.login.submitting') : t('common.login.submit') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { LoginParams } from '@/api/modules/auth';

defineProps<{ loading?: boolean; error?: string }>();
const emit = defineEmits<{ submit: [params: LoginParams] }>();
const { t } = useI18n();
const name = ref('');
const password = ref('');
const canSubmit = computed(() => Boolean(name.value && password.value));
const submit = () => {
  if (canSubmit.value)
    emit('submit', { name: name.value, password: password.value });
};
</script>

<style scoped lang="scss">
.login-form {
  display: grid;
  gap: var(--space-3);

  label {
    margin-top: var(--space-2);
    font-size: var(--text-secondary);
    font-weight: 600;
  }

  input {
    min-height: var(--touch-target);
    padding: 0 var(--space-3);
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
  }

  button {
    min-height: var(--touch-target);
    margin-top: var(--space-3);
    font-weight: 600;
    color: var(--color-primary-contrast);
    background: var(--color-primary);
    border: 0;
    border-radius: var(--radius-md);

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }
}

.form-error {
  margin: var(--space-1) 0 0;
  font-size: var(--text-secondary);
  color: var(--color-danger);
}
</style>
