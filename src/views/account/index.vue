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
          <div class="qrcode-warp" @click="showUserQrcode()">
            <qrcode v-if="vipInfo.userPhone!==''" :value="vipInfo.userPhone" tag="img" :options="{ width: 45,margin:0 }"></qrcode>
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
        <van-cell is-link @click="doorAccessKey">
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
    <msg-code :visible="codeVisible" @close="closeCodePop"></msg-code>
    <!-- 二维码 -->
    <qrcode-popup :visible="qrcodeVisible" :src="qrSrc" :title="qrTitle" :tips="qrTips" @close="()=>{ qrcodeVisible = false }">

    </qrcode-popup>
  </div>
</template>
<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { Cell, CellGroup } from 'vant'
import VerificationCode from '@/components/VerificationCode'
import QrCodePopup from '@/components/QrCodePopup'
import { getAccountInfo, getDoorKey } from '@/api/user'
export default {
  components: {
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'msg-code': VerificationCode,
    'qrcode-popup': QrCodePopup,
    'qrcode': VueQrcode
  },
  data () {
    return {
      qrcodeVisible: false,
      codeVisible: false,
      vipInfo: {},
      qrSrc: '',
      qrTitle: '',
      qrTips: '',
      accesskey: null,
      access: this.$route.query.access
    }
  },
  computed: {
  },
  mounted () {
    // console.log(this.access)
    this.init()

  },
  methods: {
    // 获取初始数据
    init () {
      // 获取全部的会员信息
      getAccountInfo().then(res => {
        this.vipInfo = res.data.vipUserInfo
        // 手机号为空的时候绑定
        if (this.vipInfo && this.vipInfo.userPhone === '') {
          this.codeVisible = true
          // 点击入场券进入的
        } else if (this.access === '1') {
          this.doorAccessKey()
        }
      })
    },
    closeCodePop () {
      this.codeVisible = false
      // 点击入场券进入的 绑定完之后弹出入场券
      if (this.access === '1') {
        this.doorAccessKey()
      }
    },
    // 展示会员二维码
    showUserQrcode () {
      this.qrSrc = this.vipInfo.userPhone
      this.qrTitle = '小蚁货仓会员码'
      this.qrTips = '<p>会员码用于会员储值及支付</p> <p>请勿随意泄漏给</p>'
      this.qrcodeVisible = true
    },

    // 获取门禁二维码值
    async doorAccessKey () {
      this.qrTitle = '小蚁货仓入场券'
      this.qrTips = '<p>凭入场券二维码入场</p>'
      if (!this.accesskey) {
        const { data } = await getDoorKey()
        this.accesskey = data.doorKey
      }
      this.qrSrc = this.accesskey
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
      .qrcode-warp {
        width: 50px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
        }
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
