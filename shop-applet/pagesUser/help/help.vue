<template>
  <view class="help-wrapper">
    <view
      :key="index"
      v-for="(item, index) in helpList"
      class="help-box"
    >
      <view
        class="help-top"
        @click="goHelpList(item)"
      >
        <text class="title">{{item.title}}</text>
        <view class="arrow"></view>
      </view>
      <view
        v-if="item.problemSimpleVoList.length>0"
        class="help-bottom"
      >
        <block
          :key="idx"
          v-for="(items, idx) in item.problemSimpleVoList"
        >
          <view
            v-if="idx<=3"
            class="desc"
            @click="goHelpDetail(items)"
          >{{items.problemName}}</view>
        </block>
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
      helpList: [
        // { title: '', data: {} },
        // { title: '', data: {} },
        // { title: '', data: {} },
        // { title: '', data: {} }
      ]
    }
  },
  onLoad() {
    this.getData()
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
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
    goHelpList(data) {
      uni.navigateTo({
        url: `/pagesUser/helpList/helpList?problemType=${data.problemType}`
      })
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
.help-wrapper {
  padding: 0 24rpx;
  .help-box {
    width: 100%;
    height: 224rpx;
    margin: 26rpx 0;
    padding: 26rpx 30rpx 0;
    border-radius: 10rpx;
    background-color: #fff;
    .help-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30rpx;
      .title {
        font-size: 34rpx;
        font-weight: bold;
        color: #333;
      }
      .arrow {
        display: inline-block;
        width: 20rpx;
        height: 20rpx;
        // background-color: #f00;
        border: 3rpx solid #b3b3b3;
        border-color: #b3b3b3 #b3b3b3 transparent transparent;
        transform: rotate(45deg);
      }
    }
    .help-bottom {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      font-size: 28rpx;
      font-weight: 500;
      color: #148eff;
      line-height: 48rpx;
      .desc {
        width: 264rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
