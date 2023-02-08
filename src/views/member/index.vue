<template>
  <div class="avatar-wrap">
    <nut-avatar class="avatar" size="large">
      <img src="https://img12.360buyimg.com/imagetools/jfs/t1/143702/31/16654/116794/5fc6f541Edebf8a57/4138097748889987.png" />
    </nut-avatar>
    <div class="member-detail">
      <p class="nickname"> 昵称<nut-button shape="square" size="small" type="default" @click="goLogin"> 去登录 </nut-button> </p>
      <p class="info"> 个人其他信息，后续补充.... </p>
    </div>
  </div>
  <nut-grid direction="vertical">
    <nut-grid-item v-for="item in 10" :key="item" text="文字"><Dongdong /></nut-grid-item>
  </nut-grid>
</template>

<script lang="ts" setup name="MemberPage">
  // import { useUserStore } from '@/store/modules/user';
  import { useRouter } from 'vue-router';
  import { Dongdong } from '@nutui/icons-vue';

  const router = useRouter();
  // const userStore = useUserStore();
  // const getUserInfo = computed(() => {
  //   const { name = '' } = userStore.getUserInfo || {};
  //   return name;
  // });
  const goLogin = () => {
    router.push('/login');
  };
</script>

<style lang="scss">
  .avatar-wrap {
    display: flex;
    margin: 10px 40px;
    align-items: center;
    .member-detail {
      margin-left: 20px;
      .nickname {
        font-size: 16px;
        font-weight: bold;
        .nut-button {
          margin-left: 10px;
        }
      }
      .info {
        margin-top: 10px;
        font-size: 16px;
      }
    }
  }
</style>
