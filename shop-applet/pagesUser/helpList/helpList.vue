<template>
  <view class="helpList-wrapper">
    <view
      :key="index"
      v-for="(item, index) in list"
      class="help-list"
      @click="goHelpDetail(item)"
    >
      <view class="course">
        <view class="bubble">Q{{index+1}}</view>
        <view>{{item.problemName}}</view>
      </view>
      <view class="arrow"></view>
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      list: []
    }
  },
  onLoad(params) {
    this.getData(params.problemType)
    let title = ''
    switch (params.problemType) {
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
    uni.setNavigationBarTitle({
      title: title
    })
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  methods: {
    getData(data) {
      this.app
        .request({
          url: `${this.app.api.getHelpListByProblemType}?problemType=${data}`,
          type: 'GET'
        })
        .then((res) => {
          this.list = res.data.data
        })
    },
    goHelpDetail(data) {
      console.log(data)
      uni.navigateTo({
        url: `/pagesUser/helpDetail/helpDetail?problemId=${data.problemId}&problemName=${data.problemName}`
      })
    }
  }
}
</script>

<style scoped lang="scss">
.helpList-wrapper {
  padding: 0 24rpx;
  .help-list {
    display: flex;
    padding: 0 24rpx;
    justify-content: space-between;
    align-items: center;
    height: 76rpx;
    margin: 20rpx 0;
    // padding: 26px 30px 0;
    border-radius: 12rpx;
    background-color: #fff;
    .course {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      .bubble {
        width: 34rpx;
        height: 33rpx;
        margin-right: 12rpx;
        // padding-top: 4rpx;
        font-size: 20rpx;
        text-align: center;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        background: url($bubble);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .arrow {
      display: inline-block;
      width: 20rpx;
      height: 20rpx;
      border: 2rpx solid #b3b3b3;
      border-color: #b3b3b3 #b3b3b3 transparent transparent;
      transform: rotate(45deg);
    }
  }
}
</style>
