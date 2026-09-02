<template>
  <article class="product-card">
    <RouterLink class="product-card__link" :to="`/shop/products/${product.id}`">
      <span class="product-card__media">
        <img
          :src="getSafeProductImage(product.coverUrl)"
          :alt="name"
          loading="lazy"
        />
        <small v-if="product.featured">{{ t('common.shop.featured') }}</small>
      </span>
      <span class="product-card__content">
        <small
          >{{ product.brand }} ·
          {{ t(`common.shop.categories.${product.category}`) }}</small
        >
        <b>{{ name }}</b>
        <span>{{ subtitle }}</span>
        <span class="product-card__rating"
          >★ {{ product.rating.toFixed(1) }} ·
          {{ t('common.shop.sales', { count: product.sales }) }}</span
        >
      </span>
    </RouterLink>
    <footer>
      <span class="product-card__price">
        <strong>{{ formatProductPrice(product.priceCents, locale) }}</strong>
        <del v-if="product.originalPriceCents > product.priceCents">{{
          formatProductPrice(product.originalPriceCents, locale)
        }}</del>
      </span>
      <button
        type="button"
        :aria-label="t('common.shop.addToCartLabel', { name })"
        @click="emit('add-to-cart', product)"
      >
        <SvgIcon name="cart" />
      </button>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Product } from '@/api/modules/products';
import {
  formatProductPrice,
  getLocalizedText,
  getSafeProductImage,
} from '@/utils/product';

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ 'add-to-cart': [product: Product] }>();
const { locale, t } = useI18n();
const name = computed(() => getLocalizedText(props.product.name, locale.value));
const subtitle = computed(() =>
  getLocalizedText(props.product.subtitle, locale.value),
);
</script>

<style scoped lang="scss">
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-text);
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color var(--motion-fast) ease;

  &:hover {
    border-color: var(--color-border-strong);
  }
}

.product-card__link {
  display: block;
  flex: 1;
  color: inherit;
  text-decoration: none;
}

.product-card__media {
  position: relative;
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-background-soft);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity var(--motion-base) ease;
  }

  small {
    position: absolute;
    top: var(--space-2);
    left: var(--space-2);
    padding: 0.125rem 0.375rem;
    font-size: var(--text-caption);
    font-weight: 600;
    color: var(--color-primary-contrast);
    background: var(--color-primary);
    border-radius: var(--radius-sm);
  }
}

.product-card:hover img {
  opacity: 0.92;
}

.product-card__content {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);

  > small,
  > span {
    color: var(--color-text-secondary);
  }

  > small {
    font-size: var(--text-caption);
  }

  > b {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: var(--text-card-title);
    font-weight: 650;
    line-height: 1.35;
    -webkit-box-orient: vertical;
  }

  > span:not(.product-card__price) {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: var(--text-secondary);
    line-height: 1.4;
    -webkit-box-orient: vertical;
  }

  .product-card__rating {
    margin-top: var(--space-1);
    color: var(--color-warning);
  }
}

.product-card__price {
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
  margin-top: var(--space-2);

  strong {
    font-size: 1rem;
    color: var(--color-text);
  }

  del {
    font-size: var(--text-caption);
  }
}

footer {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: space-between;
  min-height: calc(var(--touch-target) + var(--space-2));
  padding: 0 var(--space-3) var(--space-2);

  .product-card__price {
    min-width: 0;
    margin-top: 0;
  }

  button {
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    width: var(--touch-target);
    min-height: var(--touch-target);
    color: var(--color-primary-contrast);
    background: var(--color-primary);
    border: 0;
    border-radius: var(--radius-md);

    .svg-icon {
      font-size: 1rem;
    }
  }
}
</style>
