<template>
  <nut-swiper :init-page="page" :pagination-visible="true" pagination-color="#426543" auto-play="3000">
    <nut-swiper-item>
      <img :src="details.data.imgUrl" />
    </nut-swiper-item>
  </nut-swiper>

  <section class="info">
    <div>
      <span class="price">
        ￥<em>{{ details.data?.price }}.00</em>
      </span>
    </div>
    <div>
      <span>{{ details.data?.title }}</span>
    </div>
  </section>

  <!-- 底部固定购买栏 -->
  <div :gutter="4" class="bottom-bar">
    <div class="btn-icon">
      <Dshop color="#fa2c19" />
      <span>店铺</span>
    </div>
    <div class="btn-icon"><Dongdong /> <span>店铺</span></div>
    <div class="btn-icon"><Cart /> <span>店铺</span></div>
    <div class="btn-group">
      <nut-button type="primary"> 加入购物车 </nut-button>
      <nut-button type="warning"> 立即购买 </nut-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { detailsData } from '../data';
  import { Dshop, Dongdong, Cart } from '@nutui/icons-vue';

  const route = useRoute();
  const page = ref(1);

  const details = reactive<any>({ data: {} });

  watch(
    () => route.query.id,
    (id) => {
      const index = Number(id);
      if (!Number.isNaN(index)) {
        details.data = detailsData.find((_item, i) => i === index) ?? {};
      }
    },
    { immediate: true },
  );
</script>

<style lang="scss" scoped>
  .nut-swiper-item {
    line-height: 500px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .info {
    padding: 20px;

    .price {
      display: inline-block;
      font-size: 32px;
      color: #f2270c;
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100px;
    background-color: #fff;
    box-shadow: 0 -2px 8px rgb(0 0 0 / 10%);

    .btn-icon {
      position: relative;
      display: flex;
      flex: 0 0 14%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      user-select: none;

      .nut-icon {
        width: 40px;
        height: 40px;
      }

      span {
        margin-top: 12px;
        font-size: 18px;
      }
    }

    .btn-group {
      display: flex;
      flex: 1;
      justify-content: space-between;

      .nut-button {
        flex: 1;
        padding: 0;
        margin-right: 10px;
      }
    }
  }
</style>
