<template>
  <view class="login-wrapper">
    <view class="logo">
      <image src="../../static/logo-user.png" />
    </view>
    <view class="title">傲娇好物 呆萌价格</view>
    <view class="profile">呆萌价申请获得以下权限：</view>
    <view class="profile-note">获得您的公开信息（昵称、头像等）</view>
    <button class="login-btn" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">
      <icon class="ic-weixin"></icon>
      <text>微信授权</text>
    </button>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      publicData: this.app.getPublicData()
    }
  },
  methods: {
    ...mapMutations(['login']), // this.app.login成功的回调函数会调用本页面的 login 方法
    getuserinfo: function (res) {
      uni.removeStorageSync('code508count')
      if (res.detail.iv) {
        this.app.login()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .logo {
    width: 200rpx;
    height: 200rpx;
    margin-top: 126rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    margin-top: 6rpx;
    font-size: 30rpx;
    color: #666;
  }
  .profile {
    margin-top: 46rpx;
    font-size: 36rpx;
    color: #333;
  }
  .profile-note {
    margin-top: 10rpx;
    font-size: 26rpx;
    color: #333;
  }
  .login-btn {
    width: 560rpx;
    margin-top: 60rpx;
    background: linear-gradient(to right, #ff5b4d, #ee2325);
    border-radius: 10rpx;
    font-size: 36rpx;
    color: #fff;
    line-height: 80rpx;
    text-align: center;
    & > icon {
      font-size: 72rpx;
    }
  }
}
</style>
