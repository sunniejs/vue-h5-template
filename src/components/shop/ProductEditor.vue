<template>
  <form class="product-editor" autocomplete="off" @submit.prevent="submit">
    <header>
      <div>
        <small>{{
          product
            ? t('common.shop.editor.editEyebrow')
            : t('common.shop.editor.createEyebrow')
        }}</small>
        <h2>
          {{
            product
              ? t('common.shop.editor.editTitle')
              : t('common.shop.editor.createTitle')
          }}
        </h2>
      </div>
      <button
        type="button"
        :aria-label="t('common.shop.editor.cancel')"
        @click="emit('cancel')"
      >
        ×
      </button>
    </header>

    <div class="form-grid form-grid--two">
      <label
        ><span>SKU</span><input v-model.trim="form.sku" required maxlength="64"
      /></label>
      <label
        ><span>{{ t('common.shop.editor.brand') }}</span
        ><input v-model.trim="form.brand" required maxlength="80"
      /></label>
      <label
        ><span>{{ t('common.shop.editor.category') }}</span>
        <select v-model="form.category" required>
          <option v-for="item in categories" :key="item" :value="item">
            {{ t(`common.shop.categories.${item}`) }}
          </option>
        </select>
      </label>
      <label
        ><span>{{ t('common.shop.editor.status') }}</span>
        <select v-model="form.status" required>
          <option value="draft">{{ t('common.shop.status.draft') }}</option>
          <option value="on_sale">{{ t('common.shop.status.on_sale') }}</option>
          <option value="sold_out">
            {{ t('common.shop.status.sold_out') }}
          </option>
        </select>
      </label>
    </div>

    <section class="locale-section">
      <div
        class="locale-tabs"
        role="tablist"
        :aria-label="t('common.shop.editor.contentLanguage')"
      >
        <button
          v-for="item in localeTabs"
          :key="item.value"
          type="button"
          role="tab"
          :aria-selected="activeLocale === item.value"
          :class="{ active: activeLocale === item.value }"
          @click="activeLocale = item.value"
        >
          {{ item.label }}
        </button>
      </div>
      <label
        ><span>{{ t('common.shop.editor.name') }}</span
        ><input v-model.trim="form.name[activeLocale]" required maxlength="180"
      /></label>
      <label
        ><span>{{ t('common.shop.editor.subtitle') }}</span
        ><input
          v-model.trim="form.subtitle[activeLocale]"
          required
          maxlength="240"
      /></label>
      <label
        ><span>{{ t('common.shop.editor.description') }}</span
        ><textarea
          v-model.trim="form.description[activeLocale]"
          required
          maxlength="10000"
          rows="4"
        />
      </label>
    </section>

    <label
      ><span>{{ t('common.shop.editor.coverUrl') }}</span
      ><input
        v-model.trim="form.coverUrl"
        required
        maxlength="500"
        placeholder="/products/product-placeholder.svg"
    /></label>
    <div class="form-grid form-grid--two">
      <label
        ><span>{{ t('common.shop.editor.price') }}</span
        ><input
          v-model.number="form.price"
          type="number"
          required
          min="0"
          step="0.01"
          inputmode="decimal"
      /></label>
      <label
        ><span>{{ t('common.shop.editor.originalPrice') }}</span
        ><input
          v-model.number="form.originalPrice"
          type="number"
          required
          min="0"
          step="0.01"
          inputmode="decimal"
      /></label>
      <label
        ><span>{{ t('common.shop.editor.stock') }}</span
        ><input
          v-model.number="form.stock"
          type="number"
          required
          min="0"
          step="1"
          inputmode="numeric"
      /></label>
      <label
        ><span>{{ t('common.shop.editor.sales') }}</span
        ><input
          v-model.number="form.sales"
          type="number"
          required
          min="0"
          step="1"
          inputmode="numeric"
      /></label>
      <label
        ><span>{{ t('common.shop.editor.rating') }}</span
        ><input
          v-model.number="form.rating"
          type="number"
          required
          min="0"
          max="5"
          step="0.1"
          inputmode="decimal"
      /></label>
      <label class="checkbox"
        ><input v-model="form.featured" type="checkbox" /><span>{{
          t('common.shop.editor.featured')
        }}</span></label
      >
    </div>

    <p v-if="validationError" class="form-error" role="alert">
      {{ validationError }}
    </p>
    <footer>
      <button type="button" @click="emit('cancel')">
        {{ t('common.shop.editor.cancel') }}</button
      ><button class="primary" type="submit" :disabled="saving">
        {{
          saving ? t('common.shop.editor.saving') : t('common.shop.editor.save')
        }}
      </button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  LocalizedText,
  Product,
  ProductInput,
  ProductStatus,
} from '@/api/modules/products';

type LocaleKey = keyof LocalizedText;
interface EditorForm {
  sku: string;
  name: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  category: string;
  brand: string;
  coverUrl: string;
  price: number;
  originalPrice: number;
  stock: number;
  sales: number;
  rating: number;
  status: ProductStatus;
  featured: boolean;
}

const props = defineProps<{ product?: Product | null; saving?: boolean }>();
const emit = defineEmits<{ save: [value: ProductInput]; cancel: [] }>();
const { t } = useI18n();
const localeTabs: Array<{ value: LocaleKey; label: string }> = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' },
];
const locales = localeTabs.map((item) => item.value);
const categories = ['digital', 'lifestyle', 'home', 'outdoor'] as const;
const activeLocale = ref<LocaleKey>('zh-CN');
const validationError = ref('');
const emptyLocalized = (): LocalizedText => ({
  'zh-CN': '',
  'en-US': '',
  'ja-JP': '',
});
const blankForm = (): EditorForm => ({
  sku: '',
  name: emptyLocalized(),
  subtitle: emptyLocalized(),
  description: emptyLocalized(),
  category: 'digital',
  brand: '',
  coverUrl: '/products/product-placeholder.svg',
  price: 0,
  originalPrice: 0,
  stock: 0,
  sales: 0,
  rating: 5,
  status: 'draft',
  featured: false,
});
const form = reactive<EditorForm>(blankForm());

watch(
  () => props.product,
  (product) => {
    const value = product
      ? {
          sku: product.sku,
          name: { ...product.name },
          subtitle: { ...product.subtitle },
          description: { ...product.description },
          category: product.category,
          brand: product.brand,
          coverUrl: product.coverUrl,
          price: product.priceCents / 100,
          originalPrice: product.originalPriceCents / 100,
          stock: product.stock,
          sales: product.sales,
          rating: product.rating,
          status: product.status,
          featured: product.featured,
        }
      : blankForm();
    Object.assign(form, value);
    validationError.value = '';
    activeLocale.value = 'zh-CN';
  },
  { immediate: true },
);

const submit = () => {
  const localizedComplete = locales.every(
    (locale) =>
      form.name[locale] && form.subtitle[locale] && form.description[locale],
  );
  if (!localizedComplete) {
    validationError.value = t('common.shop.editor.translationRequired');
    return;
  }
  validationError.value = '';
  emit('save', {
    sku: form.sku,
    name: { ...form.name },
    subtitle: { ...form.subtitle },
    description: { ...form.description },
    category: form.category,
    brand: form.brand,
    coverUrl: form.coverUrl,
    priceCents: Math.round(form.price * 100),
    originalPriceCents: Math.round(form.originalPrice * 100),
    stock: Math.trunc(form.stock),
    sales: Math.trunc(form.sales),
    rating: form.rating,
    status: form.status,
    featured: form.featured,
  });
};
</script>

<style scoped lang="scss">
.product-editor {
  display: grid;
  gap: var(--space-5);
  width: min(100%, 47.5rem);
  max-height: min(92dvh, 60rem);
  padding: var(--space-6);
  overflow: auto;
  background: var(--color-surface);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: var(--shadow-dialog);
}

header,
footer,
.locale-tabs {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
}

header {
  small {
    font-size: var(--text-caption);
    font-weight: 650;
    color: var(--color-text-secondary);
  }

  h2 {
    margin: var(--space-1) 0 0;
    font-size: var(--text-section-title);
  }

  > button {
    width: var(--touch-target);
    min-height: var(--touch-target);
    font-size: 1.5rem;
    background: transparent;
    border: 0;
  }
}

.form-grid {
  display: grid;
  gap: var(--space-4);
}

.form-grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

label {
  display: grid;
  gap: var(--space-2);
  font-size: var(--text-secondary);
  font-weight: 600;
}

input,
select,
textarea {
  width: 100%;
  min-height: var(--touch-target);
  padding: 0.625rem var(--space-3);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
}

textarea {
  resize: vertical;
}

.locale-section {
  display: grid;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.locale-tabs {
  justify-content: flex-start;
}

.locale-tabs button {
  min-height: 2.25rem;
  padding: 0 var(--space-2);
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid var(--color-border);
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 0;
}

.locale-tabs button.active {
  font-weight: 600;
  color: var(--color-text);
  background: transparent;
  border-bottom-color: var(--color-primary);
}

.checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: end;
  min-height: var(--touch-target);
}

.checkbox input {
  width: 1.125rem;
  min-height: 1.125rem;
}

.form-error {
  margin: 0;
  color: var(--color-danger);
}

footer {
  position: sticky;
  bottom: calc(var(--space-6) * -1);
  padding: var(--space-4) 0 calc(var(--space-1) + env(safe-area-inset-bottom));
  background: var(--color-surface);
}

footer button {
  min-height: var(--touch-target);
  padding: 0 var(--space-4);
  color: var(--color-text);
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

footer .primary {
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  border-color: var(--color-primary);
}

@media (max-width: 480px) {
  .form-grid--two {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .product-editor {
    margin: auto;
    border-radius: var(--radius-lg);
  }
}
</style>
