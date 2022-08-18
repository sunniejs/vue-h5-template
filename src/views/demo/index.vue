<template>
  <section>
    <span class="title">varlet</span>
    <var-space :size="[10, 10]">
      <var-button>demo</var-button><var-button type="primary">主要按钮</var-button>
      <var-button type="info">信息按钮</var-button>
      <var-button type="success">成功按钮</var-button>
      <var-button type="warning">警告按钮</var-button>
      <var-button type="danger">危险按钮</var-button>
    </var-space>
  </section>
  <section>
    <span class="title">vant</span>
    <div class="demo">
      <van-button type="primary">主要按钮</van-button>
      <van-button type="success">成功按钮</van-button>
      <van-button type="default">默认按钮</van-button>
      <van-button type="warning">警告按钮</van-button>
      <van-button type="danger">危险按钮</van-button>
    </div>
  </section>
  <section>
    <span class="title">nutUI</span>
    <div class="demo">
      <nut-button type="primary">主要按钮</nut-button>
      <nut-button type="info">信息按钮</nut-button>
      <nut-button type="default">默认按钮</nut-button>
      <nut-button type="danger">危险按钮</nut-button>
      <nut-button type="warning">警告按钮</nut-button>
      <nut-button type="success">成功按钮</nut-button>
    </div>
  </section>
  <section>
    <div :class="['btn-add', i18n.global.locale]"></div>
  </section>
</template>

<script setup name="DemoPage">
  import { i18n } from '/@/i18n';
  // import { useI18n } from 'vue-i18n';
  // const { locale } = useI18n();
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';
  section {
    .title {
      margin-bottom: 40px;
      display: inline-block;
    }
    &:nth-child(2) {
      .title {
        margin-top: 20px;
      }
    }
  }
  .demo {
    > :nth-child(n) {
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
</style>
