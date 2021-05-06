<template>
  <view class="goods-wrapper" @click="toProductDetail(item)">
    <view class="goods-img">
      <image :src="item.imageUrl" lazy-load class="img" />
    </view>
    <view class="goods-info">
      <view>
        <view class="goods-name">{{item.name}}</view>
        <view class="shop-info">
          <image :src="item.cpsType.logo" class="shop-icon" /><text class="shop-name">{{item.shopInfo.name}}</text>
        </view>
      </view>
      <view>
        <view class="price-wrapper">
          <view>
            <!-- <block ||item.cpsType.code === 'kl'">折后 ￥</block>
            <block v-else>券后 ￥</block> -->
            ￥<text class="price">{{item.price}}</text>
          </view>
          <view v-if="item.cpsType.code === 'wph'" class="cost">在售价¥{{item.cost}}</view>
          <view v-else class="cost">原价¥{{item.cost}}</view>
        </view>
        <view class="goods-info-bottom" :class="{'goods-info-btn':showBtn}">
          <view class="commission">
            <view v-if="item.cpsType.code === 'wph'||item.cpsType.code === 'kl'" class="fracture">{{item.discount}} 折</view>
            <view v-else class="coupon">{{item.hasCoupon?item.couponInfo.price:0}}元</view>
            <view class="csubsidyoupon" v-if="hasLogin">补贴 ¥{{item.normalCommission}}</view>
          </view>
          <view v-if="!showBtn" class="sales">已售 {{item.sales}}</view>
          <!-- <view
            v-else
            class="buy-btn"
          >立即抢购</view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: null,
      default: []
    },
    showBtn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasLogin() {
      return this.$store.state.hasLogin
    }
  },
  data() {
    return {
      toProductDetail(data) {
        // console.log(shop);
        uni.navigateTo({
          url: `/pagesGoods/detail/detail?id=${data.id}&type=${data.cpsType.code}`
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.goods-wrapper {
  display: flex;
  .goods-img {
    overflow: hidden;
    width: 220rpx;
    height: 220rpx;
    border-radius: 16rpx;
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
    height: 220rpx;
    margin-left: 26rpx;
    .goods-name {
      width: 100%;
      @include multiLineEllipsis($lineHiehgt: 36rpx, $lineCount: 2);
      font-size: 28rpx;
      font-weight: 500;
      color: #303030;
    }
    .shop-info {
      display: flex;
      align-items: center;
      margin-top: 6rpx;
      font-size: 22rpx;
      color: #9a9a9a;
      .shop-icon {
        width: 28rpx;
        height: 28rpx;
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
      vertical-align: middle;
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
      position: relative;
      z-index: 1;
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
          display: flex;
          align-items: center;
          align-content: center;
          justify-content: center;
          width: 109rpx;
          height: 34rpx;
          padding-left: 40rpx;
          padding-right: 4rpx;
          margin-right: 8rpx;
          background: url($coupon);
          background-size: contain;
          background-repeat: no-repeat;
          font-size: 20rpx;
          color: #fff;
          // color: #fcaa1b;
          line-height: 22rpx;
        }
        .csubsidyoupon {
          display: flex;
          align-items: center;
          align-content: center;
          padding: 0 8rpx;
          height: 34rpx;
          // line-height: 30rpx;
          // border: 1rpx solid #ea3d54;
          background-color: #f2f2f2;
          border-radius: 6rpx;
          box-sizing: border-box;
          font-size: 20rpx;
          font-weight: 500;
          color: #f93227;
          line-height: 22rpx;
        }
      }
      .sales {
        font-size: 22rpx;
        color: #9a9a9a;
      }
      .buy-btn {
        position: absolute;
        right: 0rpx;
        bottom: 0rpx;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        width: 129rpx;
        // height: 48rpx;
        padding: 6rpx 0 10rpx;
        border: 1rpx solid #f82f23;
        border-radius: 30rpx;
        box-sizing: border-box;
        font-size: 24rpx;
        font-weight: 500;
        color: #f82f23;
        // line-height: 26px;
        text-align: center;
      }
    }
  }
}
</style>
