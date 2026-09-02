<template>
  <main class="login-page">
    <RouterLink to="/home" class="back-link"
      >‹ {{ t('common.login.back') }}</RouterLink
    >
    <section class="login-card surface-card">
      <SvgIcon name="logo" />
      <span>{{ t('common.login.eyebrow') }}</span>
      <h1>{{ t('common.login.title') }}</h1>
      <p>{{ t(loginDescriptionKey) }}</p>
      <LoginForm :loading="loading" :error="errorMessage" @submit="login" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { LoginParams } from '@/api/modules/auth';
import { useUserStore } from '@/store/modules/user';
import { isApiError } from '@/types/api/common';
import { getSafeRedirect } from '@/utils/url';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { t } = useI18n();
const loginDescriptionKey =
  String(import.meta.env.VITE_USE_MOCK) === 'true'
    ? 'common.login.description'
    : 'common.login.realDescription';
const loading = ref(false);
const errorMessage = ref('');
const login = async (params: LoginParams) => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await userStore.login(params);
    await router.replace(getSafeRedirect(route.query.redirect, '/member'));
  } catch (error) {
    errorMessage.value = isApiError(error)
      ? error.message
      : t('common.login.failed');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100dvh;
  padding: calc(var(--space-5) + env(safe-area-inset-top)) var(--space-5)
    calc(var(--space-5) + env(safe-area-inset-bottom));
  background: var(--color-background);
}

.back-link {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.login-card {
  max-width: 28rem;
  padding: var(--space-6);
  margin: 7vh auto 0;

  .svg-icon {
    font-size: 1.75rem;
    color: var(--color-primary);
  }

  > span {
    display: block;
    margin-top: var(--space-5);
    font-size: var(--text-caption);
    font-weight: 650;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  h1 {
    margin: var(--space-2) 0;
    font-size: var(--text-page-title);
    font-weight: 680;
  }

  > p {
    margin: 0 0 var(--space-6);
    color: var(--color-text-secondary);
  }
}
</style>
