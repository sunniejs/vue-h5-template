<template>
  <div class="main-page">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <nut-tabbar unactive-color="#364636" active-color="#1989fa" @tab-switch="tabSwitch" bottom>
    <nut-tabbar-item :tab-title="$t('tabbar.home')" font-class-name="iconfont" class-prefix="icon" icon="home" />
    <nut-tabbar-item :tab-title="$t('tabbar.list')" font-class-name="iconfont" class-prefix="icon" icon="list" />
    <nut-tabbar-item :tab-title="$t('tabbar.member')" font-class-name="iconfont" class-prefix="icon" icon="member" />
  </nut-tabbar>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const tabSwitch = (item, index) => {
    console.log(item, index);
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
    }
  };
</script>

<style scoped lang="scss">
  .main-page {
    height: calc(100vh - 50px);
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
