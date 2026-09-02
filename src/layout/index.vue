<template>
  <div class="app-shell">
    <header
      v-if="!route.meta.hideHeader"
      class="top-bar"
      :class="{ 'top-bar--root': isRootPage }"
    >
      <button
        v-if="!isRootPage"
        class="icon-button"
        type="button"
        :aria-label="t('common.global.back')"
        @click="router.back()"
      >
        ‹
      </button>
      <span v-else />
      <span class="top-bar__title">{{ pageTitle }}</span>
      <span />
    </header>

    <p v-if="!isOnline" class="offline-banner" role="status">
      {{ t('common.global.offlineBanner') }}
    </p>

    <main class="page-scroll" :class="{ 'page-scroll--with-nav': isRootPage }">
      <RouterView v-slot="{ Component, route: childRoute }">
        <KeepAlive>
          <component
            :is="Component"
            v-if="childRoute.meta.keepAlive"
            :key="childRoute.name"
          />
        </KeepAlive>
        <component
          :is="Component"
          v-if="!childRoute.meta.keepAlive"
          :key="childRoute.fullPath"
        />
      </RouterView>
    </main>

    <RouterLink
      v-if="!route.meta.hideAiEntry"
      class="ai-entry"
      :class="{ 'ai-entry--with-nav': isRootPage }"
      to="/ai/chat"
      :aria-label="t('common.ai.open')"
    >
      <SvgIcon name="ai" />
      <span>{{ t('common.ai.open') }}</span>
    </RouterLink>

    <nav
      v-if="isRootPage"
      class="tab-bar"
      :aria-label="t('common.global.mainNavigation')"
    >
      <RouterLink to="/home" class="tab-bar__brand"
        ><SvgIcon name="logo" /><strong>H5 Studio</strong></RouterLink
      >
      <RouterLink
        v-for="item in tabs"
        :key="item.to"
        :to="item.to"
        class="tab-bar__item"
      >
        <SvgIcon :name="item.icon" />
        <span>{{ item.label }}</span>
      </RouterLink>
      <label class="tab-bar__language">
        <span class="visually-hidden">{{ t('common.language.label') }}</span>
        <select
          :value="locale"
          :aria-label="t('common.language.label')"
          @change="changeLanguage"
        >
          <option
            v-for="option in languageOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ t(option.label) }}
          </option>
        </select>
      </label>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useNetworkStatus } from '@/composables/useNetworkStatus';
import { setLang } from '@/locales';
import type { SupportedLocale } from '@/locales';
import type { SvgIconName } from '@/types/icon';

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const { isOnline } = useNetworkStatus();
const rootNames = new Set(['home', 'shop', 'examples', 'member']);
const isRootPage = computed(() => rootNames.has(String(route.name)));
const pageTitle = computed(() =>
  route.meta.title ? t(route.meta.title) : 'Vue H5',
);
const tabs = computed<Array<{ to: string; label: string; icon: SvgIconName }>>(
  () => [
    { to: '/home', label: t('common.tabbar.home'), icon: 'home' },
    { to: '/shop', label: t('common.tabbar.shop'), icon: 'shop' },
    { to: '/examples', label: t('common.tabbar.examples'), icon: 'examples' },
    { to: '/member', label: t('common.tabbar.member'), icon: 'user' },
  ],
);
const languageOptions: Array<{ value: SupportedLocale; label: string }> = [
  { value: 'zh-CN', label: 'common.language.zh' },
  { value: 'en-US', label: 'common.language.en' },
  { value: 'ja-JP', label: 'common.language.ja' },
];
const changeLanguage = (event: Event) =>
  void setLang((event.target as HTMLSelectElement).value);
</script>

<style scoped lang="scss">
.app-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  background: var(--color-background);
}

.top-bar {
  display: grid;
  grid-template-columns: 3.25rem 1fr 3.25rem;
  align-items: center;
  min-height: 3.25rem;
  padding-top: env(safe-area-inset-top);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.top-bar__title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--text-body);
  font-weight: 650;
  text-align: center;
  white-space: nowrap;
}

.icon-button {
  width: var(--touch-target);
  min-height: var(--touch-target);
  font-size: 1.75rem;
  color: var(--color-text);
  background: transparent;
  border: 0;
}

.page-scroll {
  flex: 1;
  min-height: 0;
  overflow: hidden auto;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}

.page-scroll--with-nav {
  padding-bottom: calc(4rem + env(safe-area-inset-bottom));
}

.offline-banner {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-secondary);
  color: var(--color-warning);
  text-align: center;
  background: var(--color-warning-soft);
}

.tab-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  min-height: 3.75rem;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--color-surface);
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  border-top: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.tab-bar__brand {
  display: none;
}

.tab-bar__language {
  display: none;
}

.ai-entry {
  position: fixed;
  right: max(var(--space-4), env(safe-area-inset-right));
  bottom: max(var(--space-4), env(safe-area-inset-bottom));
  z-index: 19;
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  min-width: var(--touch-target);
  min-height: var(--touch-target);
  padding: 0;
  font-size: var(--text-secondary);
  font-weight: 650;
  color: var(--color-primary-contrast);
  text-decoration: none;
  background: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 70%, #000);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 14px rgb(24 24 27 / 14%);

  .svg-icon {
    font-size: 1.125rem;
  }

  span {
    display: none;
  }
}

.ai-entry--with-nav {
  bottom: calc(4.5rem + env(safe-area-inset-bottom));
}

.tab-bar__item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
  text-decoration: none;

  .svg-icon {
    font-size: 1.25rem;
  }

  &.router-link-active {
    color: var(--color-primary);
  }
}

@media (min-width: 768px) {
  .top-bar--root {
    display: none;
  }

  .page-scroll--with-nav {
    padding-top: 4.75rem;
    padding-bottom: 0;
    scrollbar-gutter: stable both-edges;
  }

  .tab-bar {
    inset: 0.75rem 1.5rem auto;
    grid-template-columns: minmax(7rem, 1fr) repeat(4, auto) auto;
    gap: var(--space-1);
    width: min(calc(100% - 3rem), var(--content-max-width));
    min-height: 3.25rem;
    padding: 0.25rem;
    margin: 0 auto;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-float);
  }

  .tab-bar__brand {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    align-self: stretch;
    padding: 0 var(--space-3);
    color: var(--color-text);
    text-decoration: none;

    .svg-icon {
      font-size: 1.25rem;
      color: var(--color-primary);
    }
  }

  .tab-bar__item {
    flex-direction: row;
    gap: var(--space-2);
    min-width: 5rem;
    padding: 0 var(--space-3);
    font-size: var(--text-secondary);
    border-radius: var(--radius-md);

    &.router-link-active {
      color: var(--color-text);
      background: var(--color-background-soft);
    }

    .svg-icon {
      font-size: 1rem;
    }
  }

  .tab-bar__language {
    display: grid;
    align-items: center;
    padding: 0 var(--space-1);

    select {
      min-height: var(--touch-target);
      padding: 0 var(--space-2);
      color: var(--color-text);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
  }

  .ai-entry {
    right: max(1.5rem, calc((100vw - var(--content-max-width)) / 2 + 1.5rem));
    bottom: var(--space-6);
    padding: 0 var(--space-3);

    span {
      display: inline;
    }
  }
}

@supports not (height: 100dvh) {
  .app-shell {
    height: 100vh;
  }
}
</style>
