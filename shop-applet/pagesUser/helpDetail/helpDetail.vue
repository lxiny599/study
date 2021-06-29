<template>
  <view class="detail">
    <view class="title">{{title}}</view>
    <view class="ricetext">
      <rich-text :nodes="data"></rich-text>
      <!-- <u-parse :html="data"></u-parse> -->
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      data: '',
      title: ''
    }
  },
  onLoad(params) {
    // uni.setNavigationBarTitle({
    //   title: params.problemName
    // })
    this.title = params.problemName
    this.getData(params)
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  methods: {
    getData(data) {
      this.app
        .request({
          url: `${this.app.api.getHelpDetail}?problemId=${data.problemId}&problemName=${data.problemName}`,
          type: 'GET'
        })
        .then((res) => {
          console.log(res)
          this.data = this.$app
            .formatRich(res.data.data)
            .replace(/<p/gi, '<p class="p_class"')
            .replace(/<span class="/gi, '<span class="span_class ')
        })
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  padding: 20rpx 0 0;
}
.title {
  padding: 0 36rpx;
  font-size: 46rpx;
  font-weight: 600;
  color: #333333;
  line-height: 65rpx;
  letter-spacing: 1rpx;
}
.ricetext {
  width: 750rpx;
  height: auto;
  padding: 36rpx;
  // font-size: 0;
  overflow: hidden;
}
/deep/ .p_class {
  line-height: 40rpx !important;
}
/deep/ .span_class {
  line-height: 30rpx !important;
}
</style>
