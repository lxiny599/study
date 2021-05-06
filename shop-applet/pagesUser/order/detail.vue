<template>
  <dmj-page
    :hasFixHd="true"
    :hdClass="'left: 24rpx; right: 24rpx;'"
  >
    <view
      class="detail-hd"
      slot="hd"
    >
      <view class="order-type">
        <view
          class="btn my-order"
          :class="{'active': currentOrderType === 'mine'}"
          @click="toggleOrderType('mine')"
        >我的订单</view>
        <view
          class="btn team-order"
          :class="{'active': currentOrderType === 'team'}"
          @click="toggleOrderType('team')"
        >团队订单</view>
      </view>
      <view class="order-nav">
        <text
          class="nav-item"
          :class="{'active': idx === currentTabIndex}"
          v-for="(item, idx) in navItem"
          :key="idx"
          @click="toggleOrderStatus(idx)"
        >{{item}}</text>
      </view>
    </view>
    <view
      class="order-group"
      v-for="(group, idx) in multiOrderList"
      :key="idx"
      :class="{'hidden': currentTabIndex !== idx}"
    >
      <block
        v-for="(item, idxs) in group"
        :key="item.id"
      >
        <view
          class="order-item"
          :class="{'last-item': idxs === last}"
          @click="goDetail(item)"
        >
          <view class="time-type">
            <text class="create-time">创建时间：{{item.createTime}}</text>
            <dmj-button
              size="medium"
              :bgColor="btnBg(item.orderStatusName)"
              round
            >{{item.orderStatusName}}</dmj-button>
          </view>
          <view class="shop-mess">
            <image
              class="shop-img"
              :src="item.thumbnailUrl"
            />
            <view class="name-num">
              <text class="shop-name">{{item.goodsName}}</text>
              <view class="order-num">订单编号：{{item.orderSn}}</view>
              <text
                class="arrive"
                v-if="item.orderStatus === '2'"
              >预计到账：{{item.accountTime}}</text>
            </view>
          </view>
          <div
            class="other-time"
            v-if="item.orderStatus === '3'"
          >结算时间: {{item.settleTime}}</div>
          <div
            class="other-time"
            v-if="item.orderStatus === '2'"
          >收货时间: {{item.receiveTime}}</div>
          <view class="price-num">
            <text class="shop-price">预估佣金： <text class="mn-icon">￥</text><text class="price">{{item.commission}}</text></text>
            <text class="num">共{{item.goodsQuantity}}件商品 合计：￥<text class="total">{{item.orderAmount}}</text></text>
          </view>
        </view>
      </block>
      <app-loading :data="{load:goodsLoad}"></app-loading>
    </view>
    <reach-bottom :reachBottom="reachBottom"></reach-bottom>
    <app-public :data="publicData"></app-public>
  </dmj-page>
</template>

<script>
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      cpsType: '',
      navItem: ['全部', '已付款', '已收货', '已结算', '已退款'],
      currentTabIndex: 0, // 当前的订单状态
      currentOrderType: 'mine',
      multiOrderList: [[], [], [], [], []],
      pageSize: 10,
      orderStatus: null,
      currentEndStatus: 'loading', // loading 加载中   end 没有更多   null 不显示
      pageRecord: {
        // page: 页数； list: 数组； isEmpty: 是否为空； endStatus: 下拉到底部的状态； distance:滑动的距离
        mine: [
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 },
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 },
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 },
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 },
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 }
        ],
        team: [
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 },
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 },
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 },
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 },
          { page: 1, list: [], isEmpty: false, endStatus: null, distance: 0 }
        ]
      }
    }
  },
  computed: {
    reachBottom() {
      return this.pageRecord[this.currentOrderType][this.currentTabIndex]
        .endStatus
    },
    last() {
      return this.multiOrderList[this.currentTabIndex].length - 1
    },
    btnBg(status) {
      // 根据状态替换按钮的颜色
      return (status) => {
        let color = ''
        switch (status) {
          case '已付款':
          case '已收货':
            color = '#FF4167'
            break
          case '已失效':
          case '已退款':
            color = '#C6C6C6'
            break
          case '已结算':
            color = '#FF9D3E'
            break
        }
        return color
      }
    },
    goodsLoad() {
      return this.multiOrderList[this.currentTabIndex].length == 0
        ? '暂无数据哦'
        : false
    },
    requestUrl(type) {
      return (type) => {
        const cpsType = this.cpsType.toUpperCase()
        return type === 'mine'
          ? `getSelfOrderList${cpsType}`
          : `getTeamOrderList${cpsType}`
      }
    }
  },
  onLoad(e) {
    this.cpsType = e.type
    this.getOrderList(0, false)

    let navigationTitle = ''
    switch (e.type) {
      case 'pdd':
        navigationTitle = '拼多多订单'
        break
      case 'jd':
        navigationTitle = '京东订单'
        break
      case 'sn':
        navigationTitle = '苏宁订单'
        break
      case 'kl':
        navigationTitle = '考拉订单'
        break
      case 'wph':
        navigationTitle = '唯品会订单'
        break
    }
    uni.setNavigationBarTitle({
      title: navigationTitle
    })
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  onPageScroll(e) {
    this.pageRecord[this.currentOrderType][this.currentTabIndex]['distance'] =
      e.scrollTop
  },
  onReachBottom() {
    if (this.reachBottom === 'end') {
      return
    }
    this.pageRecord[this.currentOrderType][this.currentTabIndex].endStatus =
      'more'
    this.pageRecord[this.currentOrderType][this.currentTabIndex].page++
    this.getOrderList(this.currentTabIndex, true)
      .then((res) => {
        this.pageRecord[this.currentOrderType][this.currentTabIndex].endStatus =
          res.data.data.length < this.pageSize ? 'end' : null
      })
      .catch((err) => {
        this.pageRecord[this.currentOrderType][
          this.currentTabIndex
        ].endStatus = null
      })
  },
  methods: {
    goDetail(data) {
      console.log(this.cpsType)
      if (this.cpsType === 'mt' || this.cpsType === 'el') {
        return
      }
      uni.navigateTo({
        url: `/pagesGoods/detail/detail?id=${data.goodsId}&type=${data.cpsType.code}`
      })
    },
    // 订单类型切换事件
    toggleOrderType(type) {
      this.currentOrderType = type
      this.getOrderList(this.currentTabIndex, false)
      console.log(this.multiOrderList)
    },
    // 订单状态切换事件
    toggleOrderStatus(status) {
      this.currentTabIndex = status
      this.orderStatus = status === 0 ? null : status
      this.getOrderList(status)
    },
    /**
     * @params url [String] 接口地址
     * @params targetIndex [Number] 当前选中的订单状态，如已结算
     */
    getOrderList(targetIndex = this.currentTabIndex, more = false) {
      return new Promise((resolve, reject) => {
        const pageRecordIndex = this.pageRecord[this.currentOrderType][
          targetIndex
        ]
        const params = {
          page: pageRecordIndex.page,
          pageSize: this.pageSize
        }
        if (this.orderStatus) {
          params.orderStatus = this.orderStatus
        }
        if (pageRecordIndex.list.length === 0 || more) {
          this.app
            .request({
              api: this.requestUrl(this.currentOrderType),
              type: 'GET',
              data: params
            })
            .then((res) => {
              const isEmpty = res.data.data.length === 0
              pageRecordIndex.isEmpty = isEmpty
              pageRecordIndex.list = pageRecordIndex.list.concat(res.data.data)
              this.$set(this.multiOrderList, targetIndex, pageRecordIndex.list)
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          this.$set(this.multiOrderList, targetIndex, pageRecordIndex.list)
        }
        setTimeout(() => {
          uni.pageScrollTo({
            scrollTop: this.pageRecord[this.currentOrderType][
              this.currentTabIndex
            ]['distance'],
            duration: 0
          })
        }, 0)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$color-red: #f10606;
$DETAIL_LINE: $baseImgUrl2 + '/order/detail-line.png';

.detail-hd {
  padding: 20rpx 20rpx 8rpx;
  background: $color-white;
  border-radius: $radius-size-medium $radius-size-medium 0 0;
}
.list-no-data {
  display: none;
  font-size: 24rpx;
  color: #666;
  text-align: center;
  &.show {
    display: block;
  }
}
.order-type {
  display: flex;
  margin: 0 auto;
  padding: 10rpx;
  width: 466rpx;
  align-items: center;
  justify-content: space-between;
  background-color: $color-bg-grey;
  border-radius: 64rpx;
  .btn {
    flex: 1;
    height: 54rpx;
    text-align: center;
    line-height: 54rpx;
    font-size: $fontsize-large;
    color: $color-grey;
    background-color: $color-bg-grey;
    border-radius: 54rpx;
    &.active {
      color: $color-white;
      background: linear-gradient(to right, $color-orange, $color-orange-ss);
    }
  }
  // .my-order {
  //   border-radius: 64rpx 0 0 64rpx;
  // }
  // .team-order {
  //   border-radius: 0 64rpx 64rpx 0;
  // }
}
.order-nav {
  display: flex;
  margin-top: 30rpx;
  align-items: center;
  justify-content: space-between;
  .nav-item {
    position: relative;
    padding-bottom: 16rpx;
    text-align: center;
    font-size: $fontsize-medium;
    line-height: 38rpx;
    color: $color-dark-grey;
    &::after {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 44rpx;
      height: 6rpx;
      background: transparent;
      border-radius: $radius-size-medium;
      transform: translateX(-50%);
      content: '';
    }
    &.active {
      color: $color-main;
      font-size: $fontsize-large;
      font-weight: bold;
      border-color: $color-main;
      &::after {
        background: $color-main;
      }
    }
  }
}
.time-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .create-time {
    font-size: $fontsize-small;
    color: $color-grey;
  }
  /deep/ .dmj-button-medium {
    padding: 6rpx 16rpx;
    font-size: 24rpx;
  }
}
.order-group {
  padding: 20rpx;
  background: $color-white;
  border-radius: 0 0 $radius-size-medium $radius-size-medium;
  &.hidden {
    display: none;
  }
  /deep/ .dmj-button {
    color: #fff;
  }
  .order-item {
    position: relative;
    padding-bottom: 20rpx;
    margin-top: 28rpx;
    &:first-child {
      margin-top: 0;
    }
    &.last-item {
      padding-bottom: 0;
      margin-bottom: 0;
      &::after {
        display: none;
      }
    }
    &::after {
      position: absolute;
      bottom: -20rpx;
      left: -20rpx;
      width: 702rpx;
      height: 30rpx;
      background: url($detailLine) no-repeat;
      background-size: 100% 100%;
      content: '';
    }
  }
}
.shop-mess {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .shop-img {
    flex: 0 0 164rpx;
    display: block;
    margin-right: 20rpx;
    width: 164rpx;
    height: 164rpx;
    background-color: #f2f2f2;
    border-radius: $radius-size-small;
  }
  .name-num {
    flex: 1;
  }
  .shop-name {
    font-size: $fontsize-medium;
    color: $color-dark-grey;
    font-weight: bold;
    @include multiLineEllipsis($lineHiehgt: 36rpx, $lineCount: 2);
  }
  .order-num {
    margin-top: 20rpx;
    font-size: $fontsize-small;
    line-height: 34rpx;
    color: $color-grey;
  }
  .arrive {
    margin-top: 20rpx;
    font-size: $fontsize-small;
    line-height: 34rpx;
    color: $color-red;
  }
}
.other-time {
  margin-top: 20rpx;
  font-size: $fontsize-small;
  color: $color-grey;
  line-height: 34rpx;
  text-align: right;
}
.price-num {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  .num {
    font-size: $fontsize-small;
    line-height: 34rpx;
    color: $color-dark-grey;
    .total {
      font-size: $fontsize-large-x;
      line-height: 42rpx;
      font-weight: bold;
    }
  }
}
.shop-price {
  font-size: $fontsize-small;
  color: $color-red;
  .mn-icon {
    font-size: $fontsize-small-s;
  }
  .price {
    font-size: $fontsize-large-x;
    font-weight: bold;
  }
}
</style>