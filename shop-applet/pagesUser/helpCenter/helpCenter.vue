<template>
  <view class="container">
    <view class="help-list">
      <scroll-view
        class="nav-left"
        scroll-y
      >
        <block
          v-for="(item,index) in helpList"
          :key="index"
        >
          <view
            class="nav-left-item"
            :class="{'active':index===tabAc}"
            @click="changeTitle(index)"
          >
            <text>{{item.title}}</text>
          </view>
        </block>
      </scroll-view>
      <block
        v-for="(items,idxs) in helpList"
        :key="idxs"
      >
        <scroll-view
          class="nav-right"
          scroll-y
          v-show="idxs===tabAc"
        >
          <view
            class="nav-right-item"
            v-for="(item,idx) in items.problemSimpleVoList"
            :key="idx"
            @click="goHelpDetail(item)"
          >{{item.problemName}}</view>
        </scroll-view>
      </block>
    </view>
    <view
      class="service"
      :class="{'foot-isIpx':isIpx}"
    >
      <button
        class="service-btn"
        :session-from="'weapp|nickName='+userInfo.nickName+'|avatarUrl='+userInfo.avatarUrl"
        open-type="contact"
      >
        <icon class="iconfont iconWeChat"></icon>联系客服
      </button>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isIpx: false, // 是否iphone X
      tabAc: 0,
      helpList: []
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
    this.getData()
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  computed: mapState(['userInfo']),
  methods: {
    getData() {
      this.app
        .request({
          api: 'getHelpList',
          type: 'GET'
        })
        .then((res) => {
          this.helpList = res.data.data
          this.helpList.forEach((item, index) => {
            let title = ''
            switch (item.problemType) {
              case '00':
                title = 'APP介绍'
                break
              case '02':
                title = '使用教程'
                break
              case '03':
                title = '推广问题'
                break
              case '04':
                title = '提现问题'
                break
              case '10':
                title = '常见问题'
                break
              case '11':
                title = '平台介绍'
                break
              case '12':
                title = '关于优惠券'
                break
              case '13':
                title = '订单问题'
                break
              case '14':
                title = '佣金问题'
                break
              case '15':
                title = '提现相关'
                break
              case '16':
                title = '推广问题'
                break
              case '17':
                title = '热门活动'
                break
              case '18':
                title = '非淘宝平台'
                break
              case '19':
                title = '云发单'
                break
              case '20':
                title = '其他问题'
                break
              case '21':
                title = '推广规范'
                break
              case '22':
                title = '联系导师'
                break
            }
            item.title = title
          })
        })
    },
    changeTitle(index) {
      this.tabAc = index
    },
    goHelpDetail(data) {
      uni.navigateTo({
        url: `/pagesUser/helpDetail/helpDetail?problemId=${data.problemId}&problemName=${data.problemName}`
      })
    }
  }
}
</script>


<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 20rpx;
  background-color: #f5f5f5;
}
.help-list {
  overflow: hidden;
  flex: 1;
  display: flex;
  height: 100rpx;
  border-radius: 16rpx;
  .nav-left {
    width: 230rpx;
    height: 100%;
    background-color: #f9f9f9;
    .nav-left-item {
      position: relative;
      width: 100%;
      height: 120rpx;
      font-size: 32rpx;
      color: #666;
      text-align: center;
      line-height: 120rpx;
      border-radius: 16rpx 0 0 16rpx;
      &.active {
        background: #fff;
        font-weight: 500;
        color: #333;
        &:before {
          position: absolute;
          top: 50%;
          left: 0;
          width: 6rpx;
          height: 26rpx;
          background: #ff1f4f;
          border-radius: 4rpx;
          transform: translateY(-50%);
          content: '';
        }
      }
    }
  }
  .nav-right {
    width: 480rpx;
    height: 100%;
    padding: 0 30rpx;
    background-color: #fff;
    .nav-right-item {
      padding: 44rpx 0 40rpx;
      width: 100%;
      font-size: 28rpx;
      color: #4b81f6;
      border-bottom: 1rpx solid #eee;
      line-height: 40rpx;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
.service {
  display: flex;
  align-items: center;
  height: 140rpx;
  .service-btn {
    width: 100%;
    height: 100rpx;
    background: #ffffff;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #0cc81f;
    line-height: 100rpx;
    letter-spacing: 1rpx;
    .iconfont {
      margin-right: 10rpx;
      font-size: 34rpx;
      color: #0cc81f;
    }
  }
}
</style>>


