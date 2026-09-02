<template>
  <div class="page icons-page">
    <section class="surface-card">
      <span>{{ t('common.icons.eyebrow') }}</span>
      <h1>{{ t('common.icons.title') }}</h1>
      <p>{{ t('common.icons.description') }}</p>
      <div class="icon-grid">
        <article v-for="name in icons" :key="name">
          <SvgIcon :name="name" /><b>{{ name }}</b>
        </article>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { SvgIconName } from '@/types/icon';
const { t } = useI18n();
const icons: SvgIconName[] = ['logo', 'home', 'examples', 'ai', 'user'];
</script>
<style scoped lang="scss">
section {
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
  }

  p {
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  margin-top: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);

  article {
    display: grid;
    gap: var(--space-2);
    place-items: center;
    padding: var(--space-5) var(--space-3);
    color: var(--color-text);
    background: var(--color-surface);
    border-right: 1px solid var(--color-border);

    &:last-child {
      border-right: 0;
    }

    .svg-icon {
      font-size: 1.5rem;
      color: var(--color-primary);
    }

    b {
      font-size: var(--text-secondary);
    }
  }
}
</style>
