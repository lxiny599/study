<template>
  <view class="container">
    <view class="logo">
      <image src="../../static/logo-user.png" />
    </view>
    <view class="title">傲娇好物 呆萌价格</view>
    <view class="profile">呆萌价申请获得以下权限：</view>
    <view class="profile-note">获得您的公开信息（昵称、头像等）</view>
    <button
      class="login-btn av"
      @click='getuserinfo'
      withCredentials="true"
    >
      <icon class="ic-weixin2"></icon>
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
  onLoad() {
    /* 	uni.showModal({
		  title: 'referId',
		  content: `referId: ${uni.getStorageSync('superiorId')}`,
		  success: function(res) {
		    if (res.confirm) {
		      console.log('用户点击确定');
		    } else if (res.cancel) {
		      console.log('用户点击取消');
		    }
		  }
		}); */
  },
  onShow() {
    // this.$cli && this.app.productSearch()
  },
  methods: {
    ...mapMutations(['login']), // this.app.login成功的回调函数会调用本页面的 login 方法
    getuserinfo() {
      uni.removeStorageSync('code508count')
      this.app.login()
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .logo {
    position: absolute;
    top: 126upx;
    left: 50%;
    transform: translateX(-50%);
    width: 200upx;
    height: 200upx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    position: absolute;
    top: 330upx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30upx;
    color: #666;
  }
  .profile {
    position: absolute;
    top: 420upx;
    width: 100%;
    font-size: 36upx;
    text-align: center;
    color: #333;
  }
  .profile-note {
    position: absolute;
    top: 480upx;
    width: 100%;
    font-size: 26upx;
    text-align: center;
    color: #333;
  }
  .login-btn {
    position: absolute;
    top: 580upx;
    left: 50%;
    transform: translateX(-50%);
    width: 560upx;
    line-height: 80upx;
    text-align: center;
    border-radius: 10upx;
    font-size: 36upx;
    color: #fff;
    background: linear-gradient(to right, #ff5b4d, #ee2325);
    icon {
      line-height: 78upx;
      font-size: 80upx;
      color: #fff;
    }
  }
}
</style>
