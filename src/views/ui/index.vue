<template>
  <div class="page ui-page">
    <section class="surface-card strategy">
      <span>{{ t('common.ui.eyebrow') }}</span>
      <h1>{{ t('common.ui.title', { framework }) }}</h1>
      <p>{{ t('common.ui.description') }}</p>
    </section>
    <SelectedUiDemo />
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SelectedUiDemo from '#ui-demo';
const { t } = useI18n();
const framework = import.meta.env.VITE_UI_FRAMEWORK;
</script>
<style scoped lang="scss">
.ui-page {
  display: grid;
  gap: var(--space-4);
  align-content: start;
}

.strategy {
  padding: var(--space-4) 0 var(--space-6);
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--color-border);
  box-shadow: none;

  > span {
    font-size: var(--text-caption);
    font-weight: 650;
    color: var(--color-text-secondary);
    letter-spacing: 0.12em;
  }

  h1 {
    margin: var(--space-1) 0 var(--space-2);
    font-size: var(--text-page-title);
    font-weight: 680;
    text-transform: capitalize;
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  code {
    color: var(--color-primary);
  }
}
</style>
