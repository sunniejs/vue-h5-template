<template>
  <Popup
    :show="props.show"
    @close="$emit('update:show', false)"
    teleport="body"
    :style="`overflow-y: auto;`"
    :close-on-click-overlay="closeOnClickOverlay"
  >
    <div :class="['modal-content', size]">
      <div class="content">
        <slot>内容</slot>
      </div>
      <div class="btn">
        <div class="btn-confirm" @click="$emit('confirm')">{{ $t('btn.confirm') }}</div>
        <div class="btn-cancel" @click="$emit('update:show', false)">{{ $t('btn.cancel') }}</div>
      </div>
    </div>
  </Popup>
</template>
<script lang="ts">
  export default {
    name: 'BasicModal',
  };
</script>
<script setup lang="ts">
  import { Popup } from 'vant';
  import 'vant/es/popup/style/index';

  const props = withDefaults(
    defineProps<{
      show: boolean;
      closeOnClickOverlay?: boolean;
      size?: 'normal' | 'large';
    }>(),
    {
      show: false,
      closeOnClickOverlay: false,
      size: 'large',
    },
  );

  defineEmits<{
    (event: 'confirm'): void;
    (event: 'update:show', data: boolean): void;
  }>();
</script>
<style scoped lang="scss">
  @import './index.scss';
</style>
