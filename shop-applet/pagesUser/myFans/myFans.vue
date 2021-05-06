<template>
  <view class="myFans-wrapper">
    <view class="bg-box">
      <view class="bg-top"></view>
    </view>
    <view class="myFans-top">
      <view class="fans-total">
        <view>
          <view class="total-num">{{myFansCount.totalCount}}</view>
          <view>我的邀请</view>
        </view>
        <view class="new-fans">
          <view>昨日邀请<text class="new-num">{{myFansCount.yestodayCount}}</text></view>
          <view class="divide"></view>
          <view>今日邀请<text class="new-num">{{myFansCount.todayCount}}</text></view>
        </view>
      </view>
      <view class="tab">
        <view
          class="tab-item"
          :class="{'tab-active':index === 0}"
          @click="changeFans(0)"
        >直属粉丝</view>
        <view
          class="tab-item"
          :class="{'tab-active':index === 1}"
          @click="changeFans(1)"
        >推荐粉丝</view>
      </view>
      <view class="nav">
        <view
          v-for="item in navList"
          :key="item.value"
          :class="{'filter-active': item.value === order}"
          class="nav-item"
          @click="changSort(item)"
        >
          <view>{{item.name}}</view>
          <view class="sort">
            <view
              class="arrow top"
              :class="{'active': item.type === 'asc'&&item.value === order}"
            ></view>
            <view
              class="arrow bottom"
              :class="{'active': item.type === 'desc'&&item.value === order}"
            ></view>
          </view>
        </view>
      </view>
    </view>
    <view class="fans-list">
      <scroll-view
        class="scroll-view"
        @scrolltolower="onReach"
        scroll-y
        :scroll-top="scrollTop"
      >
        <app-loading :data="{load:goodsLoad}"></app-loading>
        <view
          class="fans-item"
          v-for="(item ,index) in fansList"
          :key='index'
        >
          <view class="fans-info">
            <view class="fans-img">
              <image
                class="img"
                :src='item.avatarUrl'
              />
            </view>
            <view class="fans-name">
              <view class="user-name">{{item.userName}}</view>
              <view>{{item.mobile}}</view>
              <!-- <view class="name-btn">填写备注</view> -->
            </view>
          </view>
          <view class="additive">
            <view class="additive-item">
              <view>{{item.teamCnt}}</view>
              <view class="additive-text">会员数</view>
            </view>
            <view class="additive-item">
              <view>{{item.preAmount}}</view>
              <view class="additive-text">本月预估(元)</view>
            </view>
            <view class="additive-item">
              <view>{{item.beMemberTime}}</view>
              <view class="additive-text">加入时间</view>
            </view>
          </view>
        </view>
        <block v-if='!goodsLoad'>
          <reach-bottom
            :reachBottom="reachBottom"
            reachText='没有更多粉丝'
          ></reach-bottom>
        </block>
      </scroll-view>
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      index: 0, // 粉丝分类
      order: 'be_member_time', // 排序字段
      page: 1,
      pageSize: 10,
      sort: 'asc', // 排序方式
      myFansCount: [],
      fansList: [],
      scrollTop: -1, // scroll-view滚动条位置
      navList: [
        {
          id: 0,
          name: '加入时间',
          value: 'be_member_time',
          sort: '00',
          type: 'asc'
        },
        { id: 1, name: '会员数', value: 'team_cnt', sort: '10', type: '' },
        { id: 2, name: '本月预估', value: 'pre_amount', sort: '20', type: '' }
      ],
      goodsLoad: true,
      reachBottom: null //null: 还没到达底部  more: 加载中  end: 没有更多商品
    }
  },
  onLoad() {
    this.getMyFansCount()
    this.getData(this.index, this.order, this.page, this.pageSize, this.sort)
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  methods: {
    onReach() {
      this.reachBottom = 'more'
      this.getData(
        this.index,
        this.order,
        ++this.page,
        this.pageSize,
        this.sort
      )
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
    changeFans(num) {
      this.page = 1
      this.index = num
      this.order = 'be_member_time'
      this.sort = 'asc'
      this.getData(
        this.index,
        this.order,
        this.page,
        this.pageSize,
        this.sort,
        2
      )
      this.$nextTick(() => {
        if (this.page === 1) {
          this.scrollTop = this.scrollTop === 0 ? -1 : 0
        }
      })
    },
    changSort(data) {
      this.page = 1
      this.order = data.value
      switch (data.id) {
        case 0: // 加入时间
          data.sort = data.sort === '00' ? '01' : '00'
          data.type = data.sort === '00' ? 'asc' : 'desc'
          this.sort = data.type
          break
        case 1: // 会员数
          data.sort = data.sort === '10' ? '11' : '10'
          data.type = data.sort === '10' ? 'asc' : 'desc'
          this.sort = data.type
          break
        case 2: // 本月预估
          data.sort = data.sort === '20' ? '21' : '20'
          data.type = data.sort === '20' ? 'asc' : 'desc'
          this.sort = data.type
          break
      }
      this.getData(
        this.index,
        this.order,
        this.page,
        this.pageSize,
        this.sort,
        2
      )
      this.$nextTick(() => {
        if (this.page === 1) {
          this.scrollTop = this.scrollTop === 0 ? -1 : 0
        }
      })
    },
    getMyFansCount() {
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: this.app.api.getMyFansCount,
            type: 'GET',
            load: true
          })
          .then((res) => {
            this.myFansCount = res.data.data
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    getData(index, order, page, pageSize, sort, state = 1) {
      const data = { index, order, page, pageSize, sort }
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: this.app.api.getMyTeamHistoryDetail,
            type: 'GET',
            data: data
          })
          .then((res) => {
            if (!res.data.data) {
              this.goodsLoad = this.fansList.length == 0 ? '暂无数据哦' : false
              return false
            }
            if (state === 1) {
              this.fansList = this.fansList.concat(res.data.data)
            } else {
              this.fansList = res.data.data
            }
            if (this.fansList.length > 0) {
              this.fansList.forEach((item) => {
                item.beMemberTime = item.beMemberTime.split(' ')[0]
              })
            }
            this.goodsLoad = this.fansList.length == 0 ? '暂无数据哦' : false
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

<style  scoped lang="scss">
.bg-box {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  height: 80rpx;
  // background-color: #000;
  // opacity: 0.5;
  .bg-top {
    position: absolute;
    // top: -200rpx;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1200rpx;
    height: 320rpx;
    background-color: #fc0f3b;
    border-radius: 50%;
    z-index: -1;
  }
}
.myFans-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 24rpx;
  // padding: 370rpx 24rpx 0;
  .myFans-top {
    height: 360rpx;
    padding: 20rpx 0 0;
    // position: fixed;
    // top: 0;
    // left: 0;
    // right: 0;
    // background-color: #f2f2f2;
  }
  .fans-total {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    height: 150rpx;
    padding: 0 28rpx 34rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-sizing: border-box;
    font-size: 22rpx;
    color: $color-light-grey;
    .total-num {
      margin-bottom: 4rpx;
      font-size: 44rpx;
      font-weight: bold;
      color: $color-dark-grey;
    }
    .new-fans {
      display: flex;
      align-items: center;
      .new-num {
        color: $color-dark-grey;
        margin-left: 8rpx;
      }
      .divide {
        width: 1rpx;
        height: 24rpx;
        margin: 0 27rpx;
        border: 1rpx solid #eee;
      }
    }
  }
  .tab {
    display: flex;
    height: 80rpx;
    margin: 20rpx 0;
    background-color: #fff;
    border-radius: 16rpx;
    font-size: 28rpx;
    color: $color-dark-grey;
    .tab-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      &.tab-active {
        position: relative;
        color: #fc2628;
        &::after {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          content: '';
          width: 48rpx;
          height: 6rpx;
          background: #fc2628;
          border-radius: 4rpx;
        }
      }
    }
  }
  .nav {
    display: flex;
    width: 100%;
    height: 80rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #eee;
    border-radius: 16rpx 16rpx 0 0;
    box-sizing: border-box;
    font-size: 26rpx;
    color: #ccc;
    .nav-item {
      flex: 1;
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      &.filter-active {
        color: $color-grey;
      }
      .sort {
        position: relative;
        height: 28rpx;
        width: 20rpx;
        margin-left: 10rpx;
        .arrow {
          display: block;
          width: 10rpx;
          height: 10rpx;
          border: 1rpx solid #ccc;
          &.top {
            top: 7rpx;
            position: absolute;
            border-color: #ccc #ccc transparent transparent;
            transform: rotate(-45deg);
            &.active {
              border-top-color: #666;
              border-right-color: #666;
            }
          }
          &.bottom {
            bottom: 7rpx;
            position: absolute;
            border-color: transparent transparent #ccc #ccc;
            transform: rotate(-45deg);
            &.active {
              border-bottom-color: #666;
              border-left-color: #666;
            }
          }
        }
      }
    }
  }
  .fans-list {
    flex: 1;
    height: 100rpx;
    padding: 0 24rpx;
    background-color: #fff;
    .scroll-view {
      height: 100%;
    }
    .fans-item {
      padding: 12rpx 0 12rpx;
      .fans-info {
        display: flex;
        .fans-img {
          overflow: hidden;
          width: 88rpx;
          height: 88rpx;
          border-radius: 50%;
          .img {
            width: 100%;
            height: 100%;
          }
        }
        .fans-name {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 20rpx;
          font-size: 22rpx;
          color: $color-light-grey;
          .user-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 300rpx;
            font-size: 30rpx;
            font-weight: 500;
            color: $color-dark-grey;
          }
          // .name-btn {
          //   width: 114rpx;
          //   height: 36rpx;
          //   border: 1rpx solid #c2c2c2;
          //   border-radius: 18rpx;
          //   font-size: 22rpx;
          //   color: $color-light-grey;
          //   line-height: 34rpx;
          //   text-align: center;
          // }
        }
      }
      .additive {
        display: flex;
        align-items: center;
        width: 100%;
        height: 90rpx;
        margin-top: 24rpx;
        background-color: #f8f8f8;
        border-radius: 8rpx;
        .additive-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 24rpx;
          color: $color-dark-grey;
        }
      }
    }
  }
}
</style>
