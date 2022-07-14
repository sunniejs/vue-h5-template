<template>
  <nut-navbar :left-show="false" :title="$t($route.meta.title)" />
  <div class="main-page">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="$route.path" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="$route.path" />
    <!-- <RouterView v-slot="{ Component }" v-if="$route.meta.keepAlive">
      <keep-alive>
        <component :is="Component" :key="$route.path" />
      </keep-alive>
    </RouterView>
    <RouterView v-if="!$route.meta.keepAlive" :key="$route.path" /> -->
  </div>
  <nut-tabbar unactive-color="#364636" active-color="#1989fa" @tab-switch="tabSwitch" bottom>
    <nut-tabbar-item :tab-title="$t('tabbar.home')" icon="home" />
    <nut-tabbar-item :tab-title="$t('tabbar.list')" icon="horizontal" />
    <nut-tabbar-item :tab-title="$t('tabbar.member')" icon="my" />
    <nut-tabbar-item :tab-title="$t('tabbar.demo')" icon="location" />
  </nut-tabbar>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const tabSwitch = (_item, index) => {
    switch (index) {
      case 0:
        router.push('/home');
        break;
      case 1:
        router.push('/list');
        break;
      case 2:
        router.push('/member');
        break;
      case 3:
        router.push('/demo');
    }
  };
</script>

<style scoped lang="scss">
  .nut-navbar {
    margin-bottom: 0;
  }

  .main-page {
    box-sizing: border-box;
    padding: 40px;
    height: calc(100vh - 88px);
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
