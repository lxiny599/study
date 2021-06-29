<template>
  <view class="home-wrapper">
    <view class="bg-top"></view>
    <!-- <view class="home-content"> -->
    <view id="homeTop">
      <navigator
        url="../../pagesGoods/search/search"
        hover-class="none"
      >
        <view class="search-wrapper">
          <icon class="iconfont iconsearch"></icon>搜索商品标题领优惠券
        </view>
      </navigator>
      <view class="step-list">
        <view
          class="step-item"
          v-for="(item, index) in stepList"
          :key="index"
        >
          <image
            :src="item.icon"
            class="step-icon"
          />
          <text>{{item.title}}</text>
        </view>
      </view>
      <view class="home-swiper-wrapper">
        <swiper
          class="home-swiper"
          autoplay="true"
          duration="250"
          circular="true"
          current=0
          @change="changeSwiper"
        >
          <swiper-item
            v-for="(item,index) in bannerList"
            :key="index"
            class="home-swiper-item"
            @click="onAdv(item)"
          >
            <image
              @load="imgLoad"
              class="swiper-img"
              :src="item.imageUrl"
            />
          </swiper-item>
        </swiper>
        <view class="home-swiper-index">
          <text>{{activeIndex+1}}</text>
          <text class="light-colour">{{bannerList.length}}</text>
        </view>
      </view>
      <view class="activity-wrapper">
        <scroll-view scroll-x>
          <view
            class="activity-list"
            v-for="(list, idx) in activityList"
            :key="idx"
            :class="{'activity-box':isFive(list.length)}"
          >
            <view
              class="activity-item"
              v-for="(item, index) in list"
              :key="index"
              @click="onAdv(item)"
            >
              <image
                class="activity-icon"
                :src="item.imageUrl"
              />
              <view>{{item.name}}</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="takeaway-wrapper">
        <view
          :key="index"
          v-for="(item,index) in takeawayList"
          :style="{backgroundImage:`url(${item.imageUrl})`}"
          class="takeaway-item"
          @click="onAdv(item)"
        >
          <view class="takeaway-info">
            <view class="takeaway-num">
              <view class="takeaway-price"><text v-if="item.cpsType === 'mt'">56</text><text v-else>66</text>元</view>
              <view class="number">每天可领</view>
            </view>
            <text v-if="item.cpsType === 'mt'">美团外卖红包</text>
            <text v-else>饿了么天天抢红包</text>
          </view>
          <view class="takeaway-btn">
            <!-- <view class="btn">
            </view> -->
            <image
              class="swiper-img"
              src="../../static/wm-btn.gif"
            />
          </view>
        </view>
      </view>
      <view
        class="theme-bottom"
        v-if="themeList.length!==0"
      >
        <view
          class="theme-item"
          v-for="(item,index) in themeList"
          :key="index"
          @click="onAdv(item)"
        >
          <image
            @load="imgLoad"
            class="themeList-img"
            :src="item.imageUrl"
          />
        </view>
      </view>
      <!-- <view
        class="theme-wrapper"
        :style="themeListBgColor"
      >
        <view
          class="theme-top"
          v-if="theme.length!==0"
        >
          <swiper
            class="theme-swiper"
            autoplay="true"
            duration="250"
            circular="true"
          >
            <swiper-item
              v-for="(item,index) in theme"
              :key="index"
              class="theme-swiper-item"
              @click="onAdv(item)"
            >
              <image
                class="theme-img"
                :src="item.imageUrl"
              />
            </swiper-item>
          </swiper>
        </view>
        <view
          class="theme-bottom"
          v-if="themeList.length!==0"
        >
          <view
            class="theme-item"
            v-for="(item,index) in themeList"
            :key="index"
            @click="onAdv(item)"
          >
            <image
              @load="imgLoad"
              class="themeList-img"
              :src="item.imageUrl"
            />
          </view>
        </view>
      </view> -->
    </view>
    <view class="goodsList-wrapper">
      <view
        class="navbar-wrapper"
        id="navbar"
        :class="[{'fixActive':isFixed},{'navbar-box':isFive(navbarTitle.length)}]"
      >
        <view
          class="navbar-item"
          v-for="(item,index) in navbarTitle"
          :key="index"
          :class="{'navbar-active': index === navbarCurrent}"
          @click="getDataByChange(item,index)"
        >
          <view class="item">
            <view class="navbar-name">{{item.name}}</view>
            <view class="navbar-tips">{{item.subName}}</view>
          </view>
        </view>
      </view>
      <view :class="{'empty': isFixed}"></view>
      <app-loading :data="{load:goodsLoad}"></app-loading>
      <view
        class="goods-item"
        :key="idx"
        v-for="(goods,idx) in goodsList"
      >
        <goods-list
          :item='goods'
          :showBtn="goods.cpsType.code === 'wph'||goods.cpsType.code === 'kl'"
        ></goods-list>
      </view>
      <block v-if='!goodsLoad'>
        <reach-bottom :reachBottom="reachBottom"></reach-bottom>
      </block>
    </view>
    <!-- </view> -->
    <view
      class="top"
      @click="toTop"
      v-if="isFixed"
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
import { step, SHARE_IMG } from '../../config/imgUrl'
export default {
  components: { goodsList },
  data() {
    return {
      publicData: this.app.getPublicData(),
      activeIndex: 0, //轮播图索引
      navbarTop: 0, // 固定定位到顶部的距离
      isFixed: false, // 是否吸顶
      noMore: false, // 没有更多
      referId: '',
      scrollTop: 0,
      goodsLoad: true,
      page: 1,
      pageSize: 10,
      navbarCurrent: 0,
      clickVaule: 1,
      reachBottom: null, //null: 还没到达底部  more: 加载中  end: 没有更多商品
      bannerList: [],
      activityList: [[], []],
      theme: [],
      themeList: [],
      navbarType: '',
      navbarTitle: [],
      themeListBgColor: '',
      goodsList: [],
      takeawayList: [],
      stepList: [
        { icon: step.STEP1, title: '复制商品标题' },
        { icon: step.STEP2, title: '打开呆萌价' },
        { icon: step.STEP3, title: '找券得补贴' }
      ]
    }
  },
  onLoad(params) {
    this.getDataInit(true)
    if (params.scene) {
      const scene = decodeURIComponent(params.scene)
      uni.setStorageSync('superiorId', scene)
    }
    if (params.referId != undefined) {
      uni.setStorageSync('superiorId', params.referId)
    }
    this.$app.updateManager() //检测更新小程序版本
    this.referId = uni.getStorageSync('referId')
    if (!this.hasLogin) {
      uni.hideShareMenu()
    }
  },
  onShow() {
    this.$cli && this.app.productSearch()
    const value = uni.getStorageSync('firstLogin')
    if (value) {
      this.page = 1
      this.navbarCurrent = 0
      this.getDataInit(true)
      uni.removeStorageSync('firstLogin')
    }
  },
  // 监听页面滚动
  onPageScroll(e) {
    this.isFixed = e.scrollTop >= this.navbarTop ? true : false
  },
  // 分享朋友
  onShareAppMessage(ops) {
    const that = this //这一句非常必要  否则 this指向会错误
    return {
      title: '快来一起加入呆萌价',
      path: '/pages/home/home?referId=' + that.referId,
      imageUrl: SHARE_IMG
    }
  },
  // 分享朋友圈
  onShareTimeline() {
    const that = this //这一句非常必要  否则 this指向会错误
    const query = `referId=${that.referId}`
    return {
      title: '快来一起加入呆萌价',
      query: query,
      imageUrl: SHARE_IMG
    }
  },
  //上拉加载
  onReachBottom() {
    if (this.noMore) {
      return false
    }
    this.reachBottom = 'more'
    this.getData(this.navbarType, ++this.page, this.pageSize, this.clickVaule)
      .then((res) => {
        if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
          this.reachBottom = 'end'
        } else {
          this.reachBottom = null
        }
      })
      .catch((err) => {
        this.reachBottom = null
        console.log(err)
      })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.page = 1
    this.navbarCurrent = 0
    this.goodsLoad = true
    this.getDataInit()
      .then((res) => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          this.getNavbarTop()
        }, 2000)
      })
      .catch((reason) => {
        uni.stopPullDownRefresh()
        setTimeout(() => {
          this.getNavbarTop()
        }, 2000)
      })
  },
  computed: {
    hasLogin() {
      return this.$store.state.hasLogin
    },
    isFive(data) {
      return (data) => {
        return data <= 5 ? true : false
      }
    }
  },
  methods: {
    toTop(e) {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 200
      })
    },
    imgLoad() {
      this.getNavbarTop()
    },
    onAdv(data) {
      /**
       * 根据data的clickType判断轮播的类型，
       * "00"=>"跳转对应搜索"
       * "01" =>"商品详情"+
       * "02" => "商品专题"(暂时不做)
       * "03"=>"官方频道"+(列表页，调用对应的频道商品接口)
       * "04"=>"官方主题"+(列表页，调用对应的主题商品接口)
       * "05"=>"跳转外部的URL"+(直接跳转)
       * "06"=>"跳转自己的URL"-(直接跳转)
       * "07"=>"跳转官方URL（拦截请求，判断详情页跳转）"-(不做)
       * "08"=>"跳转官方的转链后的URL"-(不做)
       * "09"=>"唤醒对应APP并打开URL"+(转链后唤醒)
       * "10"=>"分享页面"
       * "99"=>不做任何动作
       */
      if (data.needLogin) {
        if (!this.hasLogin) {
          uni.navigateTo({
            url: '/pagesOther/login/login'
          })
          return
        }
      }
      switch (data.clickType) {
        case '00':
          uni.navigateTo({
            url: `/pagesGoods/search/search?type=${data.cpsType}`
          })
          break
        case '01':
          uni.navigateTo({
            url: `/pagesGoods/detail/detail?id=${data.clickVaule}&type=${data.cpsType}`
          })
          break
        case '03':
          uni.navigateTo({
            url: `/pagesGoods/list/list?id=${data.clickVaule}&type=03&cps=${data.cpsType}&title=${data.name}`
          })
          break
        case '04':
          uni.navigateTo({
            url: `/pagesGoods/list/list?id=${data.clickVaule}&type=04&cps=${data.cpsType}&title=${data.name}`
          })
          break
        case '05':
          uni.navigateTo({
            url: `/pagesOther/web-view/web-view?url=${data.clickVaule}`
          })
          break
        case '09':
          this.goByGoods(data)
          break
      }
    },
    // 唤醒对应小程序
    goByGoods(item) {
      const apiName = 'genAdvUrl' + item.cpsType.toUpperCase()
      let sysParam = encodeURIComponent(item.sysParam)
      this.app
        .request({
          url: `${this.app.api[apiName]}?clickValue=${item.clickVaule}&sysParam=${sysParam}`,
          type: 'GET'
        })
        .then((res) => {
          const wechatApp = res.data.data.wechatApp
          uni.navigateToMiniProgram({
            appId: wechatApp.appId,
            path: wechatApp.path,
            success(res) {
              console.log('成功')
            }
          })
        })
    },
    scrollToTabTop() {
      const durationTime = 250
      if (this.isFixed) {
        uni.pageScrollTo({
          scrollTop: this.navbarTop,
          duration: durationTime
        })
      }
    },
    // 获取轮播图当前图片的索引值
    changeSwiper(e) {
      this.activeIndex = e.detail.current
    },
    // 获取一级类目到顶部的距离
    getNavbarTop() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        const id = '#homeTop'
        const query = uni.createSelectorQuery().in(this)
        query
          .select(id)
          .boundingClientRect((res) => {
            if (res) {
              if (res.height && res.height > 0) {
                this.navbarTop = res.height + 5
              }
            }
          })
          .exec()
      }, 0)
    },
    getDataByChange(data, index) {
      this.page = 1
      this.goodsLoad = true
      this.navbarCurrent = index
      this.navbarType = data.cpsType
      this.clickVaule = data.clickVaule
      this.getData(data.cpsType, this.page, this.pageSize, this.clickVaule, 0)
    },
    // 商品列表
    getData(type, page, pageSize, channel, first = 1) {
      if (first !== 1) {
        // this.app.loading()
      }
      const apiName = 'channel' + type.toUpperCase()
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: `${this.app.api[apiName]}?page=${page}&pageSize=${pageSize}&channel=${channel}`,
            type: 'GET'
          })
          .then((res) => {
            if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
              this.noMore = true
            } else {
              this.noMore = false
            }
            if (first) {
              this.goodsList = this.goodsList.concat(res.data.data)
            } else {
              this.goodsList = res.data.data
            }
            this.goodsLoad = this.goodsList.length == 0 ? '暂无数据哦' : false
            this.$nextTick(() => {
              if (page === 1) {
                this.scrollToTabTop()
              }
            })
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 首页数据
    getDataInit(load = false) {
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: `${this.app.api.homePageAdv}?site=06`,
            type: 'GET',
            load: load
          })
          .then((res) => {
            const advList = res.data.data.advList
            this.bannerList = advList[0].advList
            this.$set(this.activityList, 0, advList[1].advList)
            this.$set(this.activityList, 1, advList[2].advList)
            this.theme = advList[3].advList
            this.themeList = advList[4].advList
            this.navbarTitle = advList[5].advList
            this.navbarType = advList[5].advList[0].cpsType
            this.themeListBgColor = `background-image: url(${advList[6].advList[0].imageUrl})`
            this.clickVaule = advList[5].advList[0].clickVaule
            this.takeawayList = advList[7].advList
            this.getData(
              this.navbarType,
              this.page,
              this.pageSize,
              this.clickVaule,
              0
            )
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
.home-wrapper {
  position: relative;
  padding: 10rpx 18rpx 0;
}
.bg-top {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 312rpx;
  background-color: #eb444f;
  box-sizing: border-box;
  overflow-x: hidden;
  &:before {
    position: absolute;
    left: -135rpx;
    top: 251rpx;
    z-index: 8;
    width: 1024rpx;
    height: 376rpx;
    background-color: rgb(242, 242, 242);
    border-radius: 50%;
    content: '';
  }
}
// .home-content {
.search-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 72rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
  line-height: 28rpx;
  color: #333;
  background: #f8f8f2 url($searchBg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .iconfont {
    width: 24rpx;
    height: 24rpx;
    margin-right: 8rpx;
    font-size: 24rpx;
    color: $color-grey;
  }
}
.step-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60rpx;
  width: 100%;
  height: 70rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #f4e4c0;
  .step-item {
    display: flex;
    align-items: center;
    .step-icon {
      width: 36rpx;
      height: 36rpx;
      margin-right: 5rpx;
    }
  }
}
.home-swiper-wrapper {
  position: relative;
  width: 100%;
  height: 300rpx;
  .home-swiper {
    width: 100%;
    height: 300rpx;
    .home-swiper-item {
      overflow: hidden;
      width: 100%;
      height: 100%;
      border-radius: 16rpx;
      .swiper-img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .home-swiper-index {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    right: 14rpx;
    bottom: 16rpx;
    width: 80rpx;
    height: 30rpx;
    border-radius: 8rpx;
    font-size: 20rpx;
    color: #f2f2f2;
    background: rgba(4, 4, 4, 0.6);
    .light-colour {
      color: #c8c4c4;
    }
    &::after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      content: '';
      width: 1rpx;
      height: 17rpx;
      background: #050505;
    }
  }
}
.activity-wrapper {
  margin: 10rpx 0 0; //46rpx;
  padding-bottom: 30rpx;
  .activity-list {
    // display: flex;
    white-space: nowrap;
    &.activity-box {
      display: flex;
      justify-content: space-between;
      .activity-item {
        padding: 0 20rpx;
      }
    }
  }
  .activity-item {
    display: inline-block;
    // width: 142rpx;
    padding: 0 46rpx 0 20rpx;
    font-size: 22rpx;
    text-align: center;
    color: #666;
    &:last-child {
      padding-right: 20rpx;
    }
    .activity-icon {
      width: 80rpx;
      height: 80rpx;
      margin-top: 20rpx;
    }
  }
}
.takeaway-wrapper {
  .takeaway-item {
    display: flex;
    width: 100%;
    height: 190rpx;
    margin-bottom: 20rpx;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .takeaway-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      padding-left: 196rpx;
      // margin-bottom: 10px;
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
      .takeaway-num {
        display: flex;
        align-items: center;
        .takeaway-price {
          margin-right: 14rpx;
          font-size: 26rpx;
          font-weight: 600;
          color: #e93431;
          line-height: 48rpx;
          & > text {
            font-size: 48rpx;
          }
        }
        .number {
          // width: 179px;
          height: 38rpx;
          padding: 0 10rpx;
          border: 2rpx solid #ea3a37;
          border-radius: 8rpx;
          font-size: 24rpx;
          font-weight: 500;
          color: #ea3a37;
          line-height: 32rpx;
        }
      }
    }
    .takeaway-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 196rpx;
      // .btn {
      //   width: 150rpx;
      //   height: 60rpx;
      //   background: linear-gradient(0deg, #ea3a3d 0%, #ea3a57 100%);
      //   border-radius: 30rpx;
      //   font-size: 26rpx;
      //   color: #fefefe;
      //   line-height: 60rpx;
      //   text-align: center;
      // }
      image {
        width: 150rpx;
        height: 60rpx;
      }
    }
  }
}
.theme-wrapper {
  width: 100%;
  // height: 386rpx;
  box-sizing: border-box;
  background-size: 100% auto;
  background-repeat: no-repeat;
  .theme-top {
    width: 100%;
    height: 196rpx;
    .theme-swiper {
      width: 100%;
      height: 196rpx;
      .theme-swiper-item {
        overflow: hidden;
        width: 100%;
        height: 100%;
      }
    }
    .theme-img {
      width: 100%;
      height: 100%;
    }
  }
}
.theme-bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  // padding: 16rpx 15rpx 0;
  box-sizing: border-box;
  .theme-item {
    overflow: hidden;
    width: 225rpx;
    height: 162rpx;
    margin-bottom: 16rpx;
    border-radius: 16rpx;
    .themeList-img {
      width: 100%;
      height: 100%;
    }
  }
}
.goodsList-wrapper {
  .navbar-wrapper {
    // position: -webkit-sticky;
    // position: sticky;
    // top: 0;
    background-color: #f2f2f2;
    display: flex;
    align-items: center;
    width: 100%;
    height: 112rpx;
    overflow: auto;
    &.fixActive {
      position: fixed;
      top: 0rpx;
      left: 18rpx;
      right: 18rpx;
      z-index: 10;
      width: auto;
      background-color: #f2f2f2;
    }
    &.navbar-box {
      justify-content: space-between;
    }
    .navbar-item {
      position: relative;
      white-space: nowrap;
      &::after {
        position: absolute;
        right: 0rpx;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 2rpx;
        height: 53rpx;
        background: #e8e8e8;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
      &.navbar-active {
        .navbar-name {
          color: #fa651c;
        }
        .navbar-tips {
          color: #fff;
          background-color: #fa651c;
        }
      }
    }
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 20rpx;
      .navbar-name {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
      }
      .navbar-tips {
        height: 32rpx;
        line-height: 30rpx;
        padding: 0 10rpx;
        margin-top: 6rpx;
        border-radius: 16rpx;
        font-size: 20rpx;
        color: #666;
        background: #fa651c;
        background: transparent;
      }
    }
  }
  .empty {
    height: 112rpx;
  }
  .goods-item {
    padding: 16rpx;
    margin-bottom: 10rpx;
    border-radius: 16rpx;
    background-color: #fff;
  }
}
// }
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
