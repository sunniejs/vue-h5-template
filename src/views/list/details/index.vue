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
      <span>{{ details.data?.title }}}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { detailsData } from '../data';
  const router = useRouter();
  const page = ref(1);

  let details = reactive<any>({ data: {} });

  watch(
    () => router,
    (val) => {
      details.data = detailsData.find((_item, index) => index == parseInt(val.currentRoute.value.query.id as string));
    },
    { deep: true, immediate: true },
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
