<template>
  <nut-swiper :init-page="page" :pagination-visible="true" pagination-color="#426543" auto-play="3000">
    <nut-swiper-item>
      <img src="//img10.360buyimg.com/n2/s400x400_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg" alt="" />
    </nut-swiper-item>
  </nut-swiper>

  <section class="info">
    <div>
      <span class="price">
        ￥<em>{{ state.price }}.00</em>
      </span>
    </div>
    <div>
      <span>{{ state.title }}}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
  const page = ref(1);

  let state = reactive({
    imgUrl: '//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg',
    title: '【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水',
    price: '388',
    vipPrice: '378',
    shopDesc: '自营',
    delivery: '厂商配送',
    shopName: '阳澄湖大闸蟹自营店>',
  });
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
      color: #f2270c;
      display: inline-block;
      font-size: 32px;
      em {
        font-size: 56px;
        font-style: normal;
      }
    }
  }
</style>
