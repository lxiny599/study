<template>
  <view>
    <view class="canvas-box">
      <canvas
        canvas-id="sharepyq"
        style="width:750px;height:1332px"
      />
    </view>
    <!-- 自定义头部 -->
    <u-navbar
      :is-back="false"
      :background="background"
    >
      <view class="slot-wrap">
        <view class="title">
          <view
            :class="{'active':currentIndex===1}"
            class="btn1"
            @click="select(1)"
          >外卖</view>
          <view
            :class="{'active':currentIndex===2}"
            class="btn1"
            @click="select(2)"
          >果蔬</view>
        </view>
      </view>
    </u-navbar>

    <!-- 外卖 -->
    <view
      v-show="currentIndex===1"
      class="content waimai"
    >
      <!-- 步骤部分 -->
      <view class="step-list">
        <view class="step-tiem">
          <image
            :src="takeaway.ICON1"
            alt=""
          >
            <view>购买下单</view>
        </view>
        <view class="step-tiem">
          <image
            :src="takeaway.ICON2"
            alt=""
          >
            <view>验证订单</view>
        </view>
        <view class="step-tiem">
          <image
            :src="takeaway.ICON3"
            alt=""
          >
            <view>补贴返款</view>
        </view>
      </view>
      <!-- 详情部分 -->
      <view class="info">
        <view class="img">
          <image
            v-if="!hasLogin"
            :src="takeaway.ELMICON"
            alt=""
          />
          <image
            v-else
            :src="takeawayInfo.wechatAppletCodeUrl"
            alt=""
            show-menu-by-longpress=true
          />
        </view>
        <view
          class="red-btn"
          @click="goByGoods"
        >领红包点外卖</view>
        <view class="btn-box">
          <view
            class="btn2 share"
            @click="share(takeawayBg.ELMWM)"
          >分享赚钱</view>
          <view
            class="btn2 copy"
            @click="copyCode"
          >复制文案</view>
        </view>
      </view>
      <!-- 注意事项 -->
      <view class="note">
        <view class="note-title">返利注意事项</view>
        <view>1、必须跳转到最新版本手机淘宝领券且绑定授权饿了么账号，领券后7天内用券下单均有收益;使用其余版本的手机淘宝需确认与饿了么账号绑定，否则无收益;</view>
        <view>2、呆萌价所有用户通过该跳转页面下单均有收益，收益计算以实际支付金额为准;</view>
        <view>3、同步的订单在[我的订单-淘宝订单]中查看;</view>
        <view>4、仅限饿了么品质联盟商户订单有返佣;</view>
        <view>5、如果饿了么活动页上推荐的店铺你不喜欢，返回淘宝首页进去饿了么，也可领券后绑定饿了么账户，打开饿了么APP，搜索你喜欢的门店，领券后在有效期内用券下单仍然有返佣。</view>
      </view>
    </view>

    <!-- 果蔬 -->
    <view
      v-show="currentIndex===2"
      class="content guoshu"
    >
      <!-- 步骤部分 -->
      <view class="step-list">
        <view class="step-tiem green">
          <image
            :src="takeaway.ICON4"
            alt=""
          >
            <view>购买下单</view>
        </view>
        <view class="step-tiem green">
          <image
            :src="takeaway.ICON5"
            alt=""
          >
            <view>验证订单</view>
        </view>
        <view class="step-tiem green">
          <image
            :src="takeaway.ICON6"
            alt=""
          >
            <view>补贴返款</view>
        </view>
      </view>
      <!-- 详情部分 -->
      <view class="info green-info">
        <view class="img">
          <image
            v-if="!hasLogin"
            :src="takeaway.ELMICON"
            alt=""
          />
          <image
            v-else
            :src="takeawayInfo.wechatAppletCodeUrl"
            alt=""
            show-menu-by-longpress=true
          />
        </view>
        <view
          class="red-btn"
          @click="goByGoods"
        >领红包点外卖</view>
        <view class="btn-box">
          <view
            class="btn2 share"
            @click="share(takeawayBg.ELMGS)"
          >分享赚钱</view>
          <view
            class="btn2 copy"
            @click="copyCode"
          >复制文案</view>
        </view>
      </view>
      <!-- 注意事项 -->
      <view class="note">
        <view class="note-title green-title">返利注意事项</view>
        <view>1、必须跳转到最新版本手机淘宝领券且绑定授权饿了么账号，领券后7天内用券下单均有收益;使用其余版本的手机淘宝需确认与饿了么账号绑定，否则无收益;</view>
        <view>2、呆萌价所有用户通过该跳转页面下单均有收益，收益计算以实际支付金额为准;</view>
        <view>3、同步的订单在【我的订单-淘宝订单】中查看；</view>
        <view>4、仅限饿了么果蔬商超品质联盟商户订单有返佣；</view>
        <view>5、如果饿了么活动页上推荐的店铺你不喜欢，返回淘宝首页进去饿了么，也可领券后绑定饿了么账户，打开饿了么</view>
      </view>
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
import { takeaway, takeawayBg } from '../../config/imgUrl'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      background: {
        backgroundColor: '#fff'
      }, // 自定义头部背景样式
      currentIndex: 1,
      takeaway: takeaway,
      takeawayBg: takeawayBg,
      takeawayInfo: '',
      isPosterReady: false // 分享到朋友圈的海报准备好了吗 ？
    }
  },
  computed: { ...mapState(['hasLogin']) },
  onLoad() {
    if (this.hasLogin) {
      this.getData(this.currentIndex)
    }
  },
  onShow() {
    this.$cli && this.app.productSearch()
    if (this.hasLogin) {
      this.getData(this.currentIndex)
    }
  },
  methods: {
    // 顶部切换按钮
    select(data) {
      this.currentIndex = data
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      if (this.hasLogin) {
        this.getData(this.currentIndex)
      }
    },
    getData(type) {
      this.app
        .request({
          url: `${this.app.api.getWechatAppEL}?dish=${type}`,
          type: 'GET'
        })
        .then((res) => {
          this.takeawayInfo = res.data.data.data
        })
    },
    // 唤醒饿了么小程序
    goByGoods() {
      const that = this
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pagesOther/login/login'
        })
        return false
      }
      uni.navigateToMiniProgram({
        appId: that.takeawayInfo.appid,
        path: that.takeawayInfo.wechatAppletPath,
        success(res) {
          console.log('成功')
        }
      })
    },
    share(img) {
      const that = this
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pagesOther/login/login'
        })
        return false
      }
      this.isPosterReady = false //如果生成海报时间过长就取消遮罩  避免用户无法操作
      setTimeout(() => {
        if (!this.isPosterReady) {
          this.app.loading(false)
        }
      }, 10000)
      this.getHaibao(img).then(() => {
        this.isPosterReady = true
        this.app.loading(false)
        this.app.open({
          slot: 'shareTakeaway',
          skin: 'shareTakeaway',
          title: '',
          closeBtn: false,
          btn: false,
          // escBtn: false,
          // yesBtn: false,
          backEsc: true,
          imgUrl: this.pyqImageUrl,
          methods: {
            preserve() {
              that.app
                .authorize('writePhotosAlbum', that.pyqImageUrl)
                .then(() => {
                  uni.showToast({
                    title: '保存成功，去分享吧~',
                    icon: 'none',
                    duration: 2000
                  })
                })
                .catch((err) => console.log('用户取消分享', err.errMsg))
            }
          }
        })
      })
    },
    //获取分享海报图
    getHaibao(img) {
      const that = this
      return new Promise((resolve, reject) => {
        this.app.loading()
        this.getImg([img, this.takeawayInfo.wechatAppletCodeUrl]).then(
          (res) => {
            const ctx = uni.createCanvasContext('sharepyq')
            ctx.fillStyle = '#F3F3F3'
            ctx.fillRect(0, 0, 750, 1332)
            ctx.drawImage(res[0], 0, 0, 750, 1332)
            // 二维码
            ctx.save()
            ctx.translate(245, 924)
            that.app.drawRoundRectPath(ctx, 260, 260, 16)
            ctx.fillStyle = '#fff' // 若是给定了值就用给定的值否则给予默认值
            ctx.fill()
            ctx.clip()
            ctx.drawImage(res[1], 16, 16, 228, 228)
            ctx.restore()

            ctx.setFillStyle('#fff')
            ctx.setFontSize(36)
            ctx.fillText('一 长按识别二维码领取 一', 166, 1236)
            ctx.draw(false, function () {
              uni.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 750,
                height: 1332,
                destWidth: 1080,
                destHeight: 1918,
                fileType: 'jpg',
                quality: 0.9,
                canvasId: 'sharepyq',
                success(res) {
                  that.pyqImageUrl = res.tempFilePath
                  resolve(that.pyqImageUrl)
                },
                fail(err) {
                  console.log('获取海报出错', err)
                  that.app.loading(false)
                  reject(err)
                }
              })
            })
          }
        )
      })
    },
    getImg(urlList = []) {
      return new Promise((rev, err) => {
        let tempList = []
        let num = 0
        for (var i = 0; i < urlList.length; i++) {
          let index = i
          uni.downloadFile({
            url: urlList[i],
            header: { Authorization: uni.getStorageSync('Authorization') },
            success(res) {
              if (res.statusCode === 200) {
                num++ //计数
                tempList[index] = res.tempFilePath
                if (num >= urlList.length) {
                  rev(tempList)
                }
              }
            },
            fail(e) {
              err(e)
            }
          })
        }
      })
    },
    // 复制文案
    copyCode() {
      const _this = this
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pagesOther/login/login'
        })
        return false
      }
      // 此方法H5不支持
      uni.setClipboardData({
        data: _this.takeawayInfo.elementPwd,
        success: (res) => {
          uni.setStorageSync('searchText', _this.takeawayInfo.elementPwd)
          uni.hideToast()
          // _this.app.msg('邀请码复制成功！')
          uni.showToast({
            title: '复制成功！',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.canvas-box {
  position: fixed;
  bottom: -3000rpx;
  left: -4000rpx;
}
.slot-wrap {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin: 0 45rpx 14rpx 0;
  .title {
    display: flex;
    width: 282rpx;
    height: 62rpx;
    background: #f1f1f1;
    border-radius: 31rpx;
    font-size: 30rpx;
    color: #000;
    line-height: 62rpx;
    .btn1 {
      overflow: hidden;
      width: 141rpx;
      height: 62rpx;
      border-radius: 31rpx;
      text-align: center;
      &.active {
        color: #fff;
        background: #ff444a;
      }
    }
  }
}
.content {
  padding: 254rpx 20rpx 20rpx;
  &.waimai {
    background: #078ddd url($elmWm) no-repeat;
    background-size: 100% auto;
    background-position: 0 0;
  }
  &.guoshu {
    background: #27c855 url($elmGs) no-repeat;
    background-size: 100% auto;
    background-position: 0 0;
  }
  .step-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 195rpx;
    background: #fff;
    border-radius: 24rpx;
    .step-tiem {
      position: relative;
      font-size: 28rpx;
      text-align: center;
      color: #666;
      image {
        width: 74rpx;
        height: 74rpx;
        margin-bottom: 10rpx;
      }
      &:not(:last-child) {
        &:after {
          position: absolute;
          right: -98rpx;
          top: 36rpx;
          content: '';
          width: 72rpx;
          height: 12rpx;
          background: url($blueDot) no-repeat;
          background-size: 100% 100%;
        }
      }
      &.green {
        &:not(:last-child) {
          &:after {
            position: absolute;
            right: -98rpx;
            top: 36rpx;
            content: '';
            width: 72rpx;
            height: 12rpx;
            background: url($greenDot) no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30rpx;
    width: 100%;
    height: 560rpx;
    margin: 20rpx 0;
    background: #fff url($blueLine) no-repeat;
    background-size: 100% auto;
    background-position: 0 415rpx;
    border-radius: 24rpx;
    .img {
      width: 250rpx;
      height: 250rpx;
      image {
        width: 250rpx;
        height: 250rpx;
      }
    }
    .red-btn {
      width: 530rpx;
      height: 80rpx;
      margin: 30rpx 0 70rpx;
      background: linear-gradient(to top, #ff3d44, #ff676b);
      border-radius: 40rpx;
      font-size: 34rpx;
      font-weight: 500;
      color: #fff;
      line-height: 80rpx;
      text-align: center;
    }
    .btn-box {
      width: 100%;
      padding: 0 98rpx;
      display: flex;
      justify-content: space-between;
      .btn2 {
        width: 224rpx;
        height: 65rpx;
        border-radius: 33rpx;
        font-size: 28rpx;
        line-height: 65rpx;
        text-align: center;
        &.share {
          background: #0094ef;
          color: #fff;
        }
        &.copy {
          border: 3rpx solid #0094f0;
          color: #0094f0;
        }
      }
    }
    &.green-info {
      background: #fff url($greenLine) no-repeat;
      background-size: 100% auto;
      background-position: 0 415rpx;
      .btn-box {
        .btn2 {
          &.share {
            background: #3bbe60;
            color: #fff;
          }
          &.copy {
            border: 3rpx solid #2fbe57;
            color: #2fbe57;
          }
        }
      }
    }
  }
  .note {
    width: 100%;
    // height: 647rpx;
    padding: 0 32rpx 45rpx;
    background: #fff;
    border-radius: 16rpx;
    font-size: 26rpx;
    color: #333;
    line-height: 48rpx;
    .note-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #078ddd;
      line-height: 80rpx;
      &::before {
        display: inline-block;
        content: '';
        width: 12rpx;
        height: 12rpx;
        margin: 0 16rpx 6rpx 0;
        background: #078ddd;
        border-radius: 50%;
      }
      &.green-title {
        color: #14ac3f;
        &::before {
          background: #3bbe60;
        }
      }
    }
  }
}
</style>
