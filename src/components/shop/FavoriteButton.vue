<script setup lang="ts">
import { computed, onScopeDispose, ref, useId, watch } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  getProductFavorite,
  setProductFavorite,
} from '@/api/modules/favorites';
const props = defineProps<{ productId: number; session: string }>();
const { t } = useI18n();
const scope = useId();
const generation = ref(0);
const client = useQueryClient();
let disposed = false;
onScopeDispose(() => {
  disposed = true;
});
const key = computed(() => [
  'favorite',
  scope,
  generation.value,
  props.productId,
]);
const favorite = useQuery({
  queryKey: key,
  enabled: computed(
    () =>
      !!props.session &&
      Number.isSafeInteger(props.productId) &&
      props.productId > 0,
  ),
  queryFn: ({ signal }) => getProductFavorite(props.productId, signal),
  retry: false,
});
const mutation = useMutation({
  mutationFn: (input: {
    id: number;
    favorite: boolean;
    key: readonly unknown[];
  }) => setProductFavorite(input.id, input.favorite),
  onSuccess: (data, input) => {
    if (
      disposed ||
      !input.key.every((entry, index) => entry === key.value[index])
    )
      return;
    client.setQueryData(input.key, data);
  },
});
watch(
  () => props.session,
  () => {
    generation.value++;
    mutation.reset();
  },
  { flush: 'sync' },
);
watch(
  () => props.productId,
  () => mutation.reset(),
);
function toggle() {
  if (
    !favorite.data.value ||
    favorite.isFetching.value ||
    mutation.isPending.value
  )
    return;
  mutation.mutate({
    id: props.productId,
    favorite: !favorite.data.value.favorite,
    key: [...key.value],
  });
}
</script>
<template>
  <div class="favorite-control">
    <RouterLink v-if="!session" to="/login">{{
      t('common.shop.favoriteLogin')
    }}</RouterLink>
    <template v-else>
      <button
        v-if="favorite.isError.value"
        type="button"
        @click="favorite.refetch()"
      >
        {{ t('common.global.retry') }}
      </button>
      <button
        v-else
        type="button"
        :aria-pressed="favorite.data.value?.favorite ?? false"
        :disabled="
          !favorite.data.value ||
          favorite.isFetching.value ||
          mutation.isPending.value
        "
        @click="toggle"
      >
        {{
          t(
            favorite.data.value?.favorite
              ? 'common.shop.unfavorite'
              : 'common.shop.favorite',
          )
        }}
      </button>
      <p v-if="favorite.isError.value || mutation.isError.value" role="alert">
        {{ t('common.shop.favoriteFailed') }}
      </p>
    </template>
  </div>
</template>
<style scoped>
.favorite-control {
  margin-block: var(--space-4);
}

.favorite-control button,
.favorite-control a {
  display: inline-flex;
  align-items: center;
  min-height: var(--touch-target);
  padding: var(--space-2) var(--space-3);
  color: inherit;
  background: transparent;
  border: 1px solid currentcolor;
  border-radius: var(--radius-md);
}

.favorite-control button:disabled {
  opacity: 0.5;
}

.favorite-control :focus-visible {
  outline: 2px solid currentcolor;
  outline-offset: 2px;
}
</style>
