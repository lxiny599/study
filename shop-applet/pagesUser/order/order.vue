<template>
  <dmj-page class="myOrder-wrapper">
    <view class="catalogue">
      <navigator
        :url='item.url'
        hover-class="none"
        v-for="(item, idx) in list"
        :key="idx"
      >
        <view class="catalogue-box">
          <image
            :src='item.icon'
            mode="widthFix"
            class='logo'
          />
          <view class="catalogue-title">
            <view>{{item.title}}</view>
            <icon class="iconjiantou iconfont arrow"></icon>
          </view>
        </view>
      </navigator>
    </view>
    <app-public :data="publicData"></app-public>
  </dmj-page>
</template>

<script>
import { logoOrder } from '../../config/imgUrl'
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      list: [
        {
          name: 'pdd',
          title: '拼多多',
          icon: logoOrder.PDDICON,
          url: '/pagesUser/order/detail?type=pdd'
        },
        {
          name: 'jd',
          title: '京东',
          icon: logoOrder.JDICON,
          url: '/pagesUser/order/detail?type=jd'
        },
        {
          name: 'wph',
          title: '唯品会',
          icon: logoOrder.WPHICON,
          url: '/pagesUser/order/detail?type=wph'
        },
        {
          name: 'sn',
          title: '苏宁',
          icon: logoOrder.SNICON,
          url: '/pagesUser/order/detail?type=sn'
        },
        {
          name: 'kl',
          title: '考拉',
          icon: logoOrder.KLICON,
          url: '/pagesUser/order/detail?type=kl'
        },
        {
          name: 'mt',
          title: '美团',
          icon: logoOrder.MTICON,
          url: '/pagesUser/order/detail?type=mt'
        },
        {
          name: 'el',
          title: '饿了么',
          icon: logoOrder.ELMICON,
          url: '/pagesUser/order/detail?type=el'
        }
      ]
    }
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  methods: {}
}
</script>

<style  scoped lang="scss">
.myOrder-wrapper {
  .catalogue {
    width: 100%;
    margin-top: 16rpx;
    border-radius: $radius-size-medium;
    background-color: $color-white;
    navigator {
      &:last-child {
        .catalogue-title {
          &:after {
            display: none;
          }
        }
      }
    }
    .catalogue-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 120rpx;
      padding-right: 24rpx;
      padding-left: 14rpx;
      .logo {
        width: 70rpx;
        height: 70rpx;
      }
      .catalogue-title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 578rpx;
        height: 100%;
        font-size: 30rpx;
        color: $color-dark-grey;
        &:after {
          content: ' ';
          position: absolute;
          bottom: 1rpx;
          width: 578rpx;
          height: 1rpx;
          background-color: #eee;
          z-index: 30;
        }
        .arrow {
          font-size: 66rpx;
          color: #ccc;
        }
      }
    }
  }
}
</style>
