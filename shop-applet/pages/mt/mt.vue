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
          >商超</view>
        </view>
      </view>
    </u-navbar>

    <!-- 外卖 -->
    <view
      v-show="currentIndex===1"
      class="content-box waimai"
    >
      <!-- 步骤部分 -->
      <view class="step-list">
        <view class="step-tiem">
          <image
            :src="takeaway.ICON7"
            alt=""
          >
            <view>购买下单</view>
        </view>
        <view class="step-tiem">
          <image
            :src="takeaway.ICON8"
            alt=""
          >
            <view>验证订单</view>
        </view>
        <view class="step-tiem">
          <image
            :src="takeaway.ICON9"
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
            :src="takeaway.MTICON"
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
            @click="share(takeawayBg.MTWM)"
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
        <view>1、本次活动中红包领取时间截止至2021年12月31日24点;</view>
        <view>2、订单同步为当日，下单后1小时内可同步到返佣订单;</view>
        <view>3、红包可在美团或美团外卖最新版客户端、美团外卖小程序下单且选择在线支付时使用;</view>
        <view>4、红包仅限非到店自取外卖订单，下午茶、夜宵、美食、蛋糕、团餐频道、甜点饮品频道使用;</view>
        <view>5、外卖新人首单红包限新用户(设备、手机号、美团账号均未在美团外卖下过单)首次下单使用，且不与其他优惠(首减、满减、满赠、套餐增、折扣菜)同享;</view>
        <view>6、使用红包时下单手机号码必须与收餐人手机号码、领取红包时输入的手机号码一致;</view>
        <view>7、此活动为部分区域有效，具体红包使用有效期及红包金额以实际收到为准;</view>
        <view>8、其余问题详见美团外卖客户端:我的一红包-美团红包、商家代金券使用说明;</view>
        <view>9、活动过程中，任何活动参与方存在虚假交易、恶意套利、作弊等不诚信行为，美团外卖有权取消活动参与方的活动资格，并保留依法追究法律责任的权利;</view>
        <view>10、活动期间，如出现不可抗力或情势变更的情况，美团外卖可依相关法律法规的规定主张免责;</view>
        <view>11、 如有其它疑问请咨询美团外卖客服10109777。</view>
      </view>
    </view>

    <!-- 果蔬 -->
    <view
      v-show="currentIndex===2"
      class="content-box guoshu"
    >
      <!-- 步骤部分 -->
      <view class="step-list">
        <view class="step-tiem green">
          <image
            :src="takeaway.ICON10"
            alt=""
          >
            <view>购买下单</view>
        </view>
        <view class="step-tiem green">
          <image
            :src="takeaway.ICON11"
            alt=""
          >
            <view>验证订单</view>
        </view>
        <view class="step-tiem green">
          <image
            :src="takeaway.ICON12"
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
            :src="takeaway.MTICON"
            alt=""
          />
          <image
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
            @click="share(takeawayBg.MTSC)"
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
        <view>1、本次活动中红包领取时间截止至2021年12月31日24点;</view>
        <view>2、订单同步为当日，下单后1小时内可同步到返佣订单;</view>
        <view>3、红包可在美团或美团外卖最新版客户端、美团外卖小程序下单且选择在线支付时使用;</view>
        <view>4、红包仅限非到店自取商超生鲜订单，超市便利、蔬菜水果、送药上门频道使用;</view>
        <view>5、使用红包时下单手机号码必须与收餐人手机号码、领取红包时输入的手机号码一致;</view>
        <view>6、此活动为部分区域有效，具体红包使用有效期及红包金额以实际收到为准;</view>
        <view>7、其余问题详见美团外卖客户端:我的一红包-美团红包、商家代金券使用说明;</view>
        <view>8、活动过程中，任何活动参与方存在虚假交易、恶意套利、作弊等不诚信行为，美团外卖有权取消活动参与方的活动资格，并保留依法追究法律责任的权利;</view>
        <view>9、活动期间，如出现不可抗力或情势变更的情况，美团外卖可依相关法律法规的规定主张免责;10、如有其它疑问请咨询美团外卖客服10109777。</view>
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
      pyqImageUrl: '',
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
          url: `${this.app.api.getWechatAppMT}?dish=${type}`,
          type: 'GET'
        })
        .then((res) => {
          this.takeawayInfo = res.data.data.data
        })
    },
    // 唤醒美团小程序
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
          closeBtn: true,
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
        data: _this.takeawayInfo.wechatUrl,
        success: (res) => {
          uni.setStorageSync('searchText', _this.takeawayInfo.wechatUrl)
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
.content-box {
  padding: 254rpx 20rpx 20rpx;
  &.waimai {
    background: #ffc11b url($mtWm) no-repeat;
    background-size: 100% auto;
    background-position: 0 0;
  }
  &.guoshu {
    background: #6dd550 url($mtSc) no-repeat;
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
          background: url($yellowDot) no-repeat;
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
            background: url($greenDot2) no-repeat;
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
    background: #fff url($yellowLine) no-repeat;
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
          background: #ffaa16;
          color: #fff;
        }
        &.copy {
          border: 3rpx solid #ffaa16;
          color: #ffaa16;
        }
      }
    }
    &.green-info {
      background: #fff url($greenLine2) no-repeat;
      background-size: 100% auto;
      background-position: 0 415rpx;
      .btn-box {
        .btn2 {
          &.share {
            background: #5bcb3c;
            color: #fff;
          }
          &.copy {
            border: 3rpx solid #5bcb3c;
            color: #5bcb3c;
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
      color: #ffaa16;
      line-height: 80rpx;
      &::before {
        display: inline-block;
        content: '';
        width: 12rpx;
        height: 12rpx;
        margin: 0 16rpx 6rpx 0;
        background: #ffaa16;
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
