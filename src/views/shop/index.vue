<template>
  <div
    class="shop-page page"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="pull-indicator"
      :class="{ visible: distance > 0 || refreshing }"
      :style="{ height: `${distance}px` }"
      role="status"
    >
      {{
        refreshing
          ? t('common.shop.refreshing')
          : ready
            ? t('common.shop.releaseRefresh')
            : t('common.shop.pullRefresh')
      }}
    </div>
    <header class="page-header">
      <div>
        <small class="eyebrow">{{ t('common.shop.eyebrow') }}</small>
        <h1>{{ t('common.shop.title') }}</h1>
        <p>{{ t('common.shop.description') }}</p>
      </div>
      <RouterLink
        class="cart-entry button-secondary"
        to="/shop/cart"
        :aria-label="t('common.cart.open')"
      >
        <SvgIcon name="cart" /><span>{{ t('common.cart.shortTitle') }}</span
        ><b v-if="cart.itemCount">{{ cart.itemCount }}</b>
      </RouterLink>
    </header>

    <form class="search-bar" role="search" @submit.prevent="applySearch">
      <input
        v-model.trim="searchInput"
        type="search"
        autocomplete="off"
        :aria-label="t('common.shop.searchLabel')"
        :placeholder="t('common.shop.searchPlaceholder')"
      />
      <button class="button-primary" type="submit">
        {{ t('common.shop.search') }}
      </button>
    </form>

    <div class="shop-controls">
      <div class="category-tabs" role="list">
        <button
          v-for="item in categories"
          :key="item.value"
          type="button"
          :class="{ active: category === item.value }"
          @click="category = item.value"
        >
          {{ item.label }}
        </button>
      </div>
      <label
        ><span>{{ t('common.shop.sortLabel') }}</span
        ><select v-model="sort">
          <option value="featured">{{ t('common.shop.sort.featured') }}</option>
          <option value="sales">{{ t('common.shop.sort.sales') }}</option>
          <option value="price_asc">
            {{ t('common.shop.sort.priceAsc') }}
          </option>
          <option value="price_desc">
            {{ t('common.shop.sort.priceDesc') }}
          </option>
        </select></label
      >
    </div>

    <div class="catalog-heading section-header">
      <div>
        <small class="eyebrow">{{ t('common.shop.catalog') }}</small>
        <h2>
          {{
            t('common.shop.productCount', {
              count: productsQuery.data.value?.pages[0]?.total ?? 0,
            })
          }}
        </h2>
      </div>
      <RouterLink
        v-if="userStore.token"
        to="/shop/admin/products"
        class="button-secondary"
        >{{ t('common.shop.manage') }}</RouterLink
      >
    </div>

    <div
      v-if="productsQuery.isPending.value"
      class="product-grid"
      aria-busy="true"
    >
      <span v-for="item in 4" :key="item" class="product-skeleton" />
    </div>
    <section
      v-else-if="productsQuery.isError.value"
      class="state-panel"
      role="alert"
    >
      <b>{{ t('common.shop.loadFailed') }}</b>
      <p>{{ productsQuery.error.value?.message }}</p>
      <button
        class="button-secondary"
        type="button"
        @click="productsQuery.refetch()"
      >
        {{ t('common.global.retry') }}
      </button>
    </section>
    <section v-else-if="!products.length" class="state-panel">
      <b>{{ t('common.shop.empty') }}</b>
      <p>{{ t('common.shop.emptyDescription') }}</p>
    </section>
    <div v-else class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>

    <button
      v-if="productsQuery.hasNextPage.value"
      class="load-more button-secondary"
      type="button"
      :disabled="productsQuery.isFetchingNextPage.value"
      @click="productsQuery.fetchNextPage()"
    >
      {{
        productsQuery.isFetchingNextPage.value
          ? t('common.shop.loadingMore')
          : t('common.shop.loadMore')
      }}
    </button>
    <p v-if="cartMessage" class="cart-message" role="status">
      {{ cartMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { getProducts } from '@/api/modules/products';
import type { Product } from '@/api/modules/products';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import { useCartStore } from '@/store/modules/cart';
import { useUserStore } from '@/store/modules/user';

defineOptions({ name: 'ShopPage' });
const { t } = useI18n();
const userStore = useUserStore();
const cart = useCartStore();
const cartMessage = ref('');
const searchInput = ref('');
const keyword = ref('');
const category = ref('');
const sort = ref<'featured' | 'sales' | 'price_asc' | 'price_desc'>('featured');
const categories = computed(() => [
  { value: '', label: t('common.shop.categories.all') },
  { value: 'digital', label: t('common.shop.categories.digital') },
  { value: 'lifestyle', label: t('common.shop.categories.lifestyle') },
  { value: 'home', label: t('common.shop.categories.home') },
  { value: 'outdoor', label: t('common.shop.categories.outdoor') },
]);
const productsQuery = useInfiniteQuery({
  queryKey: computed(() => [
    'products',
    { keyword: keyword.value, category: category.value, sort: sort.value },
  ]),
  initialPageParam: 1,
  queryFn: ({ pageParam, signal }) =>
    getProducts(
      {
        page: pageParam,
        pageSize: 6,
        keyword: keyword.value || undefined,
        category: category.value || undefined,
        sort: sort.value,
      },
      signal,
    ),
  getNextPageParam: (lastPage) =>
    lastPage.hasMore ? lastPage.page + 1 : undefined,
});
const products = computed(
  () => productsQuery.data.value?.pages.flatMap((page) => page.list) ?? [],
);
const applySearch = () => {
  keyword.value = searchInput.value;
};
const { distance, onTouchEnd, onTouchMove, onTouchStart, ready, refreshing } =
  usePullToRefresh({
    onRefresh: async () => {
      await productsQuery.refetch();
    },
  });
let messageTimer: ReturnType<typeof setTimeout> | undefined;
const addToCart = (product: Product) => {
  cart.add(product);
  cartMessage.value = t('common.shop.addedToCart', { count: cart.itemCount });
  if (messageTimer) clearTimeout(messageTimer);
  messageTimer = setTimeout(() => {
    cartMessage.value = '';
  }, 1800);
};
onBeforeUnmount(() => {
  if (messageTimer) clearTimeout(messageTimer);
});
</script>

<style scoped lang="scss">
.shop-page {
  position: relative;
  padding-top: calc(var(--space-3) + env(safe-area-inset-top));
}

.pull-indicator {
  display: grid;
  place-items: end center;
  height: 0;
  overflow: hidden;
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  opacity: 0;
  transition:
    height var(--motion-fast) ease,
    opacity var(--motion-fast) ease;

  &.visible {
    padding-bottom: var(--space-2);
    opacity: 1;
  }
}

.cart-entry {
  position: relative;
  flex: 0 0 auto;
  min-height: var(--touch-target);
  text-decoration: none;

  b {
    display: grid;
    place-items: center;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0 0.25rem;
    font-size: 0.6875rem;
    color: var(--color-primary-contrast);
    background: var(--color-primary);
    border-radius: var(--radius-full);
  }
}

.search-bar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-2);
  max-width: 40rem;
  margin-top: var(--space-4);

  input {
    min-width: 0;
    min-height: var(--control-height);
    padding: 0 var(--space-3);
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
  }
}

.shop-controls {
  display: flex;
  gap: var(--space-4);
  align-items: end;
  justify-content: space-between;
  margin-top: var(--space-4);
  border-bottom: 1px solid var(--color-border);

  label {
    display: flex;
    flex: 0 0 auto;
    gap: var(--space-2);
    align-items: center;
    padding-bottom: var(--space-2);
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
  }

  select {
    min-height: 2.25rem;
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }
}

.category-tabs {
  display: flex;
  gap: var(--space-5);
  overflow: auto;
  scrollbar-width: none;

  button {
    flex: 0 0 auto;
    min-height: 2.5rem;
    padding: 0;
    margin-bottom: -1px;
    color: var(--color-text-secondary);
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;

    &.active {
      font-weight: 600;
      color: var(--color-text);
      border-bottom-color: var(--color-primary);
    }
  }
}

.catalog-heading {
  margin-top: var(--space-6);
}

.catalog-heading .button-secondary {
  min-height: 2.25rem;
  padding: 0 var(--space-3);
  font-size: var(--text-secondary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.product-skeleton {
  aspect-ratio: 0.72;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  animation: skeleton-pulse 1.4s ease-in-out infinite alternate;
}

.state-panel p {
  margin: 0;
}

.load-more {
  display: flex;
  margin: var(--space-6) auto 0;
}

.cart-message {
  position: fixed;
  right: var(--space-4);
  bottom: calc(4.75rem + env(safe-area-inset-bottom));
  left: var(--space-4);
  z-index: 23;
  max-width: 28rem;
  padding: var(--space-2) var(--space-3);
  margin: auto;
  color: var(--color-primary-contrast);
  text-align: center;
  background: var(--color-text);
  border-radius: var(--radius-md);
}

@keyframes skeleton-pulse {
  to {
    opacity: 0.55;
  }
}

@media (min-width: 700px) {
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .shop-controls {
    flex-direction: column;
    gap: var(--space-2);
    align-items: stretch;
  }

  .shop-controls label {
    justify-content: flex-end;
  }

  .cart-entry span {
    display: none;
  }
}
</style>
