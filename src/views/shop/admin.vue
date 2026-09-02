<template>
  <div class="admin-page page">
    <header>
      <div>
        <small>{{ t('common.shop.admin.eyebrow') }}</small>
        <h1>{{ t('common.shop.admin.title') }}</h1>
        <p>{{ t('common.shop.admin.description') }}</p>
      </div>
      <button type="button" @click="openCreate">
        ＋ {{ t('common.shop.admin.create') }}
      </button>
    </header>
    <section class="summary-grid">
      <article>
        <small>{{ t('common.shop.admin.total') }}</small
        ><strong>{{ productsQuery.data.value?.total ?? 0 }}</strong>
      </article>
      <article>
        <small>{{ t('common.shop.admin.onSale') }}</small
        ><strong>{{ onSaleCount }}</strong>
      </article>
      <article>
        <small>{{ t('common.shop.admin.lowStock') }}</small
        ><strong>{{ lowStockCount }}</strong>
      </article>
    </section>
    <div class="filters">
      <input
        v-model.trim="keyword"
        type="search"
        autocomplete="off"
        :placeholder="t('common.shop.admin.searchPlaceholder')"
      /><select v-model="status">
        <option value="">{{ t('common.shop.admin.allStatus') }}</option>
        <option value="draft">{{ t('common.shop.status.draft') }}</option>
        <option value="on_sale">{{ t('common.shop.status.on_sale') }}</option>
        <option value="sold_out">{{ t('common.shop.status.sold_out') }}</option>
      </select>
    </div>
    <p v-if="mutationError" class="error-message" role="alert">
      {{ mutationError }}
    </p>
    <section v-if="productsQuery.isPending.value" class="state-card">
      {{ t('common.global.loading') }}
    </section>
    <section
      v-else-if="productsQuery.isError.value"
      class="state-card"
      role="alert"
    >
      {{ productsQuery.error.value?.message }}
    </section>
    <section v-else class="admin-list">
      <article v-for="product in products" :key="product.id">
        <img
          :src="getSafeProductImage(product.coverUrl)"
          :alt="getLocalizedText(product.name, locale)"
        />
        <div class="product-info">
          <span
            ><i :class="`status--${product.status.replace('_', '-')}`" />{{
              t(`common.shop.status.${product.status}`)
            }}</span
          >
          <h2>{{ getLocalizedText(product.name, locale) }}</h2>
          <p>{{ product.sku }} · {{ product.brand }}</p>
          <div>
            <strong>{{ formatProductPrice(product.priceCents, locale) }}</strong
            ><small
              >{{ t('common.shop.stock', { count: product.stock }) }} ·
              {{ t('common.shop.sales', { count: product.sales }) }}</small
            >
          </div>
        </div>
        <div class="row-actions">
          <button type="button" @click="openEdit(product)">
            {{ t('common.shop.admin.edit') }}</button
          ><button class="danger" type="button" @click="remove(product)">
            {{ t('common.shop.admin.delete') }}
          </button>
        </div>
      </article>
      <p v-if="!products.length" class="state-card">
        {{ t('common.shop.admin.empty') }}
      </p>
    </section>
    <div
      v-if="editorOpen"
      class="editor-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="t('common.shop.admin.editorLabel')"
      @click.self="closeEditor"
    >
      <ProductEditor
        :product="selectedProduct"
        :saving="saveMutation.isPending.value"
        @save="save"
        @cancel="closeEditor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from '@/api/modules/products';
import type {
  Product,
  ProductInput,
  ProductStatus,
} from '@/api/modules/products';
import { isApiError } from '@/types/api/common';
import {
  formatProductPrice,
  getLocalizedText,
  getSafeProductImage,
} from '@/utils/product';

const { locale, t } = useI18n();
const queryClient = useQueryClient();
const keyword = ref('');
const status = ref<'' | ProductStatus>('');
const editorOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const mutationError = ref('');
const queryKey = computed(() => [
  'admin-products',
  { keyword: keyword.value, status: status.value },
]);
const productsQuery = useQuery({
  queryKey,
  queryFn: ({ signal }) =>
    getAdminProducts(
      {
        page: 1,
        pageSize: 50,
        keyword: keyword.value || undefined,
        status: status.value || undefined,
      },
      signal,
    ),
});
const products = computed(() => productsQuery.data.value?.list ?? []);
const onSaleCount = computed(
  () => products.value.filter((item) => item.status === 'on_sale').length,
);
const lowStockCount = computed(
  () => products.value.filter((item) => item.stock < 20).length,
);
const refresh = () =>
  queryClient.invalidateQueries({ queryKey: ['admin-products'] });
const showError = (error: unknown) => {
  mutationError.value = isApiError(error)
    ? error.message
    : t('common.shop.admin.operationFailed');
};
const saveMutation = useMutation({
  mutationFn: (input: ProductInput) =>
    selectedProduct.value
      ? updateProduct(selectedProduct.value.id, input)
      : createProduct(input),
  onSuccess: async () => {
    await refresh();
    closeEditor();
  },
  onError: showError,
});
const deleteMutation = useMutation({
  mutationFn: deleteProduct,
  onSuccess: () => refresh(),
  onError: showError,
});
const openCreate = () => {
  selectedProduct.value = null;
  mutationError.value = '';
  editorOpen.value = true;
};
const openEdit = (product: Product) => {
  selectedProduct.value = product;
  mutationError.value = '';
  editorOpen.value = true;
};
const closeEditor = () => {
  editorOpen.value = false;
  selectedProduct.value = null;
};
const save = (input: ProductInput) => {
  mutationError.value = '';
  saveMutation.mutate(input);
};
const remove = (product: Product) => {
  // 跨 UI 框架的简单删除确认，使用原生 confirm 避免引入框架耦合
  if (
    // oxlint-disable-next-line no-alert
    window.confirm(
      t('common.shop.admin.deleteConfirm', {
        name: getLocalizedText(product.name, locale.value),
      }),
    )
  )
    deleteMutation.mutate(product.id);
};
</script>

<style scoped lang="scss">
.admin-page > header {
  display: flex;
  gap: var(--space-5);
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) 0 var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

header small {
  font-size: var(--text-caption);
  font-weight: 650;
  color: var(--color-text-secondary);
  letter-spacing: 0.1em;
}

header h1 {
  margin: var(--space-1) 0 var(--space-2);
  font-size: var(--text-page-title);
  font-weight: 680;
}

header p {
  max-width: var(--reading-max-width);
  margin: 0;
  color: var(--color-text-secondary);
}

header > button {
  min-height: var(--touch-target);
  padding: 0 var(--space-4);
  font-weight: 600;
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  border: 0;
  border-radius: var(--radius-md);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  margin-top: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.summary-grid article {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4);

  &:not(:last-child) {
    border-right: 1px solid var(--color-border);
  }
}

.summary-grid small {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

.summary-grid strong {
  font-size: var(--text-section-title);
}

.filters {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-2);
  margin: var(--space-5) 0;
}

.filters input,
.filters select {
  min-height: var(--touch-target);
  padding: 0 var(--space-3);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-color: var(--color-border-strong);
  border-radius: var(--radius-md);
}

.admin-list {
  display: grid;
  gap: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.admin-list article {
  display: grid;
  grid-template-columns: 5rem 1fr auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-3);
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: 0;
  }
}

.admin-list img {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.product-info > span {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

.product-info i {
  display: inline-block;
  width: 0.375rem;
  height: 0.375rem;
  margin-right: var(--space-1);
  background: var(--color-text-muted);
  border-radius: 50%;
}

.product-info i.status--on-sale {
  background: var(--color-success);
}

.product-info i.status--sold-out {
  background: var(--color-danger);
}

.product-info h2 {
  margin: var(--space-1) 0;
  font-size: var(--text-card-title);
  font-weight: 650;
}

.product-info p {
  margin: 0;
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

.product-info > div {
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
  margin-top: var(--space-2);
}

.product-info strong {
  color: var(--color-text);
}

.product-info small {
  color: var(--color-text-secondary);
}

.row-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.row-actions button {
  min-height: 2.25rem;
  padding: 0 var(--space-3);
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.row-actions .danger {
  color: var(--color-danger);
  background: transparent;
}

.state-card,
.error-message {
  padding: var(--space-5);
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.error-message {
  color: var(--color-danger);
}

.editor-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: end;
  justify-content: center;
  background: var(--color-overlay);
  backdrop-filter: blur(4px);
}

@media (max-width: 560px) {
  .admin-page > header {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-list article {
    grid-template-columns: 4rem 1fr;
  }

  .admin-list img {
    width: 4rem;
    height: 4rem;
  }

  .row-actions {
    flex-direction: row;
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}
</style>
