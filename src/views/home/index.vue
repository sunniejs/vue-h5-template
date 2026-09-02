<template>
  <div class="home-page page">
    <header class="home-header">
      <span class="brand"><SvgIcon name="logo" /> H5 Studio</span>
      <label class="language-picker">
        <span>{{ t('common.language.label') }}</span>
        <select :value="locale" @change="changeLanguage">
          <option
            v-for="option in languageOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ t(option.label) }}
          </option>
        </select>
      </label>
    </header>

    <section class="home-intro">
      <span class="eyebrow">{{ t('common.home.eyebrow') }}</span>
      <h1>{{ t('common.home.title') }}</h1>
      <p>{{ t('common.home.description') }}</p>
      <div class="home-actions">
        <RouterLink class="button-primary" to="/shop">{{
          t('common.home.browseShop')
        }}</RouterLink>
        <RouterLink class="button-secondary" to="/examples">{{
          t('common.home.viewExamples')
        }}</RouterLink>
      </div>
    </section>

    <section class="feature-section">
      <div class="section-header">
        <div>
          <span class="eyebrow">{{ t('common.home.architecture') }}</span>
          <h2>{{ t('common.home.stateBoundary') }}</h2>
        </div>
      </div>
      <div class="feature-list">
        <article>
          <b>Pinia</b>
          <div>
            <h3>{{ t('common.home.clientState') }}</h3>
            <p>{{ t('common.home.clientStateDescription') }}</p>
          </div>
        </article>
        <article>
          <b>Vue Query</b>
          <div>
            <h3>{{ t('common.home.serverState') }}</h3>
            <p>{{ t('common.home.serverStateDescription') }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="commerce-section">
      <div>
        <span class="eyebrow">{{ t('common.home.featured') }}</span>
        <h2>{{ t('common.home.shopTitle') }}</h2>
        <p>{{ t('common.home.shopDescription') }}</p>
      </div>
      <RouterLink class="button-secondary" to="/shop"
        >{{ t('common.home.openShop') }} →</RouterLink
      >
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { setLang } from '@/locales';
import type { SupportedLocale } from '@/locales';

defineOptions({ name: 'HomePage' });
const { locale, t } = useI18n();
const languageOptions: Array<{ value: SupportedLocale; label: string }> = [
  { value: 'zh-CN', label: 'common.language.zh' },
  { value: 'en-US', label: 'common.language.en' },
  { value: 'ja-JP', label: 'common.language.ja' },
];
const changeLanguage = (event: Event) =>
  void setLang((event.target as HTMLSelectElement).value);
</script>

<style scoped lang="scss">
.home-page {
  padding-top: calc(var(--space-4) + env(safe-area-inset-top));
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.brand {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  font-weight: 680;
  letter-spacing: -0.015em;

  .svg-icon {
    font-size: 1.25rem;
    color: var(--color-primary);
  }
}

.language-picker {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  font-size: var(--text-caption);
  color: var(--color-text-secondary);

  select {
    min-height: 2.25rem;
    padding: 0 var(--space-2);
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }
}

.home-intro {
  max-width: 55rem;
  padding: var(--space-8) 0 var(--space-6);

  h1 {
    max-width: 52rem;
    margin: var(--space-3) 0;
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 680;
    line-height: 1.08;
    letter-spacing: -0.045em;
  }

  p {
    max-width: 40rem;
    margin: 0;
    color: var(--color-text-secondary);
  }
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);

  a {
    text-decoration: none;
  }
}

.feature-section {
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.feature-list {
  border-top: 1px solid var(--color-border);

  article {
    display: grid;
    grid-template-columns: minmax(7rem, 0.35fr) 1fr;
    gap: var(--space-5);
    padding: var(--space-5) 0;
    border-bottom: 1px solid var(--color-border);
  }

  b {
    font-size: var(--text-secondary);
    font-weight: 650;
    color: var(--color-primary);
  }

  h3 {
    margin: 0 0 var(--space-1);
    font-size: var(--text-card-title);
    font-weight: 650;
  }

  p {
    margin: 0;
    color: var(--color-text-secondary);
  }
}

.commerce-section {
  display: flex;
  gap: var(--space-6);
  align-items: end;
  justify-content: space-between;
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--color-border);

  h2 {
    margin: var(--space-2) 0;
    font-size: var(--text-section-title);
    font-weight: 650;
  }

  p {
    max-width: 42rem;
    margin: 0;
    color: var(--color-text-secondary);
  }

  > a {
    flex: 0 0 auto;
    text-decoration: none;
  }
}

@media (min-width: 768px) {
  .home-header {
    display: none;
  }

  .home-intro {
    padding-top: var(--space-8);
  }
}

@media (max-width: 520px) {
  .commerce-section {
    flex-direction: column;
    align-items: stretch;
  }

  .feature-list article {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }

  .commerce-section > a {
    align-self: flex-start;
  }
}
</style>
