<!-- ListEmpty.vue -->
<template>
  <div class="list-empty">
    <slot name='emptyImg'></slot>
    <div class="empty-tips">{{tips}}</div>
  </div>
</template>
<script>
export default {
  name: 'ListEmpty',
  props: {
    tips: {
      type: String,
      default: ''
    }
  },
}

</script>
<style lang='scss' scoped>
.list-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 55px;
  .empty-tips {
    color: #999999;
    font-size: 17px;
    line-height: 24px;
    padding-top: 35px;
  }
}
</style>
