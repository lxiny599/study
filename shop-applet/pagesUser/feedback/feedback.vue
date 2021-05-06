<template>
  <view class="feedback-wrapper">
    <view
      v-if="!isShowTextarea"
      class="textarea empty-wrapper"
      @click="showTextarea"
    >请留下您的宝贵意见或建议，我们将努力改进！<br />(不少于10个字)</view>
    <textarea
      v-else
      maxlength="-1"
      class="textarea"
      v-model="text"
      focus
      @blur='bindTextAreaBlur'
      @confirm='bindTextAreaConfirm'
    ></textarea>
    <view
      class="submit"
      :class="{'no-submit':text.length<=9}"
      @click="submit"
    >提交</view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      text: '',
      isShowTextarea: false
    }
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  methods: {
    showTextarea() {
      this.isShowTextarea = true
    },
    bindTextAreaConfirm() {},
    bindTextAreaBlur() {
      if (this.text.length === 0) {
        this.isShowTextarea = false
      }
    },
    submit() {
      if (this.text.length <= 9) {
        this.app.msg('请输入不少于10个字的反馈！')
        return false
      }
      this.app
        .request({
          url: `${this.app.api.insertFeedBack}?reqContent=${this.text}`,
          type: 'GET'
        })
        .then((res) => {
          this.isShowTextarea = false
          this.text = ''
          this.app.msg('提交成功')
          console.log(res)
        })
      // uni.showToast({
      //   title: '提交成功',
      //   icon: 'none',
      //   duration: 2000
      // })
    }
  }
}
</script>

<style scoped lang="scss">
.feedback-wrapper {
  padding: 24rpx;
}
.textarea {
  width: 100%;
  height: 420rpx;
  padding: 24rpx 26rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  // font-weight: 500;
  color: $color-dark-grey;
  line-height: 40rpx;
  &.empty-wrapper {
    color: #ccc;
  }
}
.submit {
  width: 100%;
  height: 88rpx;
  margin-top: 40rpx;
  background: linear-gradient(-81deg, #fd3d44 0%, #fc6682 100%);
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #fff;
  line-height: 84rpx;
  text-align: center;
  &.no-submit {
    background: #dbdbdb;
  }
}
</style>
