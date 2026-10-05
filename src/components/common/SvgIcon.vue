<template>
  <svg class="svg-icon" :aria-hidden="!title" :role="title ? 'img' : undefined">
    <title v-if="title">{{ title }}</title>
    <use :href="symbolId" />
  </svg>
</template>

<script setup>
  import { computed } from 'vue';
  const props = defineProps({ name: { type: String, required: true }, title: String });
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
