<template>
  <svg class="svg-icon" :aria-hidden="!title" :role="title ? 'img' : undefined">
    <title v-if="title">{{ title }}</title>
    <use :href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SvgIconName } from '@/types/icon';

const props = defineProps<{ name: SvgIconName; title?: string }>();
const symbolId = computed(() => `#icon-${props.name}`);
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  fill: currentcolor;
}
</style>
