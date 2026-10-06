<template>
  <svg class="svg-icon" :aria-hidden="title ? null : 'true'" :role="title ? 'img' : null">
    <title v-if="title">{{ title }}</title>
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script>
import icons from '@/assets/icons.svg'

export default {
  props: {
    name: { type: String, required: true },
    title: String
  },
  computed: {
    symbolId() {
      return `${icons}#icon-${this.name}`
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  fill: currentcolor;
}
</style>
