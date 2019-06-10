<!-- verificationCode.vue -->
<template>
  <div class="app-container">
    <!-- 二维码大图 -->
    <van-popup v-model="visible" class="modal-popup">
      <div class="qrcode-popup-container">
        <div class="qrcode-close" @click="closePopup">
          取消
        </div>
        <div class="qrcode-top">
          {{title}}
        </div>
        <div class="qrcode-bottom">
          <qrcode :value="src" tag="img" :options="{ width: 145,margin:0 }"></qrcode>
          <div class="qrcode-tips" v-html="tips">
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { Popup, Toast } from 'vant'
import * as Validate from '@/utils/validate'
import { bindPhoneNumber, sendCode } from '@/api/user'
export default {
  name: 'QrCodePopup',
  components: {
    'van-popup': Popup,
    'qrcode': VueQrcode
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },

  methods: {
    closePopup () {
      this.$emit('close')
    }
  }
}

</script>
<style lang='scss' scoped>
.modal-popup {
  width: 100%;
  height: 100%;
  background: #d43f36;
  .qrcode-popup-container {
    position: relative;
    margin: 25px 27px;
    background: #fff;
    border-radius: 10px;
    .qrcode-close {
      color: #d43f36;
      font-size: 16px;
      position: absolute;
      left: 0px;
      top: 0px;
      padding: 20px;
      z-index: 100;
    }
    .qrcode-top {
      position: relative;
      height: 115px;
      border-bottom: 2px dotted #dbdbdb;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333333;
      font-size: 24px;
      font-weight: 500;
      &::before {
        content: "";
        width: 32px;
        height: 32px;
        background: #d43f36;
        position: absolute;
        bottom: -16px;
        right: -16px;
        border-radius: 50%;
      }
      &::after {
        content: "";
        width: 32px;
        height: 32px;
        background: #d43f36;
        position: absolute;
        bottom: -16px;
        left: -16px;
        border-radius: 50%;
      }
    }
    .qrcode-bottom {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 25px 0 41px 0;
      .qrcode-tips {
        font-size: 15px;
        color: #666666;
        width: 210px;
        text-align: center;
        margin-top: 17px;
        line-height: 21px;
      }
    }
  }
}
</style>
