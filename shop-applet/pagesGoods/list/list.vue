<template>
  <view class="list-wrapper">
    <view
      class="goods-list"
      :key="index"
      v-for="(item,index) in goodsList"
    >
      <goods-list
        :item='item'
        :showBtn="goods.cpsType.code === 'wph'||goods.cpsType.code === 'kl'"
      ></goods-list>
    </view>
    <view
      v-if="goodsList.length == 0"
      class="appNotData appNotData-bg"
    >
      <view class="notContent">
        <view class="iconempty iconfont"></view>
        <text>暂无数据哦~</text>
      </view>
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
import goodsList from '../../components/goods'
export default {
  components: {
    goodsList
  },
  data() {
    return {
      publicData: this.app.getPublicData(),
      page: 1,
      pageSize: 10,
      cpsType: '',
      clickType: '',
      id: '',
      goodsList: []
    }
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title: options.title
    })
    this.cpsType = options.cps
    this.clickType = options.type
    this.id = options.id
    this.getData(options.cps, options.type, options.id, true)
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  onReachBottom() {
    if (this.noMore) {
      return false
    }
    if (this.clickType === '03') {
      ++this.page
      this.getData(this.cpsType, this.clickType, this.id, false)
    }
  },
  methods: {
    getData(cpsType, clickType, id, load) {
      /**
       * @cpsType => 平台的类型： pdd，wph, jd, sn, kl
       * clickType => 请求的接口类型： 03=>频道商品接口, 04=>主题商品接口
       */
      let apiName = ''
      let url = ''
      switch (clickType) {
        case '03':
          apiName = 'channel' + cpsType.toUpperCase()
          url = this.app.api[apiName]
          this.app
            .request({
              url: `${url}?channel=${id}&page=${this.page}&pageSize=${this.pageSize}`,
              type: 'GET',
              load: load
            })
            .then((res) => {
              if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
                this.noMore = true
              } else {
                this.noMore = false
              }
              console.log(res)
              this.goodsList = this.goodsList.concat(res.data.data)
              // this.goodsList = this.goodsList.concat(res.data.data);
            })
          break
        case '04':
          apiName = 'theme' + cpsType.toUpperCase()
          url = this.app.api[apiName]
          this.app
            .request({
              url: `${url}?themeId=${id}`,
              type: 'GET',
              load: load
            })
            .then((res) => {
              if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
                this.noMore = true
              } else {
                this.noMore = false
              }
              this.goodsList = res.data.data
              // this.goodsList = this.goodsList.concat(res.data.data);
            })
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.list-wrapper {
  padding: 20rpx 0 0;
  .goods-list {
    padding: 16rpx;
    margin: 0 18rpx 10rpx;
    background-color: #fff;
    border-radius: 16rpx;
  }
}
</style>
