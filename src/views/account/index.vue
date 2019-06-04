<!-- home.vue  -->
<template>
  <div class="app-container">
    <div class="user-info-container">
      <div class="user-info-warpper">
        <div class="user-info">
          <img class="user-avatar" :src="vipInfo.userImg" alt="用户头像">
          <div class="user-info-center">
            <div class="user-name">{{ vipInfo.nickName|formatName }}<span class="user-level"></span></div>
            <div class="user-code">代购编号：{{ vipInfo.userCode }}</div>
          </div>
          <div class="qrcode-warp" @click="showQrcode($event)">
            <qrcode :value="vipInfo.userCode" tag="img" :options="{ width: 45,margin:0 }"></qrcode>
          </div>
        </div>
        <div class="account-info">
          <div class="account-info-item">
            <span class="account-amount"> ¥{{ vipInfo.availableBalance|formatCentMoney }}</span>
            <span class="account-label">余额</span>
          </div>
          <div class="account-info-item">
            <span class="account-amount">{{ vipInfo.userGold }}</span>
            <span class="account-label">金币</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <van-cell-group>
        <van-cell is-link>
          <div slot="title" class="account-cell">
            <span class="icon-ticket"></span>
            <span class="custom-text">我的入场券 </span>
          </div>
        </van-cell>
        <van-cell value-class="coupon-number" :value="vipInfo.couponAvailable+'张'" is-link to="/coupon">
          <div slot="title" class="account-cell">
            <span class="icon-coupon"></span>
            <span class="custom-text">优惠券 </span>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
    <!-- 绑定手机 -->
    <msg-code :visible="codeVisible"></msg-code>
    <!-- 二维码大图 -->
    <van-popup v-model="qrcodeVisible" style="padding:10px;border-radius:10px">
      <div class="popup-container">
        <img :src="qrSrc" alt="">
      </div>
    </van-popup>
  </div>
</template>
<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { Popup, Cell, CellGroup } from 'vant'
import VerificationCode from '@/components/VerificationCode'
import { getAccountInfo } from '@/api/user'
export default {
  components: {
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'msg-code': VerificationCode,
    'qrcode': VueQrcode,
    'van-popup': Popup
  },
  data () {
    return {
      qrcodeVisible: false,
      codeVisible: false,
      vipInfo: {},
      qrSrc: ''
    }
  },
  computed: {},
  created () {
    this.init()
  },
  methods: {
    // 获取初始数据
    async init () {
      // 获取全部的会员信息
      const { data } = await getAccountInfo()
      this.vipInfo = data.vipUserInfo
    },
    showQrcode (event) {
      this.qrSrc = event.target.currentSrc
      this.qrcodeVisible = true
    }
  }
}

</script>
<style lang='scss' scoped>
h1 {
  background: red;
  width: 375px;
}
.user-info-container {
  padding: 12px 12px 35px 12px;
  background: #ea1314;
  position: relative;
  overflow: hidden;
  .user-info-warpper {
    position: relative;
    z-index: 100;
    border-radius: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 18px 16px 20px 16px;
    box-shadow: 0px 6px 12px 0px rgba(231, 231, 231, 0.5);
    .user-info {
      display: flex;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 18px;
      .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        background: #ddd;
      }
      .user-info-center {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        .user-name {
          font-size: 17px;
          font-weight: 500;
          line-height: 24px;
        }
        .user-code {
          font-size: 13px;
        }
      }
      .qr-code {
        width: 50px;
        height: 50px;
      }
    }
    .account-info {
      display: flex;
      padding-top: 15px;
      .account-info-item {
        width: 50%;
        display: flex;
        align-items: center;
        flex-direction: column;
        .account-amount {
          font-size: 17px;
          line-height: 24px;
          color: #ea1314;
          font-weight: 500;
        }
        .account-label {
          color: #666666;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
  &:after {
    content: "";
    width: 425px;
    height: 75px;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: -25px;
    z-index: 1;
    border-top-right-radius: 50px;
    border-top-left-radius: 50px;
  }
}
.account-cell {
  display: flex;
  align-items: center;
  .icon-ticket {
    width: 22px;
    height: 19px;
    margin-right: 10px;
    display: inline-block;
    background: url("../../assets/images/account/s-ticket@2x.png") no-repeat
      center center;
    background-size: cover;
  }
  .icon-coupon {
    width: 22px;
    height: 15px;
    margin-right: 10px;
    display: inline-block;
    background: url("../../assets/images/account/s-conpon@2x.png") no-repeat
      center center;
    background-size: cover;
  }
  .coupon-number {
    color: #ea1314;
    font-weight: 500;
  }
}
</style>
