<template>
  <div class="product-detail">
    <div v-if="productQuery.isPending.value" class="detail-state">
      {{ t('common.global.loading') }}
    </div>
    <div
      v-else-if="productQuery.isError.value"
      class="detail-state"
      role="alert"
    >
      <b>{{ t('common.shop.loadFailed') }}</b
      ><button type="button" @click="productQuery.refetch()">
        {{ t('common.global.retry') }}
      </button>
    </div>
    <template v-else-if="product">
      <section class="product-media">
        <img :src="getSafeProductImage(product.coverUrl)" :alt="name" /><button
          type="button"
          :aria-label="t('common.global.back')"
          @click="router.back()"
        >
          ‹</button
        ><span v-if="product.featured">{{ t('common.shop.featured') }}</span>
      </section>
      <main>
        <section class="product-summary">
          <small
            >{{ product.brand }} ·
            {{ t(`common.shop.categories.${product.category}`) }}</small
          >
          <h1>{{ name }}</h1>
          <p>{{ subtitle }}</p>
          <div class="price">
            <strong>{{ formatProductPrice(product.priceCents, locale) }}</strong
            ><del v-if="product.originalPriceCents > product.priceCents">{{
              formatProductPrice(product.originalPriceCents, locale)
            }}</del>
          </div>
          <div class="commerce-meta">
            <span>★ {{ product.rating.toFixed(1) }}</span
            ><span>{{ t('common.shop.sales', { count: product.sales }) }}</span
            ><span>{{ t('common.shop.stock', { count: product.stock }) }}</span>
          </div>
        </section>
        <section class="service-strip">
          <span>✓ {{ t('common.shop.detail.quality') }}</span
          ><span>✓ {{ t('common.shop.detail.shipping') }}</span
          ><span>✓ {{ t('common.shop.detail.returns') }}</span>
        </section>
        <section class="description">
          <small>{{ t('common.shop.detail.about') }}</small>
          <h2>{{ t('common.shop.detail.productDetails') }}</h2>
          <p>{{ description }}</p>
          <dl>
            <div>
              <dt>SKU</dt>
              <dd>{{ product.sku }}</dd>
            </div>
            <div>
              <dt>{{ t('common.shop.editor.brand') }}</dt>
              <dd>{{ product.brand }}</dd>
            </div>
            <div>
              <dt>{{ t('common.shop.editor.category') }}</dt>
              <dd>{{ t(`common.shop.categories.${product.category}`) }}</dd>
            </div>
          </dl>
        </section>
      </main>
      <p v-if="actionMessage" class="action-message" role="status">
        {{ actionMessage }}
      </p>
      <footer class="purchase-bar">
        <div class="quantity">
          <button
            type="button"
            :aria-label="t('common.shop.detail.decreaseQuantity')"
            @click="quantity = Math.max(1, quantity - 1)"
          >
            −</button
          ><span>{{ quantity }}</span
          ><button
            type="button"
            :aria-label="t('common.shop.detail.increaseQuantity')"
            @click="quantity = Math.min(product.stock, quantity + 1)"
          >
            ＋
          </button>
        </div>
        <button type="button" @click="addToCart">
          {{ t('common.shop.detail.addCart') }}</button
        ><button class="buy" type="button" @click="showBuyAction">
          {{ t('common.shop.detail.buyNow') }}
        </button>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { getProduct } from '@/api/modules/products';
import { useCartStore } from '@/store/modules/cart';
import {
  formatProductPrice,
  getLocalizedText,
  getSafeProductImage,
} from '@/utils/product';

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const cart = useCartStore();
const productId = computed(() => Number(route.params.id));
const productQuery = useQuery({
  queryKey: computed(() => ['products', productId.value]),
  queryFn: ({ signal }) => getProduct(productId.value, signal),
  enabled: computed(
    () => Number.isInteger(productId.value) && productId.value > 0,
  ),
});
const product = computed(() => productQuery.data.value);
const name = computed(() =>
  product.value ? getLocalizedText(product.value.name, locale.value) : '',
);
const subtitle = computed(() =>
  product.value ? getLocalizedText(product.value.subtitle, locale.value) : '',
);
const description = computed(() =>
  product.value
    ? getLocalizedText(product.value.description, locale.value)
    : '',
);
const quantity = ref(1);
const actionMessage = ref('');
const addToCart = () => {
  if (!product.value) return;
  cart.add(product.value, quantity.value);
  actionMessage.value = t('common.shop.detail.cartAdded', {
    count: quantity.value,
  });
};
const showBuyAction = () => {
  actionMessage.value = t('common.shop.detail.checkoutDemo', {
    count: quantity.value,
  });
};
</script>

<style scoped lang="scss">
.product-detail {
  min-height: 100%;
  padding-bottom: calc(5rem + env(safe-area-inset-bottom));
  background: var(--color-background);
}

.product-media {
  position: relative;
  max-width: var(--content-max-width);
  aspect-ratio: 1.6;
  margin: 0 auto;
  overflow: hidden;
  background: var(--color-surface);
}

.product-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-media button {
  position: absolute;
  top: calc(16px + env(safe-area-inset-top));
  left: 18px;
  width: var(--touch-target);
  min-height: var(--touch-target);
  font-size: 1.75rem;
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.product-media > span {
  position: absolute;
  right: var(--space-4);
  bottom: var(--space-4);
  padding: 0.25rem 0.5rem;
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  border-radius: var(--radius-sm);
}

main {
  width: min(100%, var(--content-max-width));
  margin: 0 auto;
}

.product-summary,
.description {
  padding: var(--space-6);
  background: var(--color-surface);
}

.product-summary small,
.description small {
  font-size: var(--text-caption);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.product-summary h1 {
  margin: var(--space-2) 0;
  font-size: var(--text-page-title);
  font-weight: 680;
  line-height: 1.25;
}

.product-summary p,
.description p {
  margin: 0;
  line-height: 1.65;
  color: var(--color-text-secondary);
}

.price {
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
  margin-top: var(--space-5);
}

.price strong {
  font-size: 1.5rem;
  color: var(--color-text);
}

.price del {
  color: var(--color-text-secondary);
}

.commerce-meta,
.service-strip {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-4);
  font-size: var(--text-secondary);
  color: var(--color-text-secondary);
}

.service-strip {
  justify-content: space-between;
  width: min(100%, var(--content-max-width));
  padding: var(--space-3) var(--space-6);
  margin: 1px auto;
  background: var(--color-background-soft);
}

.description {
  margin-top: 1px;
}

.description h2 {
  margin: var(--space-1) 0 var(--space-3);
  font-size: var(--text-section-title);
}

dl {
  margin: var(--space-5) 0 0;
}

dl div {
  display: flex;
  justify-content: space-between;
  padding: var(--space-3) 0;
  border-top: 1px solid var(--color-border);
}

dt {
  color: var(--color-text-secondary);
}

dd {
  margin: 0;
}

.purchase-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: auto minmax(8rem, 16rem) minmax(8rem, 16rem);
  gap: var(--space-2);
  justify-content: center;
  padding: var(--space-2) var(--space-4)
    calc(var(--space-2) + env(safe-area-inset-bottom));
  background: color-mix(in srgb, var(--color-surface) 96%, transparent);
  border-top: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.purchase-bar > button {
  min-height: var(--touch-target);
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.purchase-bar > .buy {
  color: var(--color-primary-contrast);
  background: var(--color-primary);
}

.quantity {
  display: grid;
  grid-template-columns: repeat(3, 38px);
  align-items: center;
  text-align: center;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.quantity button {
  min-height: var(--touch-target);
  color: var(--color-text);
  background: transparent;
  border: 0;
}

.action-message {
  position: fixed;
  right: var(--space-4);
  bottom: calc(4.5rem + env(safe-area-inset-bottom));
  left: var(--space-4);
  z-index: 22;
  max-width: 30rem;
  padding: var(--space-2) var(--space-3);
  margin: 0 auto;
  color: var(--color-primary-contrast);
  text-align: center;
  background: var(--color-text);
  border-radius: var(--radius-md);
}

.detail-state {
  display: grid;
  gap: var(--space-4);
  place-content: center;
  min-height: 70dvh;
  text-align: center;
}

@media (max-width: 560px) {
  .product-media {
    aspect-ratio: 1.15;
  }

  .product-summary,
  .description {
    padding: var(--space-5);
  }

  .service-strip {
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    overflow-x: auto;
    white-space: nowrap;
  }

  .purchase-bar {
    grid-template-columns: auto 1fr 1fr;
  }
}
</style>
