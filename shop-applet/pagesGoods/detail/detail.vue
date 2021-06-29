<template>
  <view
    class="detail-wrapper"
    :class="{'detail-wrapper-isIpx':isIpx}"
  >
    <view class="canvas-box">
      <canvas
        canvas-id="sharepyq"
        style="width:750px;height:1332px"
      />
    </view>
    <view
      class="back-btn-box"
      :style='{paddingTop:statusBarHeight}'
    >
      <view class="back-btn">
        <view
          @click="app.back"
          class="iconfont iconback"
        ></view>
      </view>
    </view>
    <view class="detail-content">
      <view class="detail-swiper-wrapper">
        <swiper
          class="detail-swiper"
          autoplay="true"
          duration="250"
          circular="true"
          current=0
          @change="changeSwiper"
        >
          <swiper-item
            v-for="(item,index) in goodsDetail.imageList"
            :key="index"
            class="detail-swiper-item"
          >
            <img
              :src="item"
              mode="aspectFit"
              class="swiper-img"
            >
          </swiper-item>
        </swiper>
        <view class="detail-swiper-index">{{activeIndex+1}} / {{goodsDetail.imageList.length||0}}</view>
      </view>
      <view class="baseInfo">
        <view class="price-content">
          <view class="price-box">
            <view class="price">￥<text>{{goodsDetail.price||0}}</text></view>
            <view class="cost">￥{{goodsDetail.cost||0}}</view>
          </view>
          <view
            v-if="hasLogin"
            class="csubsidyoupon"
          >补贴：{{goodsDetail.normalCommission||0}}元</view>
        </view>
        <view
          class="sales"
          v-if="goodsDetail.cpsType.code !== 'wph'&&goodsDetail.cpsType.code !== 'kl'"
        >已售 {{goodsDetail.sales||0}}件</view>
        <view class="title">
          <image
            :src="goodsDetail.cpsType.logo"
            class="title-icon"
          /><text>{{goodsDetail.name}}</text>
        </view>
        <view
          class="coupon-content"
          v-if="goodsDetail.hasCoupon"
        >
          <view>
            <text class="coupon-sign">￥</text>
            <text class="coupon-num">{{goodsDetail.couponInfo.price}}</text>
            <text
              class="coupon-txt"
              style="fontSize:24px"
            >优惠券</text>
          </view>
          <view class="coupon-time">使用时间：{{goodsDetail.couponInfo.startTime}}~{{goodsDetail.couponInfo.endTime}}</view>
          <view
            v-if="hasLogin"
            class="coupon-btn"
            @click="goByGoods"
          ></view>
          <view
            v-else
            class="coupon-btn"
            @click="toLogin"
          ></view>
        </view>
      </view>
      <view class="shopInfo">
        <img
          class="shop-icon"
          :src="goodsDetail.shopInfo.logo"
        >
        <text>{{goodsDetail.shopInfo.name}}</text>
      </view>
      <view class="detail-title">宝贝详情</view>
      <view v-if="goodsDetail.descImages&&goodsDetail.descImages.length>0">
        <image
          :src="img"
          mode="widthFix"
          alt=""
          class="descImages"
          v-for="(img, index) in goodsDetail.descImages"
          :key="index"
        />
      </view>
      <view v-else>
        <image
          :src="img"
          mode="widthFix"
          alt=""
          class="descImages"
          v-for="(img, index) in goodsDetail.imageList"
          :key="index"
        />
      </view>
    </view>
    <view
      class="footer-tab"
      :class="{'foot-isIpx':isIpx}"
    >
      <view class="footer-left">
        <navigator
          url='/pages/home/home'
          hover-class="none"
          open-type="switchTab"
        >
          <button class="footer-item">
            <icon class="iconfont iconhome"></icon>
            <view>首页</view>
          </button>
        </navigator>
        <button
          v-if="hasLogin"
          class="footer-item"
          @click="isCollectGoods"
        >
          <icon
            v-if="isCollect"
            class="iconfont iconlike-active like-active"
          ></icon>
          <icon
            v-else
            class="iconfont iconlike"
          ></icon>
          <view>收藏</view>
        </button>
        <button
          v-else
          class="footer-item"
          @click="toLogin"
        >
          <icon
            v-if="isCollect"
            class="iconfont iconlike-active like-active"
          ></icon>
          <icon
            v-else
            class="iconfont iconlike"
          ></icon>
          <view>收藏</view>
        </button>
      </view>
      <view
        v-if="hasLogin"
        class="btn-wrapper"
      >
        <view
          class="share"
          @click="apper"
        >
          <view class="text">补贴¥{{goodsDetail.normalCommission||0}}</view>
          <view class="btn-name">立即分享</view>
        </view>
        <view
          class="buy"
          @click="goByGoods"
        >
          <view class="text">省¥{{goodsDetail.buySave||0}}</view>
          <view class="btn-name">马上购买</view>
        </view>
      </view>
      <view
        v-else
        class="btn-wrapper"
        @click="toLogin"
      >
        <view class="share">
          <!-- <view>补贴¥{{goodsDetail.normalCommission}}</view> -->
          <view class="btn-name text-big">立即分享</view>
        </view>
        <view class="buy">
          <!-- <view>省¥{{goodsDetail.buySave}}</view> -->
          <view class="btn-name text-big">马上购买</view>
        </view>
      </view>
    </view>
    <view
      v-if="isAlert"
      @touchmove.stop='()=>{}'
      @mousemove.stop='()=>{}'
    >
      <view
        :class="{'hide':!isChoose}"
        class="maskLayer"
        @click="hide()"
      ></view>
      <view
        class="share-container"
        :class="{'hide':!isChoose}"
      >
        <view
          class="close-box"
          @click="hide()"
        >
          <icon class="iconfont iconclose ic-close"></icon>
        </view>
        <view class="share-title">分享文案</view>
        <!-- <textarea
          maxlength="-1"
          class="textarea"
        ></textarea> -->
        <div class="textarea">
          <div>
            {{goodsDetail.name}}<br />
            <block v-if="type == 'wph'">【在售价】</block>
            <block v-else>【原价】</block>{{goodsDetail.cost}}元<br />
            【券后价】{{goodsDetail.price}}元
          </div>
          <div class="color-grey">
            -------------------<br />
            【下单链接】{{shortUrl}}
          </div>
        </div>
        <view class="icon-box">
          <view
            class="icon-item"
            @click="copyCode"
          >
            <icon class="icon-base64 svg-copyLink"></icon>
            <view>复制链接</view>
          </view>
          <button
            class="icon-item share"
            open-type="share"
          >
            <icon class="icon-base64 svg-weChat"></icon>
            <view>分享好友</view>
          </button>
          <view
            class="icon-item"
            @click="sharePyq"
          >
            <icon class="icon-base64 svg-share"></icon>
            <view>分享海报</view>
          </view>
        </view>
      </view>
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      isIpx: false, // 是否iphone X
      activeIndex: 0, // 轮播图索引
      shortUrl: '', // 分享链接
      statusBarHeight: 0,
      goodsDetail: [],
      isAlert: false,
      isChoose: false,
      goodsId: '',
      type: '',
      referId: '',
      avatarUrl: '',
      nickName: '',
      pyqImageUrl: '',
      isPosterReady: false // 分享到朋友圈的海报准备好了吗 ？
    }
  },
  onLoad(options) {
    // console.log(options)
    var that = this
    if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      const arr = scene.split('&')
      this.type = arr[0]
      this.goodsId = arr[1]
      uni.setStorageSync('superiorId', arr[2])
    }
    if (options.referId != undefined) {
      uni.setStorageSync('superiorId', options.referId)
    }
    if (options.type && options.id) {
      this.type = options.type
      this.goodsId = options.id
    }
    //检测手机状态栏的高度
    const res = uni.getSystemInfoSync()
    this.statusBarHeight = res.statusBarHeight + 'px'
    uni.getSystemInfo({
      success: function (res) {
        if (res.model.search('iPhone X') != -1) {
          that.isIpx = true
        }
      }
    })
    if (!this.hasLogin) {
      uni.hideShareMenu()
    }
  },
  onShow() {
    // this.warn()
    this.getData(this.type, this.goodsId)
    // if (this.hasLogin) {
    //   this.getInfo()
    // }
    this.nickName = uni.getStorageSync('nickName')
    this.referId = uni.getStorageSync('referId')
    this.$cli && this.app.productSearch()
  },
  onShareAppMessage(ops) {
    // fun(this, {})
    // funt (this, obj){
    //   tile = obj.title || '1111'
    // }
    this.isAlert = false
    const that = this //这一句非常必要  否则 this指向会错误
    return {
      title: that.nickName + '推荐' + that.goodsDetail.name,
      path: `/pagesGoods/detail/detail?id=${that.goodsId}&type=${that.type}&referId=${that.referId}`,
      imageUrl: that.goodsDetail.imageList[0]
    }
  },
  onShareTimeline(ops) {
    this.isAlert = false
    const that = this //这一句非常必要  否则 this指向会错误
    const query = `id=${that.goodsId}&type=${that.type}&referId=${that.referId}`
    return {
      title: that.nickName + '推荐' + that.goodsDetail.name,
      query: query,
      imageUrl: that.goodsDetail.imageList[0]
    }
  },
  computed: {
    isCollect() {
      return this.goodsDetail.isCollect
    },
    hasLogin() {
      return this.$store.state.hasLogin
    },
    shareText() {
      return `${this.goodsDetail.name}\n${
        this.type === 'wph' ? '【在售价】' : '【原价】'
      }${this.goodsDetail.cost}元\n【券后价】${
        this.goodsDetail.price
      }元\n-------------------\n【下单链接】${this.shortUrl}`
    }
  },
  methods: {
    warn(data) {
      this.app.open({
        slot: 'warning',
        skin: 'warning',
        escBtn: false,
        yesBtn: false,
        methods: {
          goRule() {
            if (data) {
              uni.navigateTo({
                url: `/pagesOther/web-view/web-view?url=${data}`
              })
            }
          }
        }
      })
    },
    // 复制邀请码
    copyCode() {
      const _this = this
      // 此方法H5不支持
      uni.setClipboardData({
        data: _this.shareText,
        success: (res) => {
          uni.setStorageSync('searchText', _this.shareText)
        }
      })
    },
    toLogin() {
      uni.navigateTo({
        url: '../../pagesOther/login/login'
      })
    },
    // 获取轮播图当前图片的索引值
    changeSwiper(e) {
      this.activeIndex = e.detail.current
    },
    getData(type, id) {
      const apiName = 'getByGoodsId' + type.toUpperCase()
      this.app
        .request({
          url: `${this.app.api[apiName]}?goodsId=${id}`,
          type: 'GET',
          load: true
        })
        .then((res) => {
          this.goodsDetail = res.data.data
          if (res.data.data.isLowerPrice) {
            this.warn(res.data.data.lowerPriceRuleUrl)
          }
        })
    },
    apper() {
      this.getInfo(false)
      this.isChoose = this.isAlert = true
    },
    hide() {
      this.isChoose = false
      let that = this
      setTimeout(function () {
        that.isAlert = false
      }, 300)
    },
    //获取分享海报图
    getHaibao() {
      const that = this
      return new Promise((resolve, reject) => {
        if (this.pyqImageUrl) return resolve(this.pyqImageUrl)
        this.app.loading()
        this.avatarUrl = uni.getStorageSync('avatarUrl')
        this.getProfit().then(() => {
          const imgUrl = encodeURIComponent(this.goodsDetail.imageList[0])
          const scene = encodeURIComponent(`${this.type}&${this.goodsId}`)
          const page = encodeURIComponent('pagesGoods/detail/detail')
          this.app
            .getTemp([
              this.avatarUrl,
              `${this.app.api.downloadImage}?uri=${imgUrl}`,
              `${this.app.api.wxaGetImage}?page=${page}&scene=${scene}`
            ])
            .then((tempImgList) => {
              const ctx = uni.createCanvasContext('sharepyq')
              ctx.fillStyle = '#F3F3F3'
              ctx.fillRect(0, 0, 750, 1332)
              ctx.drawImage('../../static/product/dmj.png', 194, 34, 51, 50)
              ctx.setFillStyle('#333')
              ctx.setFontSize(32)
              ctx.fillText('呆萌价', 252, 70)
              ctx.drawImage('../../static/product/connect.png', 366, 55, 17, 17)
              if (this.type == 'jd') {
                ctx.drawImage('../../static/product/jd.png', 406, 34, 52, 50)
                ctx.setFillStyle('#333')
                ctx.setFontSize(32)
                ctx.fillText('京东', 465, 70)
              } else if (this.type == 'wph') {
                ctx.drawImage('../../static/product/wph.png', 406, 34, 52, 50)
                ctx.setFillStyle('#333')
                ctx.setFontSize(32)
                ctx.fillText('唯品会', 465, 70)
              } else if (this.type == 'pdd') {
                ctx.drawImage('../../static/product/pdd.png', 406, 34, 52, 50)
                ctx.setFillStyle('#333')
                ctx.setFontSize(32)
                ctx.fillText('拼多多', 465, 70)
              } else if (this.type == 'sn') {
                ctx.drawImage('../../static/product/sn.png', 406, 34, 52, 50)
                ctx.setFillStyle('#333')
                ctx.setFontSize(32)
                ctx.fillText('苏宁', 465, 70)
              } else if (this.type == 'kl') {
                ctx.drawImage('../../static/product/kl.png', 406, 34, 52, 50)
                ctx.setFillStyle('#333')
                ctx.setFontSize(32)
                ctx.fillText('考拉', 465, 70)
              }
              // 商品信息
              ctx.save()
              ctx.translate(20, 118)
              that.$app.canvas.drawRoundRectPath(ctx, 710, 952, 16)

              // ctx.setLineWidth(20)
              // ctx.strokeStyle = '#f3f3f3'
              // ctx.stroke()
              ctx.fillStyle = '#fff' // 若是给定了值就用给定的值否则给予默认值
              ctx.fill()
              ctx.clip()
              // 价格划线
              const length = that.goodsDetail.cost.toString().length * 24
              ctx.beginPath()
              ctx.moveTo(16, 914)
              ctx.lineTo(86 + length, 914)
              ctx.setLineWidth(2)
              ctx.strokeStyle = '#999'
              ctx.stroke()
              // 宣传图
              ctx.drawImage(tempImgList[1], 0, 0, 710, 712)
              // 标题
              ctx.setFillStyle('#333')
              ctx.setFontSize(32)
              that.$app.canvas.textPrewrap(
                ctx,
                that.goodsDetail.name,
                21,
                770,
                40,
                640,
                2
              )
              // 价格
              ctx.setFillStyle('#f2263c')
              ctx.setFontSize(24)
              if (this.type == 'wph' || this.type == 'kl') {
                ctx.fillText('折后价 ￥', 19, 884)
              } else {
                ctx.fillText('券后价 ￥', 19, 884)
              }
              ctx.setFillStyle('#f2263c')
              ctx.setFontSize(48)
              ctx.fillText(that.goodsDetail.price, 120, 884)
              // 原价
              ctx.setFillStyle('#999')
              ctx.setFontSize(24)
              ctx.fillText(
                `${this.type === 'wph' ? '在售价 ￥' : '原价 ￥'}`,
                19,
                922
              )
              ctx.setFillStyle('#999')
              ctx.setFontSize(24)
              ctx.fillText(
                that.goodsDetail.cost,
                `${this.type === 'wph' ? 124 : 100}`,
                922
              )
              // 券
              if (this.type == 'wph' || this.type == 'kl') {
                ctx.drawImage(
                  '../../static/product/discount.png',
                  525,
                  864,
                  164,
                  64
                )
                // item.discount
                ctx.setFillStyle('#fff')
                ctx.setFontSize(36)
                const str = `${that.goodsDetail.discount}折`
                const strLength = ctx.measureText(str).width
                ctx.fillText(str, 525 + (164 - strLength) / 2, 908)
              } else {
                ctx.drawImage(
                  '../../static/product/coupon.png',
                  489,
                  864,
                  200,
                  64
                )
                ctx.setFillStyle('#fff')
                ctx.setFontSize(36)
                const str = that.goodsDetail.hasCoupon
                  ? `${that.goodsDetail.couponInfo.price}元`
                  : '0元'
                const strLength = ctx.measureText(str).width
                ctx.fillText(str, 546 + (140 - strLength) / 2, 908)
              }
              ctx.restore()
              // 用户信息
              ctx.translate(20, 1095)
              that.$app.canvas.drawRoundRectPath(ctx, 711, 200, 16)
              ctx.setLineWidth(4)
              ctx.setLineDash([20, 6])
              ctx.strokeStyle = '#FBDEC4'
              ctx.stroke()
              ctx.fillStyle = '#FCF1D3'
              ctx.restore()
              ctx.fill()
              //绘制圆形头像
              ctx.beginPath()
              that.$app.canvas.drawCircle({
                ctx: ctx,
                img: tempImgList[0],
                avatarX: 36,
                avatarY: 34,
                imgWidth: 132,
                imgHeight: 132
              })
              ctx.setLineWidth(3)
              ctx.strokeStyle = '#FBDEC4'
              ctx.setLineDash([20, 0])
              ctx.stroke()
              ctx.setFillStyle('#FC564B')
              ctx.setFontSize(34)
              ctx.fillText(this.nickName, 200, 74)
              ctx.setFillStyle('#FC564B')
              ctx.setFontSize(26)
              ctx.fillText('邀请您享受内部优惠券', 200, 110)
              that.$app.canvas.fillRoundRect(
                ctx,
                190,
                122,
                284,
                40,
                20,
                '#FC4968'
              )
              ctx.setFillStyle('#ffffff')
              ctx.setFontSize(22)
              ctx.fillText('长按二维码识别小程序', 206, 150)
              ctx.drawImage('../../static/product/arrow.png', 435, 136, 22, 12)

              ctx.drawImage(tempImgList[2], 523, 18, 164, 164)
              ctx.restore()

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
            })
            .catch((err) => {
              console.log('获取海报失败', err)
              that.app.loading(false)
              reject(err)
            })
        })
      })
    },
    getProfit() {
      return new Promise((resolve, reject) => {
        if (uni.getStorageSync('profit')) {
          this.profit = uni.getStorageSync('profit')
          resolve(this.profit)
        } else {
          this.app
            .request({
              api: 'userCenterData',
              cancelShade: false
              // load: true
            })
            .then((res) => {
              //每次展示都重新获取用户信息（金额）
              this.profit = res.data.data.userType
              resolve(this.profit)
            })
            .catch((err) => {
              reject(err)
            })
        }
      })
    },
    //分享至朋友圈弹窗
    sharePyq() {
      const that = this
      this.isAlert = false
      this.isChoose = false
      this.isPosterReady = false //如果生成海报时间过长就取消遮罩  避免用户无法操作
      setTimeout(() => {
        if (!this.isPosterReady) {
          this.app.loading(false)
        }
      }, 10000)
      this.getHaibao().then(() => {
        this.isPosterReady = true
        this.app.loading(false)
        this.app.open({
          slot: 'sharePyq',
          skin: 'shareBottom max',
          title: '',
          closeBtn: true,
          escBtn: false,
          yesBtn: false,
          backEsc: true,
          imgUrl: this.pyqImageUrl,
          methods: {
            saveImg() {
              that.$app
                .authorize('writePhotosAlbum', that.pyqImageUrl)
                .then(() => {
                  that.app.msg('保存成功，去分享吧~')
                })
                .catch((err) => console.log('用户取消分享', err.errMsg))
            }
          }
        })
      })
    },
    // 唤醒对应小程序
    goByGoods() {
      this.getInfo().then((res) => {
        uni.navigateToMiniProgram({
          appId: res.wechatApp.appId,
          path: res.wechatApp.path,
          success(res) {
            console.log('成功')
          }
        })
      })
    },
    getInfo(isAlert = true) {
      const that = this
      const apiName = 'genByGoodsId' + this.type.toUpperCase()
      const data = {
        goodsId: this.goodsDetail.id
      }
      if (this.type === 'jd' || this.type === 'sn') {
        if (this.goodsDetail.couponInfo) {
          data.link = encodeURIComponent(this.goodsDetail.couponInfo.link)
        }
      }
      if (this.type === 'pdd') {
        data.needAuth = true
      } else {
        data.needAuth = false
      }
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: this.app.api[apiName],
            type: 'GET',
            data: data
          })
          .then((res) => {
            this.shortUrl = res.data.data.shortUrl
            console.log(res)
            resolve(res.data.data)
          })
          .catch((err) => {
            // reject(err)
            // console.log(err)
            if (err.data.code === 601) {
              this.shortUrl = err.data.data.shortUrl
              if (isAlert) {
                this.app.open({
                  slot: 'pddAuthorize',
                  skin: 'pddAuthorize',
                  backEsc: true,
                  escBtn: false,
                  yesBtn: false,
                  methods: {
                    goAuthorize() {
                      that.app.openEsc()
                      uni.navigateToMiniProgram({
                        appId: err.data.data.wechatApp.appId,
                        path: err.data.data.wechatApp.path,
                        success(res) {
                          console.log('成功')
                        }
                      })
                    }
                  }
                })
              }
            }
          })
      })
    },
    // 是否收藏商品
    isCollectGoods() {
      const data = {
        goodsId: this.goodsId
      }
      let apiName = ''
      if (!this.isCollect) {
        apiName = 'collectGoodsById' + this.type.toUpperCase()
      } else {
        apiName = 'unCollectGoodsById' + this.type.toUpperCase()
      }
      this.goodsDetail.isCollect = !this.goodsDetail.isCollect
      this.app
        .request({
          url: this.app.api[apiName],
          type: 'GET',
          data: data
        })
        .then((res) => {
          if (this.isCollect) {
            uni.showToast({
              title: '收藏成功',
              duration: 2000,
              icon: 'none'
            })
          } else {
            uni.showToast({
              title: '取消收藏',
              duration: 2000,
              icon: 'none'
            })
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.canvas-box {
  position: fixed;
  bottom: -3000rpx;
  left: -4000rpx;
}
.detail-wrapper {
  padding-bottom: 107rpx;
  &.detail-wrapper-isIpx {
    padding-bottom: 160rpx;
  }
}
.detail-swiper-wrapper {
  position: relative;
  width: 100%;
  height: 750rpx;
  .detail-swiper {
    width: 100%;
    height: 750rpx;
    .detail-swiper-item {
      width: 100%;
      height: 100%;
      .swiper-img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .detail-swiper-index {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    right: 19rpx;
    bottom: 16rpx;
    width: 80rpx;
    height: 44rpx;
    background: rgba(4, 4, 4, 0.6);
    border-radius: 24rpx;
    font-size: 22rpx;
    color: #f2f2f2;
    line-height: 24rpx;
  }
}
.baseInfo {
  padding: 36rpx 18rpx 22rpx;
  margin-bottom: 10rpx;
  background-color: #fff;
  .price-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .price-box {
      display: flex;
      align-items: flex-start;
      .price {
        font-size: 36rpx;
        font-weight: bold;
        color: #ff353b;
        line-height: 60rpx;
        text {
          font-size: 58rpx;
        }
      }
      .cost {
        margin-left: 6rpx;
        font-size: 24rpx;
        text-decoration: line-through;
        color: #999;
        line-height: 40rpx;
      }
    }
    .csubsidyoupon {
      position: relative;
      // width: 217rpx;
      height: 44rpx;
      padding: 0rpx 24rpx 0rpx 48rpx;
      font-size: 24rpx;
      color: #fff;
      background: linear-gradient(to right, #fc6784 0%, #fd3a40 100%);
      border-radius: 22rpx;
      box-sizing: border-box;
      line-height: 42rpx;
      &::before {
        position: absolute;
        left: 4rpx;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 36rpx;
        height: 36rpx;
        background: url($redPacket);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }
  .sales {
    margin: 6rpx 0rpx 20rpx;
    font-size: 24rpx;
    color: #999;
  }
  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 34rpx;
    font-weight: 500;
    color: #333;
    .title-icon {
      width: 30rpx;
      height: 30rpx;
      vertical-align: -8%;
      margin-right: 6rpx;
    }
  }
  .coupon-content {
    position: relative;
    margin-top: 30rpx;
    padding: 12rpx 0rpx 0rpx 29rpx;
    width: 100%;
    height: 110rpx;
    font-size: 20rpx;
    color: #fff;
    background: url($couponBg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;
    .coupon-sign {
      font-size: 36rpx;
      line-height: 38rpx;
      font-weight: bold;
    }
    .coupon-num {
      margin-right: 6rpx;
      font-size: 48rpx;
      line-height: 50rpx;
      font-weight: bold;
    }
    .coupon-txt {
      font-size: 24rpx;
      line-height: 26rpx;
      font-weight: bold;
    }
    .coupon-time {
      margin-top: 6rpx;
    }
    .coupon-btn {
      position: absolute;
      right: 13rpx;
      top: 11rpx;
      width: 134rpx;
      height: 90rpx;
    }
  }
}
.shopInfo {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  background-color: #fff;
  .shop-icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 18rpx;
  }
}
.detail-title {
  position: relative;
  width: 100%;
  height: 88rpx;
  padding-left: 38rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #666;
  background-color: #fff;
  line-height: 86rpx;
  &::before {
    position: absolute;
    left: 20rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 4rpx;
    height: 24rpx;
    background: #ff353b;
    border-radius: 2rpx;
    content: '';
  }
}
.descImages {
  display: block;
  width: 100%;
  height: auto;
}
.footer-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: 107rpx;
  padding: 0rpx 20rpx;
  box-sizing: border-box;
  background: #fff;
  .footer-left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-right: 10rpx;
    .footer-item {
      padding: 12rpx 0 0;
      margin: 0 10rpx;
      background-color: transparent;
      font-size: 20rpx;
      font-weight: 500;
      color: $color-light-grey;
      text-align: center;
      line-height: 30rpx;
      .iconfont {
        font-size: 56rpx;
        color: $color-dark-grey;
      }
      .like-active {
        color: #f64841;
      }
    }
  }
  .btn-wrapper {
    display: flex;
    align-items: center;
    width: 480rpx;
    height: 86rpx;
    border-radius: 70rpx;
    overflow: hidden;
    & > view {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 100%;
      font-size: 30rpx;
      line-height: 34rpx;
      color: #fff;
    }
    .share {
      padding-top: 6rpx;
      background: linear-gradient(
        -63deg,
        rgba(255, 149, 5, 1) 0%,
        rgba(251, 201, 3, 1) 100%
      );
    }
    .buy {
      padding-top: 6rpx;
      background: linear-gradient(
        136deg,
        rgba(253, 109, 111, 1) 0%,
        rgba(247, 71, 63, 1) 100%
      );
    }
    .text {
      font-weight: 600;
    }
    .btn-name {
      font-size: 20rpx;
      &.text-big {
        font-size: 30rpx;
      }
    }
  }
}
.maskLayer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  animation: anFadeIn 0.3s;
  background-color: rgba(0, 0, 0, 0.6);
  &.hide {
    opacity: 0;
    animation: anFadeOut 0.3s;
  }
}
.share-container {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 562rpx;
  padding: 0 24rpx;
  background-color: #fff;
  border-radius: 16rpx 16rpx 0rpx 0rpx;
  box-sizing: border-box;
  animation: anUp 0.3s;
  .close-box {
    position: absolute;
    right: 24rpx;
    top: 28rpx;
    width: 36rpx;
    height: 36rpx;
    padding: 6rpx;
    // background-color: #f64841;
    .ic-close {
      font-size: 24rpx;
      color: $color-light-grey;
    }
  }
  &.hide {
    opacity: 0;
    animation: anDown 0.3s;
  }
  .share-title {
    width: 100%;
    height: 88rpx;
    line-height: 86rpx;
    text-align: center;
  }
  .textarea {
    overflow: auto;
    width: 100%;
    height: 280rpx;
    padding: 34rpx 30rpx;
    background-color: $color-bg-main;
    border-radius: 16rpx;
    box-sizing: border-box;
    font-size: 24rpx;
    font-weight: 500;
    color: $color-light-grey;
    line-height: 36rpx;
    .color-grey {
      word-wrap: break-word;
      color: $color-grey;
    }
  }
  .icon-box {
    display: flex;
    justify-content: space-around;
    margin-top: 36rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: $color-grey;
    line-height: 36rpx;
    .icon-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &.share {
        padding: 0;
        margin: 0;
        background-color: transparent;
        font-size: 24rpx;
        font-weight: 500;
        color: $color-grey;
        line-height: 36rpx;
      }
    }
    .icon-base64 {
      width: 100rpx;
      height: 100rpx;
    }
  }
}
</style>
