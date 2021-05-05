<!-- home -->
<template>
  <div class="index-container">
    <div class="warpper">
      <img class="warpper-bg" src="@/assets/images/home/zhutu.png" alt="" />
      <div class="warpper-form" v-if="!isFinished">
        <input type="text" name="phone" v-model="submitInfo.phone" placeholder="请输入手机号" />
        <div class="warpper-form__file" v-if="!submitInfo.image">
          <img class="warpper-form__emptyImage" src="@/assets/images/home/img_tianjia.png" alt="" />
          <input type="file" name="image" accept="image/jpeg,image/jpg,image/png" @change="fileChange($event)" />
          <div class="warpper-form__note">请上传徒步报名凭证</div>
        </div>
        <div class="warpper-form__upLoadImage" v-else>
          <img :src="upLoadImage" alt="上传图片" />
        </div>
        <button class="warpper-form__submit" :disabled="!isVerification" @click="submit">立即上传</button>
      </div>
      <div class="warpper-finished" v-else>
        <div class="warpper-finished__note--1">徒步大会报名费已返还</div>
        <div class="warpper-finished__note--2">请下载享乐吧APP，<br />到“购物商城 - 我的余额”中查看</div>
        <a href="https://h5.game8808.cn/themes/simplebootx/Appapi/Video/txjunp.php" class="warpper-finished__download">
          <img src="@/assets/images/home/xiazai_button.png" alt="" />
        </a>
      </div>
      <div class="warpper-rules">
        <div class="title">活动规则</div>
        <div class="warpper-rules__item">
          <div class="item-title"><span>活动对象</span></div>
          <div class="item-text">活动期间注册并登录享乐吧APP的新用户，老用户</div>
        </div>
        <div class="warpper-rules__item">
          <div class="item-title"><span>活动时间</span></div>
          <div class="item-text">5月4日 - 5月14日</div>
        </div>
        <div class="warpper-rules__item">
          <div class="item-title"><span>活动流程及规则</span></div>
          <div class="item-text">
            <span class="count">1.</span>
            <span class="content">上传徒步大会有效报名证明图片；</span>
          </div>
          <div class="item-text">
            <span class="content">报名证明： </span>
          </div>
          <div class="item-text">
            <span class="content">（1）公众号报名成功订单 </span>
          </div>
          <div class="item-text">
            <span class="content">
              <img :src="ActiveImage" alt="" @click="showImge" />
            </span>
          </div>
          <div class="item-text">
            <span class="content">（2）线下报名凭证 </span>
          </div>
          <div class="item-text">
            <span class="count">2.</span>
            <span class="content">平台审核通过后，享乐吧APP发放10元商城余额，请到“购物商城-我的余额”中查看;</span>
          </div>
          <div class="item-text">
            <span class="count">3.</span>
            <span class="content">活动注意事项：</span>
          </div>
          <div class="item-text">
            <span class="content">· 若发现用户违规行为，享乐吧APP有权立即终止其活动； </span>
          </div>
          <div class="item-text">
            <span class="content">· 本活动最终解释权归享乐吧APP平台所有。</span>
          </div>
        </div>
      </div>
      <div class="warpper-download">
        <a href="https://h5.game8808.cn/themes/simplebootx/Appapi/Video/txjunp.php">
          <img src="@/assets/images/home/xiazai.png" alt="" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Toast } from 'vant'
import { registerForWalkingFestival } from '@/api/user'
import ActiveImage from '@/assets/images/home/img.png'
export default {
  data() {
    return {
      submitInfo: {
        phone: '',
        image: ''
      }, // 要上传的字段
      upLoadImage: '', // 是否已经上传了图片
      isFinished: false, // 是否完成提交
      ActiveImage // 点击可浏览的
    }
  },
  computed: {
    isVerification() {
      const emptyEnum = Object.values(this.submitInfo).filter(v => !v)
      // 如果存在空值不可提交
      if (emptyEnum.length > 0) {
        return false
      }
      return true
    }
  },
  mounted() {},
  methods: {
    // 上传图片响应
    fileChange(event) {
      const files = event.target.files
      if (files.length) {
        this.submitInfo.image = files[0]
        const reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = data => {
          const result = data.target.result
          this.upLoadImage = result
        }
      }
    },
    // 点击图片浏览
    showImge() {
      ImagePreview([ActiveImage])
    },
    // 提交信息
    submit() {
      const { phone, image } = this.submitInfo
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
        return Toast('手机号码格式有误!')
      }
      if (!image) {
        return Toast('没有上传图片嗷!')
      }

      var formData = new FormData()
      formData.append('phone', phone)
      formData.append('image', image)
      registerForWalkingFestival(formData)
        .then(res => {
          Toast('提交成功!')
          this.isFinished = true
        })
        .catch(error => {
          console.log('registerForWalkingFestival-error', error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-container {
  background-color: #008a78;
  background-image: url('../../assets/images/home/shumu.png');
  background-position: bottom center;
  background-size: 100%;
  background-repeat: no-repeat;
  padding-bottom: 56px;
  min-height: 100vh;
  .warpper-bg {
    width: 100%;
  }
  .warpper-form {
    position: relative;
    width: 710px;
    margin: 0 auto;
    margin-top: -147px;
    border-radius: 10px;
    padding: 64px;
    background-color: #fff;
    border: 3px solid #3ea699;
    margin-bottom: 66px;
    .warpper-form__file {
      position: relative;
    }
    input[type='text'] {
      width: 582px;
      height: 90px;
      font-size: 32px;
      font-family: 'PingFang-SC-Bold';
      font-weight: bold;
      border: 0;
      -webkit-appearance: none;
      box-shadow: 0 0 0 3px #4fada2;
      -webkit-box-shadow: 0 0 0 3px #4fada2;
      border-radius: 10px;
      margin: 0 auto;
      margin-bottom: 40px;
      padding: 0 22px;
      color: #167264;
      &::placeholder {
        color: #167264;
        opacity: 0.5;
      }
    }
    input[type='file'] {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
    }
    .warpper-form__emptyImage {
      margin-bottom: 40px;
    }
    .warpper-form__upLoadImage {
      margin-bottom: 40px;
      img {
        width: 100%;
      }
    }
    .warpper-form__note {
      line-height: 1;
      margin-bottom: 40px;
      font-size: 36px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #008a78;
      text-align: center;
    }
    .warpper-form__submit {
      width: 582px;
      height: 86px;
      line-height: 86px;
      margin: 0 auto;
      border-radius: 43px;
      border: 0;
      color: #fff;
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 2px;
      background: linear-gradient(to bottom, #2ec2af, #3ea79a);
      box-shadow: 0 3px 0px 3px #2c9386;
      text-align: center;
      &:disabled {
        background: linear-gradient(to bottom, #e5e5e5, #cccdcc);
        box-shadow: 0 3px 0px 3px #b3b3b3;
      }
    }
  }
  .warpper-finished {
    position: relative;
    width: 710px;
    margin: 0 auto;
    margin-top: -147px;
    border-radius: 10px;
    padding: 64px;
    background-color: #fff;
    border: 3px solid #3ea699;
    margin-bottom: 66px;
  }
  .warpper-finished__note--1 {
    width: 582px;
    height: 156px;
    line-height: 156px;
    font-size: 44px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #008a78;
    text-align: center;
    background-color: #e1fffb;
    margin-bottom: 24px;
  }
  .warpper-finished__note--2 {
    height: 69px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #008a78;
    line-height: 40px;
    text-align: center;
    margin-bottom: 30px;
  }
  .warpper-finished__download {
    display: block;
    margin: 0 auto;
    width: 582px;
  }
  .warpper-rules {
    width: 710px;
    margin: 0 auto;
    border-radius: 10px;
    padding: 64px 34px;
    padding-top: 0;
    background-color: #fff;
    border: 3px solid #3ea699;
    margin-bottom: 24px;
    .title {
      text-align: center;
      width: 320px;
      height: 80px;
      line-height: 80px;
      margin: 0 auto;
      margin-top: -41px;
      border-radius: 43px;
      border: 0;
      color: #fff;
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 2px;
      background: linear-gradient(to bottom, #2ec2af, #3ea79a);
      box-shadow: 0 3px 0px 3px #2c9386;
      margin-bottom: 30px;
    }
  }
  .warpper-rules__item {
    padding-bottom: 30px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #008a78;
    line-height: 1.8;
    .item-title {
      display: flex;
      justify-content: flex-start;
      height: 56px;
      line-height: 56px;
      color: #fff;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      margin-bottom: 24px;
      span {
        padding-left: 16px;
        padding-right: 34px;
        background-color: #008a78;
        border-top-right-radius: 26px;
        border-bottom-right-radius: 26px;
      }
    }
    .item-text {
      display: flex;
      .count {
        position: absolute;
      }
      .content {
        padding-left: 33px;
      }
    }
  }
  @keyframes moves {
    form {
      transform: translateY(-5%);
    }
    to {
      transform: translateY(5%);
    }
  }
  .warpper-download {
    // position: fixed;
    // bottom: 56px;
    // left: 50%;
    // margin-left: -340px;
    margin: 0 auto;
    width: 680px;
    display: flex;
    justify-content: center;
    z-index: 10;
    animation: moves 1s infinite alternate;
  }
}
</style>
