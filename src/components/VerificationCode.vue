<!-- verificationCode.vue -->
<template>
  <div class="app-container">
    <van-popup v-model="visible" class="modal-popup" position="right">
      <div class="verification-code-container">
        <div class="cell-box">
          <div class="cell-title">绑定手机号</div>
          <div class="cell-item">
            <div class="item-left">+86</div>
            <input v-model="verifyCodeForm.account" type="tel" placeholder="请输入手机号">
          </div>
          <div class="cell-item">
            <div class="item-left"> 验证码</div>
            <div class="code-cell-warp">
              <input v-model="verifyCodeForm.code" type="tel" placeholder="请输入验证码">
              <div :class="['registered-get-code',codeCountdown?'disabled-btn':'']" :disabled="codeCountdown" @click="sendMsgCode">
                {{ codeCountdown ? `${codeCountdown}后重新发送` : '发送验证码' }}
              </div>
            </div>
          </div>
          <div :class="['cell-btn',codeDisable?'disabled-btn':'']" @click="submit">确 定</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Toast } from 'vant'
import * as Validate from '@/utils/validate'
import { bindPhoneNumber, sendCode } from '@/api/user'
export default {
  name: 'MsgCode',
  components: {
    'van-popup': Popup
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      codeCountdown: 0,
      verifyCodeForm: {
        code: '',
        type: 3, // 验证码类型（1：注册/登录 2：订单/登录 3: 操作验证）
        account: ''
      },
      errMessage: ''
    }
  },
  computed: {
    codeDisable () {
      return this.verifyCodeForm.account === '' || this.verifyCodeForm.code === ''
    }
  },
  methods: {
    submit () { // 确定提交
      if (!this.valid(true)) { // 验证
        return Toast({
          message: this.errMessage
        })
      }
      // 绑定手机
      bindPhoneNumber(this.verifyCodeForm).then(res => {
        // 绑定成功后关闭弹窗
        this.visible = false
      }).catch(() => {
      })
    },
    sendMsgCode () { // 获取验证码
      if (!this.valid()) { // 验证
        return Toast({
          message: this.errMessage
        })
      }
      // 发送验证码
      sendCode({
        account: this.verifyCodeForm.account,
        type: this.verifyCodeForm.type
      }).then(res => {
        this.codeCountdown = 60
        const timer = setInterval(() => {
          if (this.codeCountdown <= 0) {
            this.codeCountdown = null
            clearInterval(timer)
          } else {
            this.codeCountdown--
          }
        }, 1000)
      }).catch(() => {
      })
    },
    // 验证
    valid (validAll) {
      if (!Validate.mobile(this.verifyCodeForm.account)) {
        this.errMessage = '请输入正确的手机号'
        return false
      }
      // validAll为true时验证全部字段
      if (validAll) {
        if (!Validate.number(this.verifyCodeForm.code)) {
          this.errMessage = '请输入4位数字验证码'
          return false
        }
      }
      return true
    }
  }
}

</script>
<style lang='scss' scoped>
.verification-code-container {
  padding: 25px;
  // height: 100%;
  // background: #fff;
  .cell-box {
    padding-top: 81px;
    .cell-title {
      line-height: 31px;
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 40px;
    }
    .cell-item {
      border-bottom: 1px solid #ececec;
      display: flex;
      align-items: center;
      font-size: 17px;
      height: 55px;
      .item-left {
        margin-left: 12px;
        width: 73px;
      }
      input {
        flex: 1;
        width: 100%;
        line-height: 44px;
      }
      .code-cell-warp {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        //   .code-cell {
        //     background: #fff;
        //     position: relative;
        //   }
        .registered-get-code {
          width: 95px;
          background: #ff3d3e;
          color: #fff;
          font-size: 14px;
          text-align: center;
          margin-left: 10px;
          border-radius: 15px;
          line-height: 30px;
          height: 30px;
        }
      }
    }
    .cell-btn {
      width: 315px;
      height: 45px;
      line-height: 45px;
      margin-top: 80px;
      background: #ff3d3e;
      color: #ffffff;
      text-align: center;
      border-radius: 23px;
      font-size: 18px;
    }
    .disabled-btn {
      background: #d9d9d9 !important;
      color: #fff !important;
      pointer-events: none;
      cursor: default;
    }
  }
}
</style>
