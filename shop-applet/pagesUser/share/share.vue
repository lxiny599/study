<template>
  <view class="share-wrapper">
    <view class="share-box">
      <view class="canvas-box">
        <canvas
          canvas-id="shareIndex"
          style="width:750px;height:1332px"
        />
      </view>
      <view
        v-if="isShow"
        class="poster"
      >
        <swiper
          class="swiper"
          previous-margin='95rpx'
          next-margin='95rpx'
          :circular='circular'
          current=0
          @change="changeSwiper"
        >
          <swiper-item
            class="swiper-item"
            v-for="(item,index) in imageUrl"
            :key="index"
          >
            <view
              class="img-box"
              :class="{'small':index!==activeIndex}"
            >
              <image
                v-if="item&&item!=''"
                class="img"
                :src='item'
              />
            </view>
          </swiper-item>
        </swiper>
      </view>
      <view
        v-else
        class="poster poster-no"
      >
        <image
          class="loadong-img"
          src="../../static/loading.gif"
          mode='widthFix'
        />
      </view>
      <view class="btn-wrapper">
        <button
          class="share-btn btn1"
          open-type="share"
        >
          <icon class="iconfont iconlink"></icon>
          <text>分享链接</text>
        </button>
        <button
          class="share-btn btn2"
          @tap="shareImg"
        >
          <icon class="iconfont iconshare"></icon>
          <text>分享海报</text>
        </button>
      </view>
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
import { SHARE_IMG } from '../../config/imgUrl'
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      activeIndex: 0, //轮播图索引
      imageUrl: [],
      referId: '',
      isShow: false,
      circular1: false,
      circular2: false
    }
  },
  onLoad() {
    uni.hideShareMenu()
    this.getData()
    this.referId = uni.getStorageSync('referId')
    // this.getShareImg()
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  onShareAppMessage(ops) {
    const that = this //这一句非常必要  否则 this指向会错误
    return {
      title: '快来一起加入呆萌价',
      path: '/pages/home/home?referId=' + that.referId,
      imageUrl: SHARE_IMG
    }
  },
  computed: {
    circular() {
      return this.circular1 && this.circular2
    }
  },
  methods: {
    // 获取轮播图当前图片的索引值
    changeSwiper(e) {
      this.activeIndex = e.detail.current
      this.circular1 = true
    },
    getData() {
      const that = this
      this.app
        .request({
          url: `${this.app.api.advList}?site=04`,
          type: 'GET'
        })
        .then((res) => {
          // console.log(res.data.data.advList)
          // Promise.all([
          //   res.data.data.advList.map((item) => that.getShareImg(item.imageUrl))
          // ]).then((res1) => {
          //   console.log(res1)
          //   // this.imageUrl = res1
          // })
          // res.data.data.advList.forEach(async (item, index) => {
          //   await that.getShareImg(item.imageUrl).then((res) => {
          //     console.log(88)
          //     that.imageUrl.push(res)
          //   })
          // })
          let advList = res.data.data
          let page = encodeURIComponent('pages/home/home')
          let code = ''
          uni.downloadFile({
            url: `${this.app.api.wxaGetImage}?page=${page}`,
            header: { Authorization: uni.getStorageSync('Authorization') },
            async success(res1) {
              code = res1.tempFilePath
              for (let i = 0; i < advList.length; i++) {
                await that
                  .getShareImg(advList[i].imageUrl, code)
                  .then((res) => {
                    if (i === 1 || advList.length === 1) {
                      that.isShow = true
                    }
                    that.imageUrl.push(res)
                  })
              }
              // that.isShow = true
              that.circular2 = true
            },
            fail(err) {
              console.log(err)
              // this.app.loading(false)
            }
          })
        })
        .catch((res) => {
          console.log(res)
        })
    },
    getShareImg(img, code) {
      const that = this
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: img,
          header: { Authorization: uni.getStorageSync('Authorization') },
          success(res) {
            const ctx = uni.createCanvasContext('shareIndex')
            ctx.clearRect(0, 0, 750, 1332)
            ctx.drawImage(res.tempFilePath, 0, 0, 750, 1332)
            that.$app.canvas.drawCircle({
              ctx: ctx,
              img: code,
              avatarX: 750 / 2 - 129,
              avatarY: 1000,
              imgWidth: 240,
              imgHeight: 240,
              num: 18
            })
            ctx.draw(false, () => {
              //分享图片
              uni.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 750,
                height: 1332,
                destWidth: 1080,
                destHeight: 1918,
                fileType: 'jpg',
                quality: 0.8,
                canvasId: 'shareIndex',
                success: (res) => {
                  // that.imageUrl[index] = res.tempFilePath
                  resolve(res.tempFilePath)
                },
                fail: (err) => {
                  reject(err)
                }
              })
            })
          },
          fail(err) {
            console.log(err)
            // this.app.loading(false)
          }
        })
        // that.app
        //   .getTemp([img, `${this.app.api.wxaGetImage}?page=${page}`])
        //   .then((tempImgList) => {
        //     const ctx = uni.createCanvasContext('shareIndex')
        //     ctx.clearRect(0, 0, 750, 1332)
        //     ctx.drawImage(tempImgList[0], 0, 0, 750, 1332)
        //     that.app.drawCircle({
        //       ctx: ctx,
        //       img: tempImgList[1],
        //       avatarX: 750 / 2 - 109,
        //       avatarY: 1000,
        //       imgWidth: 200,
        //       imgHeight: 200,
        //       num: 18
        //     })
        //     ctx.draw(false, () => {
        //       //分享图片
        //       uni.canvasToTempFilePath({
        //         x: 0,
        //         y: 0,
        //         width: 750,
        //         height: 1332,
        //         destWidth: 1080,
        //         destHeight: 1918,
        //         fileType: 'jpg',
        //         quality: 0.8,
        //         canvasId: 'shareIndex',
        //         success: (res) => {
        //           // that.imageUrl[index] = res.tempFilePath
        //           resolve(res.tempFilePath)
        //         },
        //         fail: (err) => {
        //           reject(err)
        //         }
        //       })
        //     })
        //   })
      })
    },
    // 保存图片到相册
    shareImg() {
      this.$app
        .authorize('writePhotosAlbum', this.imageUrl[this.activeIndex])
        .then((res) => {
          //保存图片
          this.app.msg('保存成功，去分享吧~')
        })
        .catch((err) => {
          cosole.log('图片保存失败', err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.share-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding-top: 8vh;
}
// .share-box {
//   position: relative;
//   top: 50%;
//   transform: translateY(-56%);
// }
.canvas-box {
  position: fixed;
  bottom: -3000rpx;
  left: -4000rpx;
}
.poster {
  position: relative;
  height: 929rpx;
  // margin: 30rpx 0;
  &.poster-no {
    padding-top: 360rpx;
    background-color: #f2f2f2;
    // line-height: 900rpx;
    text-align: center;
    .loadong-img {
      width: 200rpx;
      height: auto;
    }
  }
  .swiper {
    width: 100%;
    height: 100%;
    .swiper-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 522rpx;
      .img-box {
        overflow: hidden;
        width: 522rpx;
        height: 929rpx;
        background-color: #f0f;
        border-radius: 16rpx;
        transition: 500ms;
        &.small {
          transform: scale(0.9);
        }
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.btn-wrapper {
  display: flex;
  justify-content: space-between;
  width: 516rpx;
  margin: 69rpx auto 0;
  .share-btn {
    width: 214rpx;
    height: 70rpx;
    border-radius: 36rpx;
    font-size: 26rpx;
    font-weight: bold;
    color: #fff;
    line-height: 68rpx;
    text-align: center;
  }
  .btn1 {
    background: linear-gradient(196deg, #fbca03 0%, #ff9606 100%);
    box-shadow: 5rpx 5rpx 10rpx rgba(251, 202, 3, 0.4);
  }
  .btn2 {
    background: linear-gradient(160deg, #f8483f 0%, #fd6e70 100%);
    box-shadow: 5rpx 5rpx 10rpx rgba(248, 72, 63, 0.4);
  }
}
.iconfont {
  font-size: 26rpx;
  margin-right: 8rpx;
}
</style>
