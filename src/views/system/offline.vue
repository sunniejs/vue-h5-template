<template>
  <main class="offline-page">
    <SvgIcon name="logo" />
    <h1>{{ t('common.offline.title') }}</h1>
    <p>{{ t('common.offline.description') }}</p>
    <RouterLink to="/home">{{ t('common.offline.back') }}</RouterLink>
  </main>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
<style scoped lang="scss">
.offline-page {
  display: grid;
  place-content: center;
  min-height: 100dvh;
  padding: var(--space-8);
  text-align: center;

  .svg-icon {
    margin: 0 auto;
    font-size: 2rem;
    color: var(--color-primary);
  }

  h1 {
    margin: var(--space-5) 0 var(--space-2);
    font-size: var(--text-page-title);
    font-weight: 680;
  }

  p {
    max-width: 30rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  a {
    display: grid;
    place-items: center;
    min-height: var(--touch-target);
    padding: 0 var(--space-4);
    margin-top: var(--space-5);
    color: var(--color-primary-contrast);
    text-decoration: none;
    background: var(--color-primary);
    border-radius: var(--radius-md);
  }
}
</style>
