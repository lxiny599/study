<template>
  <view class="class-wrapper">
    <view class="top-box">
      <view class="navbar">
        <block
          v-for="(item,index) in navbarList"
          :key="index"
        >
          <view
            class="navbar-item"
            :class="{'navbar-active':item.type===navbarType}"
            @click="changeNavbar(item.type)"
          >
            <icon
              class="iconfont navbar-icon"
              :class="[item.icon]"
            ></icon>
            <text>{{item.text}}</text>
          </view>
        </block>
      </view>
      <view class="tab-content">
        <u-tabs
          :list="tabList"
          :current="tabCurrent"
          bg-color="#f2f2f2"
          height="80"
          font-size="28"
          inactive-color="#666666"
          active-color="#f72d22"
          gutter="26"
          :active-item-style="{fontSize:'30rpx'}"
          @change="changeTab"
        ></u-tabs>
        <view
          class="arrow"
          :class="{'arrow-top':isCollapse}"
          @click="isCollapse = !isCollapse"
        ></view>
      </view>
    </view>
    <view
      class="collapse"
      v-if="isCollapse"
    >
      <block
        v-for="(item,index) in tabList"
        :key="index"
      >
        <view
          class="collapse-btn"
          :class="{'collapse-active':index===tabCurrent}"
          @click="changeTab(index)"
        >{{item.name}}</view>
      </block>
    </view>
    <view
      class="mask"
      v-if="isCollapse"
      @click="isCollapse = false"
    >
    </view>
    <app-loading :data="{load:goodsLoad}"></app-loading>
    <view
      class="goods-item"
      :key="index"
      v-for="(item,index) in goodsList"
    >
      <goods-list
        :item='item'
        :showBtn="item.cpsType.code === 'wph'||item.cpsType.code === 'kl'"
      ></goods-list>
    </view>
    <block v-if='!goodsLoad'>
      <reach-bottom :reachBottom="reachBottom"></reach-bottom>
    </block>
    <view
      class="top"
      @click="toTop"
    >
      <image
        class="top-icon"
        src="../../static/icon_top.png"
        mode="widthFix"
      />
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
      isCollapse: false,
      navbarType: 'PDD',
      tabCurrent: 0,
      goodsLoad: true,
      noMore: false, // 没有更多
      page: 1,
      pageSize: 10,
      navbarList: [
        { text: '拼多多', icon: 'iconpdd', type: 'PDD' },
        { text: '京东', icon: 'iconjd', type: 'JD' },
        { text: '唯品会', icon: 'iconwph', type: 'WPH' },
        { text: '苏宁', icon: 'iconsn', type: 'SN' },
        { text: '考拉', icon: 'iconkl', type: 'KL' }
      ],
      tabList: [],
      goodsList: [],
      reachBottom: null //null: 还没到达底部  more: 加载中  end: 没有更多商品
    }
  },
  onLoad() {
    this.changeNavbar('PDD')
  },
  onShow() {
    this.$cli && this.app.productSearch()
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
    toTop(e) {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 200
      })
    },
    changeNavbar(type) {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 10
      })
      this.navbarType = type
      this.isCollapse = false
      this.goodsLoad = true
      this.tabList = []
      const apiName = 'getCatList' + this.navbarType
      this.app
        .request({
          url: this.app.api[apiName],
          type: 'GET'
        })
        .then((res) => {
          this.tabList = res.data.data
          this.changeTab(0)
        })
    },
    changeTab(index) {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 10
      })
      this.tabCurrent = index
      this.page = 1
      this.goodsLoad = true
      this.isCollapse = false
      this.getData(this.page, this.pageSize, 2)
    },
    getData(page, pageSize, state = 1) {
      const data = {
        catId: this.tabList[this.tabCurrent].id,
        page,
        pageSize
      }
      const apiName = 'cat' + this.navbarType
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: this.app.api[apiName],
            type: 'GET',
            data: data
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
            this.goodsLoad = this.goodsList.length == 0 ? '暂无数据哦' : false
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.class-wrapper {
  padding-top: 188rpx;
  .top-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10;
    height: 188rpx;
    background-color: #f2f2f2;
  }
  .navbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 98rpx;
    background-color: #fff;
    border-radius: 0rpx 0rpx 24rpx 24rpx;
    .navbar-item {
      display: flex;
      align-items: center;
      width: 128rpx;
      height: 50rpx;
      background: #f1f1f1;
      border-radius: 26rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: #333;
      line-height: 26rpx;
      &.navbar-active {
        background: linear-gradient(90deg, #fc4f45 0%, #f82d21 100%);
        color: #fff;
        .navbar-icon {
          color: #e95142;
        }
      }
      .navbar-icon {
        display: flex;
        align-items: center;
        position: relative;
        width: 34rpx;
        height: 34rpx;
        margin-right: 6rpx;
        margin-left: 8rpx;
        background-color: #fff;
        border-radius: 50%;
        font-size: 34rpx;
        color: #ababab;
        &::before {
          position: absolute;
          left: 0rpx;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .tab-content {
    height: 90rpx;
    position: relative;
    padding-right: 80rpx;
    padding-left: 18rpx;
    background-color: #f2f2f2;
    .arrow {
      position: absolute;
      width: 50rpx;
      height: 50rpx;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      &::after {
        position: absolute;
        top: 20%;
        right: 20rpx;
        width: 13rpx;
        height: 13rpx;
        border: 3rpx solid;
        border-color: transparent transparent $color-light-grey
          $color-light-grey;
        transform: rotate(-45deg);
        content: '';
      }
      &.arrow-top {
        &::after {
          top: 36%;
          border-color: $color-light-grey $color-light-grey transparent
            transparent;
        }
      }
    }
  }
}
.collapse {
  position: fixed;
  left: 0;
  right: 0;
  top: 184rpx;
  display: flex;
  flex-wrap: wrap;
  padding: 30rpx 24rpx 0;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  z-index: 10;
  .collapse-btn {
    width: 158rpx;
    height: 56rpx;
    margin-bottom: 30rpx;
    margin-right: 22rpx;
    background-color: #f1f1f1;
    font-size: 26rpx;
    color: $color-light-grey;
    border-radius: 28rpx;
    line-height: 54rpx;
    text-align: center;
    &:nth-child(4n) {
      margin-right: 0;
    }
    &.collapse-active {
      background: linear-gradient(90deg, #fc4e45 0%, #f72d21 100%);
      color: #fff;
      font-weight: 500;
    }
  }
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 210rpx;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 3;
}
.goods-item {
  margin: 0 18rpx 10rpx;
  padding: 16rpx;
  background-color: #fff;
  border-radius: 16rpx;
}
.top {
  position: fixed;
  right: 25upx;
  bottom: 128upx;
  width: 70upx;
  height: 70upx;
  z-index: 99;
  .top-icon {
    width: 100%;
  }
}
</style>
