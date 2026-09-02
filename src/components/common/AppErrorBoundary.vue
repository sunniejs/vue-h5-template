<template>
  <section v-if="error" class="error-boundary" role="alert">
    <SvgIcon name="logo" />
    <h1>{{ t('common.errorBoundary.title') }}</h1>
    <p>{{ t('common.errorBoundary.description') }}</p>
    <button type="button" @click="recover">
      {{ t('common.errorBoundary.reload') }}
    </button>
  </section>
  <slot v-else />
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const error = ref<Error | null>(null);
onErrorCaptured((captured) => {
  error.value = captured;
  return false;
});
const recover = () => window.location.reload();
</script>

<style scoped lang="scss">
.error-boundary {
  display: grid;
  place-content: center;
  min-height: 100dvh;
  padding: var(--space-10) var(--space-8);
  text-align: center;

  .svg-icon {
    margin: 0 auto var(--space-5);
    font-size: 2rem;
    color: var(--color-primary);
  }

  h1 {
    font-size: var(--text-page-title);
    font-weight: 680;
  }

  p {
    max-width: 30rem;
    margin: var(--space-4) 0 var(--space-6);
    color: var(--color-text-secondary);
  }

  button {
    min-height: var(--touch-target);
    padding: 0 var(--space-4);
    color: var(--color-primary-contrast);
    background: var(--color-primary);
    border: 0;
    border-radius: var(--radius-md);
  }
}
</style>
