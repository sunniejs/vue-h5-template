<template>
  <div class="page examples-page">
    <header>
      <span>{{ t('common.examples.eyebrow') }}</span>
      <h1>{{ t('common.examples.title') }}</h1>
      <p>{{ t('common.examples.description') }}</p>
    </header>
    <section class="example-list">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="surface-card example-link"
      >
        <span class="example-link__icon"><SvgIcon :name="item.icon" /></span>
        <span
          ><b>{{ item.title }}</b
          ><small>{{ item.description }}</small></span
        >
        <i>→</i>
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SvgIconName } from '@/types/icon';
defineOptions({ name: 'ExamplesPage' });
const { t } = useI18n();
const items = computed<
  Array<{ to: string; title: string; description: string; icon: SvgIconName }>
>(() => [
  {
    to: '/examples/query',
    title: t('common.examples.queryTitle'),
    description: t('common.examples.queryDescription'),
    icon: 'examples',
  },
  {
    to: '/examples/request',
    title: t('common.examples.requestTitle'),
    description: t('common.examples.requestDescription'),
    icon: 'examples',
  },
  {
    to: '/examples/workspace',
    title: t('common.examples.workspaceTitle'),
    description: t('common.examples.workspaceDescription'),
    icon: 'examples',
  },
  {
    to: '/ai/chat',
    title: t('common.examples.aiTitle'),
    description: t('common.examples.aiDescription'),
    icon: 'ai',
  },
  {
    to: '/examples/mobile',
    title: t('common.examples.mobileTitle'),
    description: t('common.examples.mobileDescription'),
    icon: 'shop',
  },
  {
    to: '/examples/icons',
    title: t('common.examples.iconsTitle'),
    description: t('common.examples.iconsDescription'),
    icon: 'logo',
  },
  {
    to: '/offline',
    title: t('common.examples.offlineTitle'),
    description: t('common.examples.offlineDescription'),
    icon: 'home',
  },
  {
    to: '/ui-framework',
    title: t('common.examples.uiTitle'),
    description: t('common.examples.uiDescription'),
    icon: 'examples',
  },
]);
</script>

<style scoped lang="scss">
header {
  padding: var(--space-4) 0 var(--space-6);
  border-bottom: 1px solid var(--color-border);

  > span {
    font-size: var(--text-caption);
    font-weight: 650;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  h1 {
    margin: var(--space-1) 0 var(--space-2);
    font-size: var(--text-page-title);
    font-weight: 680;
    letter-spacing: -0.03em;
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
}

.example-list {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.example-link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-4);
  color: var(--color-text);
  text-decoration: none;

  .example-link__icon {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    color: var(--color-primary);
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);

    .svg-icon {
      font-size: 0.875rem;
    }
  }

  b,
  small {
    display: block;
  }

  b {
    margin-bottom: var(--space-1);
    font-size: var(--text-card-title);
  }

  small {
    line-height: 1.45;
    color: var(--color-text-secondary);
  }

  i {
    font-size: 1rem;
    font-style: normal;
    color: var(--color-text-muted);
  }
}
</style>
