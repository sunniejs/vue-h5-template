<template>
  <div class="page cart-page">
    <header class="page-header">
      <div>
        <small class="eyebrow">{{ t('common.cart.eyebrow') }}</small>
        <h1>{{ t('common.cart.title') }}</h1>
        <p>{{ t('common.cart.description', { count: cart.itemCount }) }}</p>
      </div>
    </header>

    <section v-if="!cart.lines.length" class="cart-empty">
      <SvgIcon name="cart" />
      <h2>{{ t('common.cart.empty') }}</h2>
      <p>{{ t('common.cart.emptyDescription') }}</p>
      <RouterLink class="button-primary" to="/shop">{{
        t('common.cart.browse')
      }}</RouterLink>
    </section>

    <template v-else>
      <section class="cart-list" :aria-label="t('common.cart.items')">
        <article
          v-for="line in cart.lines"
          :key="line.product.id"
          class="cart-line"
        >
          <label class="select-line">
            <input
              :checked="line.selected"
              type="checkbox"
              :aria-label="
                t('common.cart.selectItem', { name: productName(line.product) })
              "
              @change="cart.toggle(line.product.id)"
            />
          </label>
          <RouterLink
            :to="`/shop/products/${line.product.id}`"
            class="cart-line__media"
          >
            <img
              :src="getSafeProductImage(line.product.coverUrl)"
              :alt="productName(line.product)"
            />
          </RouterLink>
          <div class="cart-line__content">
            <RouterLink :to="`/shop/products/${line.product.id}`">{{
              productName(line.product)
            }}</RouterLink>
            <small>{{ line.product.brand }}</small>
            <strong>{{
              formatProductPrice(line.product.priceCents, locale)
            }}</strong>
            <div class="line-actions">
              <div class="quantity-control">
                <button
                  type="button"
                  :aria-label="t('common.shop.detail.decreaseQuantity')"
                  @click="cart.setQuantity(line.product.id, line.quantity - 1)"
                >
                  −
                </button>
                <span>{{ line.quantity }}</span>
                <button
                  type="button"
                  :aria-label="t('common.shop.detail.increaseQuantity')"
                  @click="cart.setQuantity(line.product.id, line.quantity + 1)"
                >
                  ＋
                </button>
              </div>
              <button
                class="remove-line"
                type="button"
                @click="cart.remove(line.product.id)"
              >
                {{ t('common.cart.remove') }}
              </button>
            </div>
          </div>
        </article>
      </section>

      <footer class="cart-summary">
        <label
          ><input
            :checked="cart.allSelected"
            type="checkbox"
            @change="cart.toggleAll"
          />
          {{ t('common.cart.selectAll') }}</label
        >
        <div>
          <small>{{ t('common.cart.total') }}</small
          ><strong>{{ formatProductPrice(cart.selectedTotal, locale) }}</strong>
        </div>
        <button type="button" :disabled="!cart.selectedCount" @click="checkout">
          {{ t('common.cart.checkout', { count: cart.selectedCount }) }}
        </button>
      </footer>
      <p v-if="checkoutMessage" class="checkout-message" role="status">
        {{ checkoutMessage }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Product } from '@/api/modules/products';
import { useCartStore } from '@/store/modules/cart';
import {
  formatProductPrice,
  getLocalizedText,
  getSafeProductImage,
} from '@/utils/product';

const cart = useCartStore();
const { locale, t } = useI18n();
const checkoutMessage = ref('');
const productName = (product: Product) =>
  getLocalizedText(product.name, locale.value);
const checkout = () => {
  checkoutMessage.value = t('common.cart.checkoutDemo', {
    count: cart.selectedCount,
  });
};
</script>

<style scoped lang="scss">
.cart-page {
  padding-bottom: calc(7rem + env(safe-area-inset-bottom));
}

.cart-empty {
  display: grid;
  place-items: center;
  max-width: 28rem;
  padding: var(--space-10) 0;
  margin: 0 auto;
  text-align: center;

  > .svg-icon {
    font-size: 2rem;
    color: var(--color-text-muted);
  }

  h2 {
    margin: var(--space-4) 0 var(--space-2);
    font-size: var(--text-section-title);
  }

  p {
    margin: 0 0 var(--space-5);
    color: var(--color-text-secondary);
  }
}

.cart-list {
  border-top: 1px solid var(--color-border);
}

.cart-line {
  display: grid;
  grid-template-columns: auto 5.5rem 1fr;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
}

.select-line {
  display: grid;
  place-items: center;
  min-width: 1.5rem;
  min-height: var(--touch-target);
}

input[type='checkbox'] {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--color-primary);
}

.cart-line__media {
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cart-line__content {
  display: grid;
  gap: var(--space-1);
  min-width: 0;

  > a {
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 650;
    color: var(--color-text);
    white-space: nowrap;
    text-decoration: none;
  }

  > small {
    color: var(--color-text-secondary);
  }
}

.line-actions {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-2);
}

.quantity-control {
  display: grid;
  grid-template-columns: 2rem 2rem 2rem;
  align-items: center;
  text-align: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);

  button {
    min-height: 2rem;
    color: var(--color-text);
    background: transparent;
    border: 0;
  }
}

.remove-line {
  min-height: 2rem;
  padding: 0;
  color: var(--color-danger);
  background: transparent;
  border: 0;
}

.cart-summary {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 22;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-2) max(var(--space-4), env(safe-area-inset-right))
    calc(var(--space-2) + env(safe-area-inset-bottom));
  background: color-mix(in srgb, var(--color-surface) 96%, transparent);
  border-top: 1px solid var(--color-border);
  backdrop-filter: blur(12px);

  label {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    min-height: var(--touch-target);
  }

  div {
    display: grid;
    justify-content: end;
    text-align: right;

    small {
      color: var(--color-text-secondary);
    }
  }

  button {
    min-height: var(--touch-target);
    padding: 0 var(--space-4);
    font-weight: 650;
    color: var(--color-primary-contrast);
    background: var(--color-primary);
    border: 0;
    border-radius: var(--radius-md);

    &:disabled {
      opacity: 0.45;
    }
  }
}

.checkout-message {
  position: fixed;
  right: var(--space-4);
  bottom: calc(5rem + env(safe-area-inset-bottom));
  left: var(--space-4);
  z-index: 23;
  max-width: 30rem;
  padding: var(--space-2) var(--space-3);
  margin: auto;
  color: var(--color-primary-contrast);
  text-align: center;
  background: var(--color-text);
  border-radius: var(--radius-md);
}

@media (max-width: 420px) {
  .cart-line {
    grid-template-columns: auto 4.75rem 1fr;
    gap: var(--space-2);
  }

  .cart-summary {
    grid-template-columns: auto 1fr;

    > button {
      grid-column: 1 / -1;
    }
  }
}

@media (min-width: 768px) {
  .cart-summary {
    right: max(1.5rem, calc((100vw - var(--content-max-width)) / 2));
    bottom: var(--space-4);
    left: max(1.5rem, calc((100vw - var(--content-max-width)) / 2));
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }
}
</style>
