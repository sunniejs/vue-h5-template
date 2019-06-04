<!-- coupon.vue -->
<template>
  <div class="app-container">
    <van-nav-bar title="我的优惠券" left-arrow @click-left="()=>{this.$router.push('/account')}" />
    <van-tabs v-model="tabActive" class="coupon-tabs" :line-width="44" :line-height="1" color="#333333">
      <van-tab title="未使用"></van-tab>
      <van-tab title="已使用"></van-tab>
      <van-tab title="已失效"></van-tab>
    </van-tabs>
    <div class="coupon-list-warpper">
      <div class="coupon-item">
        <div class="coupon-amount-warp">
          <div class="coupon-amount-number">
            <span class="rmb">¥</span>
            <span>50</span>
          </div>
          <p><span>满¥199可用</span></p>
        </div>
        <div class="coupon-info-warp">
          <div class="coupon-info">
            <div class="coupon-title">全场限时优惠</div>
            <div class="off-date">2018.12.18 10:00:00</div>
          </div>
          <div class="coupon-detail">详细信息<span></span></div>
        </div>
      </div>
      <div class="coupon-item">
        <div class="coupon-amount-warp">
          <div class="coupon-amount-number">
            <span class="rmb">¥</span>
            <span>50</span>
          </div>
          <p><span>满¥199可用</span></p>
        </div>
        <div class="coupon-info-warp">
          <div class="coupon-info">
            <div class="coupon-title">全场限时优惠</div>
            <div class="off-date">2018.12.18 10:00:00</div>
          </div>
          <div class="coupon-detail">详细信息<span></span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Tab, Tabs } from 'vant'

export default {
  components: {
    'van-nav-bar': NavBar,
    'van-tabs': Tabs,
    'van-tab': Tab
  },
  data () {
    return {
      tabActive: 0
    }
  },
  computed: {},
  mounted () { },
  methods: {}
}

</script>
<style lang='scss'>
.coupon-tabs {
  .van-tab {
    font-size: 17px !important;
    font-weight: 500 !important;
  }
}
.coupon-list-warpper {
  padding: 12px;
  .coupon-item {
    display: flex;
    width: 100%;
    height: 100px;
    margin-bottom: 12px;
    .coupon-amount-warp {
      width: 118px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: url("../../assets/images/coupon/s-coupon-item@2x.png")
        no-repeat center center;
      background-size: contain;
      color: #fff;
      .coupon-amount-number {
        font-size: 30px;
        .rmb {
          font-size: 15px;
        }
      }
    }
    .coupon-info-warp {
      display: flex;
      flex-direction: column;
      background: #fff;
      flex: 1;
      .coupon-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 12px 11px 9px 11px;
        height: 70px;
        border-bottom: 2px dotted #ddd;
        .coupon-title {
          font-size: 16px;
          line-height: 23px;
          color: #333333;
        }
        .off-date {
          font-size: 10px;
          line-height: 14px;
          color: #999999;
        }
      }
      .coupon-detail {
        color: #666666;
        line-height: 30px;
        padding-left: 11px;
      }
    }
  }
}
</style>
