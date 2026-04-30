<template>
  <div class="main-page">
    <van-nav-bar :title="$t($route.meta.title as string)" :left-arrow="!tabbarVisible" @click-left="goBack" />
    <div class="main-box" :class="{ tabbar: tabbarVisible, border: showBorder }">
      <RouterView v-slot="{ Component }" v-if="$route.meta.keepAlive">
        <keep-alive>
          <component :is="Component" :key="$route.path" />
        </keep-alive>
      </RouterView>
      <RouterView v-if="!$route.meta.keepAlive" :key="$route.path" />
    </div>
    <nut-tabbar
      unactive-color="#364636"
      active-color="#1989fa"
      v-model="activeTab"
      v-show="tabbarVisible"
      @tab-switch="tabSwitch"
      safe-area-inset-bottom
    >
      <nut-tabbar-item v-for="item in tabItem" :key="item.key" :tab-title="$t(`common.tabbar.${item.key}`)" :icon="item.icon" />
    </nut-tabbar>
  </div>
</template>

<script lang="ts" setup name="BasicLayoutPage">
  import { Home, Horizontal, My, Location } from '@nutui/icons-vue';

  const tabItem = [
    { key: 'home', icon: Home },
    { key: 'list', icon: Horizontal },
    { key: 'member', icon: My },
    { key: 'demo', icon: Location },
  ];

  const router = useRouter();

  const activeTab = ref(0);

  const tabbarVisible = ref(true);

  const showBorder = ref(true);

  const route = useRoute();

  watch(
    () => route.path,
    (path) => {
      const currentKey = path.replace('/', '');
      const judgeRoute = tabItem.some((item) => item.key === currentKey);
      activeTab.value = tabItem.findIndex((item) => item.key === currentKey);
      tabbarVisible.value = judgeRoute;
      showBorder.value = judgeRoute;
    },
    { immediate: true },
  );

  const tabSwitch = (_item: any, index: number) => {
    const tab = tabItem[index];
    if (tab) {
      router.push(`/${tab.key}`);
    }
    activeTab.value = index;
  };

  const goBack = () => {
    router.go(-1);
  };
</script>

<style scoped lang="scss">
  .nut-navbar {
    margin-bottom: 0;
  }

  .main-page {
    display: flex;
    flex-direction: column;
    width: 100dvw;
    height: 100dvh;

    .main-box {
      flex: auto;
      min-height: 0;
      overflow: hidden auto;
    }
  }

  .border {
    padding-right: 30px;
    padding-left: 30px;
  }
</style>
