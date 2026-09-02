<template>
  <div class="page mobile-page">
    <header class="page-header">
      <div>
        <small class="eyebrow">{{ t('common.mobile.eyebrow') }}</small>
        <h1>{{ t('common.mobile.title') }}</h1>
        <p>{{ t('common.mobile.description') }}</p>
      </div>
    </header>

    <section class="capability-list">
      <article>
        <div>
          <b>{{ t('common.mobile.network') }}</b>
          <p>{{ t('common.mobile.networkDescription') }}</p>
        </div>
        <span :class="{ online: isOnline }">{{
          isOnline ? t('common.global.online') : t('common.mobile.offline')
        }}</span>
      </article>
      <article>
        <div>
          <b>{{ t('common.mobile.clipboard') }}</b>
          <p>{{ t('common.mobile.clipboardDescription') }}</p>
        </div>
        <button class="button-secondary" type="button" @click="copyText">
          {{ t('common.mobile.copy') }}
        </button>
      </article>
      <article>
        <div>
          <b>{{ t('common.mobile.share') }}</b>
          <p>{{ t('common.mobile.shareDescription') }}</p>
        </div>
        <button
          class="button-secondary"
          type="button"
          :disabled="!canShare"
          @click="sharePage"
        >
          {{ t('common.mobile.shareAction') }}
        </button>
      </article>
      <article>
        <div>
          <b>{{ t('common.mobile.safeArea') }}</b>
          <p>{{ t('common.mobile.safeAreaDescription') }}</p>
        </div>
        <span class="safe-area-demo">{{ t('common.mobile.adapted') }}</span>
      </article>
    </section>
    <p v-if="feedback" class="feedback" role="status">{{ feedback }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNetworkStatus } from '@/composables/useNetworkStatus';

const { t } = useI18n();
const { isOnline } = useNetworkStatus();
const feedback = ref('');
const canShare = computed(() => typeof navigator.share === 'function');
const copyText = async () => {
  await navigator.clipboard.writeText('Vue H5 Template v2');
  feedback.value = t('common.mobile.copied');
};
const sharePage = async () => {
  if (!canShare.value) return;
  await navigator.share({ title: document.title, url: window.location.href });
  feedback.value = t('common.mobile.shared');
};
</script>

<style scoped lang="scss">
.capability-list {
  border-top: 1px solid var(--color-border);

  article {
    display: flex;
    gap: var(--space-4);
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border);

    b {
      font-weight: 650;
    }

    p {
      margin: var(--space-1) 0 0;
      color: var(--color-text-secondary);
    }

    > span {
      flex: 0 0 auto;
      font-size: var(--text-secondary);
      color: var(--color-text-secondary);

      &.online {
        color: var(--color-success);
      }
    }
  }
}

.safe-area-demo {
  padding: var(--space-2);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-sm);
}

.feedback {
  color: var(--color-success);
}

@media (max-width: 520px) {
  .capability-list article {
    align-items: flex-start;
  }
}
</style>
