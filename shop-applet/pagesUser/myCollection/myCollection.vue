<template>
  <view
    class="myCollection-wrapper"
    :class="{'myCollection-wrapper-isIpx':isIpx,'pt':goodsLoad==='暂无数据哦'}"
  >
    <app-loading :data="{load:goodsLoad}"></app-loading>
    <view>
      <view
        class="goods-list"
        :key="index"
        v-for="(item,index) in goodsList"
        @click="toProductDetail(item)"
      >
        <view
          class='choice-icon'
          @click.stop="selectOne(item)"
        >
          <icon
            v-if="item.check"
            type="success"
            size="20"
            color="red"
          ></icon>
          <icon
            v-else
            type="circle"
            size="20"
          ></icon>
        </view>
        <view class="goods-wrapper">
          <view class="goods-img">
            <image
              :src="item.imageUrl"
              lazy-load
              class="img"
            />
          </view>
          <view class="goods-info">
            <view>
              <view class="goods-name">{{item.name}}</view>
              <view class="shop-info">
                <image
                  :src="item.cpsType.logo"
                  class="shop-icon"
                /><text class="shop-name">{{item.shopInfo.name}}</text>
              </view>
            </view>
            <view>
              <view class="price-wrapper">
                <view>
                  <!-- <block v-if="item.cpsType.code === 'wph'||item.cpsType.code === 'kl'">折后 ￥</block>
                  <block v-else>券后 ￥</block> -->
                  ￥<text class="price">{{item.price}}</text>
                </view>
                <view
                  v-if="item.cpsType.code === 'wph'"
                  class="cost"
                >在售价¥{{item.cost}}</view>
                <view
                  v-else
                  class="cost"
                >原价¥{{item.cost}}</view>
              </view>
              <view
                class="goods-info-bottom"
                :class="{'goods-info-btn':showBtn}"
              >
                <view class="commission">
                  <view
                    v-if="item.cpsType.code === 'wph'||item.cpsType.code === 'kl'"
                    class="fracture"
                  >{{item.discount}}折</view>
                  <view
                    v-else
                    class="coupon"
                  >{{item.hasCoupon?item.couponInfo.price:0}}元</view>
                  <view class="csubsidyoupon">补贴 ¥{{item.normalCommission}}</view>
                </view>
                <view
                  class="invalid"
                  v-if="!item.isEffective"
                >已失效</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <block v-if='!goodsLoad'>
        <reach-bottom :reachBottom="reachBottom"></reach-bottom>
      </block>
    </view>
    <view
      class="footer"
      :class="{'foot-isIpx':isIpx}"
    >
      <view class="footer-left">
        <view
          class="all-icon"
          @click="sellectAll"
        >
          <icon
            v-if="selectall"
            type="success"
            size="24"
            color="red"
          ></icon>
          <icon
            v-else
            type="circle"
            size="24"
          ></icon>
        </view>
        <text class='all-txt'>全选</text>
      </view>
      <view class="footer-right">
        <text>当前选中{{selectedList.length}}个</text>
        <view
          class="delete"
          @click="deleteGoods"
        >删除</view>
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
      goodsLoad: false,
      noMore: false, // 没有更多
      page: 1,
      pageSize: 10,
      selectall: false,
      selectedList: [], //选中商品合集
      goodsList: [],
      reachBottom: null //null: 还没到达底部  more: 加载中  end: 没有更多商品
    }
  },
  onLoad() {
    let that = this
    uni.getSystemInfo({
      success: function (res) {
        if (res.model.search('iPhone X') != -1) {
          that.isIpx = true
        }
      }
    })
    this.getData(this.page, this.pageSize, true)
    // this.app.loading()
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  //上拉加载
  onReachBottom() {
    if (this.noMore) {
      return false
    }
    this.selectall = false
    this.selectedList = []
    this.reachBottom = 'more'
    this.getData(++this.page, this.pageSize)
      .then((res) => {
        if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
          this.reachBottom = 'end'
        } else {
          this.reachBottom = null
        }
      })
      .catch((err) => {
        this.reachBottom = null
      })
  },
  methods: {
    getData(page, pageSize, first = false, state = 1) {
      let data = { page, pageSize }
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: this.app.api.getCpsGoodsCollect,
            type: 'GET',
            data: data,
            load: first
          })
          .then((res) => {
            if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
              this.noMore = true
            } else {
              this.noMore = false
            }
            if (state === 1) {
              this.goodsList = this.goodsList.concat(res.data.data)
            } else {
              this.goodsList = res.data.data
            }
            this.goodsList.forEach((item) => {
              item.check = false
            })
            this.goodsLoad = this.goodsList.length == 0 ? '暂无数据哦' : false
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    selectOne(data) {
      data.check = !data.check
      this.selectedList = this.goodsList.filter((item) => {
        return item.check === true
      })
      if (
        this.selectedList.length > 0 &&
        this.selectedList.length === this.goodsList.length
      ) {
        this.selectall = true
      } else {
        this.selectall = false
      }
      this.$forceUpdate()
      // console.log(this.selectedList)
    },
    sellectAll() {
      this.selectall = !this.selectall
      if (this.selectall) {
        this.selectedList = this.goodsList //这里不能使用深度复制
        this.goodsList.forEach((item, index) => {
          item.check = true
        })
      } else {
        this.selectedList = []
        this.goodsList.forEach((item, index) => {
          item.check = false
        })
      }
    },
    toProductDetail(data) {
      uni.navigateTo({
        url: `/pagesGoods/detail/detail?id=${data.id}&type=${data.cpsType.code}`
      })
    },
    deleteGoods() {
      const that = this
      const collectIds = this.selectedList
        .map((item) => item.collectId)
        .join(',')
      if (collectIds == '') {
        uni.showToast({
          title: '请选择商品',
          icon: 'none',
          duration: 2000
        })
      } else {
        uni.showModal({
          title: '温馨提示',
          content: '确定要取消收藏这个商品吗？',
          confirmColor: '#F91A4C',
          success: function (res) {
            if (res.confirm) {
              that.app
                .request({
                  url: `${that.app.api.delCpsGoodsCollect}?collectIds=${collectIds}`,
                  type: 'GET'
                })
                .then((res) => {
                  that.page = 1
                  that.getData(that.page, that.pageSize, false, 2)
                  that.selectedList = []
                  that.selectall = false
                  uni.showToast({
                    title: '删除成功',
                    icon: 'none',
                    duration: 2000
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.myCollection-wrapper {
  padding: 0 24rpx 108rpx;
  &.myCollection-wrapper-isIpx {
    padding-bottom: 160rpx;
  }
  &.pt {
    padding-top: 360rpx;
  }
  .goods-list {
    display: flex;
    align-items: center;
    padding: 42rpx 22rpx;
    margin-bottom: 16rpx;
    background-color: #fff;
    border-radius: 10rpx;
    .choice-icon {
      display: flex;
      align-items: center;
      padding: 18rpx 18rpx 18rpx 0;
    }
  }
  .goods-wrapper {
    display: flex;
    .goods-img {
      overflow: hidden;
      width: 166rpx;
      height: 166rpx;
      border-radius: 5rpx;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .goods-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 166rpx;
      margin-left: 25rpx;
      .goods-name {
        width: 360rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 26rpx;
        color: $color-dark-grey;
      }
      .shop-info {
        display: flex;
        align-items: center;
        margin-top: 6rpx;
        font-size: 22rpx;
        color: #9a9a9a;
        .shop-icon {
          width: 26rpx;
          height: 26rpx;
          margin-right: 6rpx;
        }
        .shop-name {
          display: inline-block;
          width: 360rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .price-wrapper {
        display: flex;
        align-items: flex-end;
        font-size: 24rpx;
        color: #ee2325;
        .price {
          font-size: 36rpx;
          font-weight: bold;
        }
        .cost {
          margin-left: 10rpx;
          font-size: 22rpx;
          // text-decoration: line-through;
          color: #9a9a9a;
          line-height: 46rpx;
        }
      }
      .goods-info-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 6rpx;
        &.goods-info-btn {
          align-items: flex-end;
        }
        .commission {
          display: flex;
          .fracture {
            width: 80rpx;
            height: 34rpx;
            margin-right: 8rpx;
            background: url($fracture);
            background-size: contain;
            background-repeat: no-repeat;
            font-size: 20rpx;
            color: #fff;
            line-height: 32rpx;
            text-align: center;
          }
          .coupon {
            width: 109rpx;
            height: 34rpx;
            padding-left: 34rpx;
            margin-right: 8rpx;
            background: url($coupon);
            background-size: contain;
            background-repeat: no-repeat;
            font-size: 20rpx;
            color: #fff;
            // color: #fcaa1b;
            line-height: 32rpx;
            text-align: center;
          }
          .csubsidyoupon {
            display: flex;
            align-items: center;
            align-content: center;
            padding: 0 8rpx;
            height: 34rpx;
            background-color: #f2f2f2;
            border-radius: 6rpx;
            box-sizing: border-box;
            font-size: 20rpx;
            font-weight: 500;
            color: #f93227;
          }
        }
        .invalid {
          width: 100rpx;
          height: 34rpx;
          background: #c6c6c6;
          border-radius: 16rpx;
          font-size: 24rpx;
          color: #fff;
          line-height: 32rpx;
          text-align: center;
        }
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 108rpx;
    padding: 0 24rpx;
    background-color: #fff;
    box-sizing: border-box;
    .footer-left {
      display: flex;
      align-items: center;
      .all-icon {
        display: flex;
        align-items: center;
      }
      .all-txt {
        margin-left: 16rpx;
        font-size: 28rpx;
        color: $color-dark-grey;
      }
    }
    .footer-right {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: $color-grey;
      .delete {
        width: 170rpx;
        height: 60rpx;
        margin-left: 20rpx;
        background: linear-gradient(270deg, #fb0331 0%, #fa1867 100%);
        border-radius: 30rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #fff;
        line-height: 58rpx;
        text-align: center;
      }
    }
  }
}
</style>
