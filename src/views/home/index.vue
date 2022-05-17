<template>
  <nut-navbar :left-show="false" :title="$t('tabbar.home')" />
  <header class="header">
    <img width="30" src="https://v3.cn.vuejs.org/logo.png" />
    <h4 class="intro-title"> Fast-Vue3 </h4>
  </header>
  <p class="intro-header">
    {{ $t('introduction') }}
    <a href="https://github.com/study-vue3/fast-vue3">
      <nut-icon class="github-icon" name="github" />
    </a>
  </p>
  <nut-cell-group :title="$t('home.support')" class="supportList">
    <nut-cell title="Vue3" icon="Check" />
    <nut-cell title="Vue-router" icon="Check" />
    <nut-cell title="Axios" icon="Check" />
    <nut-cell title="Pinia" icon="Check" />
    <nut-cell title="NutUI" icon="Check" />
    <nut-cell title="Vue-i18n" icon="Check" />
    <nut-cell title="Jsx" icon="Check" />
  </nut-cell-group>
  <div class="btn-wrap">
    <nut-button shape="square" size="small" type="default" @click="changeLang('zh-cn')">
      {{ $t('language.zh') }}
    </nut-button>
    <nut-button shape="square" size="small" type="default" @click="changeLang('en-us')">
      {{ $t('language.en') }}
    </nut-button>
  </div>
  {{ getUserInfo }}
  <Tabbar />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { setLang } from '@/i18n';

  const userStore = useUserStore();
  const getUserInfo = computed(() => {
    const { name = '' } = userStore.getUserInfo || {};
    return name;
  });
  const changeLang = (type) => {
    setLang(type);
  };
</script>
<style lang="scss">
  .header {
    display: flex;
    justify-content: center;
    margin: 26px 0 10px;
    padding: 0 20px;
    height: 50px;
    height: 30px;
    font-size: 20px;
  }

  .intro-title {
    text-align: center;
  }

  .intro-header {
    height: 30px;
    font-size: 16px;
    text-align: center;
  }

  .supportList {
    margin: 0 16px;

    .nut-icon {
      color: green;
    }
  }

  .github-icon {
    margin-top: 4px;
    font-size: 24px;
  }

  .btn-wrap {
    margin: 20px;
  }
</style>
