<!-- coupon.vue -->
<template>
  <div class="app-container">
    <div class="fixed">
      <div class="my-header">
        <div class="back-icon" @click="()=>{this.$router.push('/account')}"></div>
        <div class="header-title">我的优惠券</div>
      </div>
      <van-tabs v-model="tabActive" @click="tabClick(tabActive)" class="coupon-tabs" :line-width="44" :line-height="1" color="#333333">
        <van-tab title="未使用"></van-tab>
        <van-tab title="已使用"></van-tab>
        <van-tab title="已失效"></van-tab>
      </van-tabs>
    </div>
    <div class="coupon-list-warpper">
      <!-- foreach -->
      <div v-for="(item,index) in couponList" :key="index" class="coupon-item">
        <div class="coupon-main">
          <div class="coupon-left">
            <div class="coupon-amount-number">
              <template v-if="item.couponType===3">
                <span>{{ item.percentOff|formatPercent }}</span><span class="rmb">折</span>
              </template>
              <template v-else>
                <span class="rmb">¥</span><span>{{ item.couponAmount|formatCentMoney }}</span>
              </template>
            </div>
            <div>
              <span v-if="item.couponType===1">无门槛</span>
              <span v-if="item.couponType===2">满¥{{ item.availableAmount|formatCentMoney }}可用</span>
            </div>
          </div>
          <div class="coupon-right">
            <div class="coupon-info">
              <div class="coupon-title">{{ item.couponName }}</div>
              <div v-if="item.endType === 0" class="coupon-off-date">无使用期限</div>
              <div v-else class="coupon-off-date"> {{ item.couponStart|formatDate("yyyy.MM.dd hh:mm:ss") }}-{{ item.couponEnd|formatDate("yyyy.MM.dd hh:mm:ss") }}</div>
            </div>
            <div class="coupon-detail" @click="showExpain(index)">
              <span>详细信息</span>
              <span :class="item.explainVisible?'coupon-arrow-up':'coupon-arrow-down'"></span>
            </div>
          </div>
        </div>
        <div v-if="item.explainVisible" class="coupon-info-explain">
          {{ item.couponExplain }}
        </div>
      </div>
      <!-- foreach end-->
      <!-- empty -->
      <list-empty v-if="couponList.length===0" tips="您没有可用的优惠券哦">
        <div slot="emptyImg" class="coupon_empty">
        </div>
      </list-empty>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vant'
import { getCouponList } from '@/api/coupon'
import ListEmpty from '@/components/ListEmpty'

export default {
  components: {
    'van-tabs': Tabs,
    'van-tab': Tab,
    'list-empty': ListEmpty
  },
  data () {
    return {
      tabActive: 0,
      couponList: [],
      params: {
        couponStatus: 0 // 0未使用，1已使用，2已失效
      },
      explainShow: false
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      getCouponList(this.params).then(res => {
        this.couponList = res.data.couponList
      })
    },
    // 显示优惠券解释说明
    showExpain (index) {
      if (this.couponList[index].explainVisible) {
        this.couponList[index].explainVisible = !this.couponList[index].explainVisible
      } else {
        this.$set(this.couponList[index], 'explainVisible', true)
      }
    },
    // 切换tab
    tabClick (index) {
      this.params.couponStatus = index
      // 重新请求数据
      this.fetchData()
    }
  }
}

</script>
<style lang='scss'>
.fixed {
  position: fixed;
  z-index: 9999;
  width: 100%;
  .coupon-tabs {
    .van-tab {
      font-size: 17px !important;
      font-weight: 500 !important;
    }
  }
}

.coupon-list-warpper {
  padding: 98px 12px 0 12px;
  height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .coupon-item {
    margin-bottom: 12px;
    .coupon-main {
      display: flex;
      width: 100%;
      .coupon-left {
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
          line-height: 42px;
          .rmb {
            font-size: 15px;
          }
        }
      }
      .coupon-right {
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
          .coupon-off-date {
            font-size: 10px;
            line-height: 14px;
            color: #999999;
          }
        }
        .coupon-detail {
          color: #666666;
          line-height: 30px;
          padding: 0 11px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .coupon-arrow-down {
          width: 22px;
          height: 22px;
          background: url("../../assets/images/coupon/s-coupon-detail-down@2x.png")
            no-repeat center center;
          background-size: contain;
        }
        .coupon-arrow-up {
          width: 22px;
          height: 22px;
          background: url("../../assets/images/coupon/s-coupon-detail-up@2x.png")
            no-repeat center center;
          background-size: contain;
        }
      }
    }
    .coupon-info-explain {
      background: #ffffff;
      margin-top: 1px;
      padding: 8px 12px;
      color: #999999;
    }
  }
}
.coupon_empty {
  width: 140px;
  height: 105px;
  background: url("../../assets/images/coupon/s-coupon-empty@2x.png") no-repeat
    center center;
  background-size: cover;
}
</style>
