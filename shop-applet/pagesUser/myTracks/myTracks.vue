<template>
  <view
    class="myTracks-wrapper"
    :class="{'pt':goodsLoad==='暂无数据哦'}"
  >
    <app-loading :data="{load:goodsLoad}"></app-loading>
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
    <block v-if='!goodsLoad'>
      <reach-bottom :reachBottom="reachBottom"></reach-bottom>
    </block>
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
      goodsList: [],
      goodsLoad: false,
      noMore: false, // 没有更多
      reachBottom: null //null: 还没到达底部  more: 加载中  end: 没有更多商品
    }
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  onLoad() {
    this.getData(this.page, this.pageSize, true)
    setTimeout(() => {
      this.goodsLoad = this.goodsList.length == 0 ? false : false
    }, 3000)
  },
  //上拉加载
  onReachBottom() {
    if (this.noMore) {
      return false
    }
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
    getData(page, pageSize, first = false) {
      const data = {
        page,
        pageSize
      }
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: this.app.api.getCpsGoodsFootprint,
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
            this.goodsList = this.goodsList.concat(res.data.data)
            this.goodsLoad = this.goodsList.length == 0 ? '暂无数据哦' : false
            resolve(res)
          })
          .catch((err) => {
            reject(err)
            console.log(err)
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.myTracks-wrapper {
  padding: 20rpx 0 0;
  &.pt {
    padding-top: 360rpx;
  }
  .goods-list {
    padding: 16rpx;
    margin: 0 18rpx 10rpx;
    background-color: #fff;
    border-radius: 16rpx;
  }
}
</style>
