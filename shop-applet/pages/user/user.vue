<template>
  <dmj-page
    class="usr-wrap"
    :timerHeight="statusBarHeight"
  >
    <!-- 背景 -->
    <view class="hd-bg-img">
      <image :src="USER_IMG" />
      <view class="hd-bg"></view>
      <view class="hd-bg-radius"></view>
    </view>
    <!-- 主要内容 -->
    <view
      class="usr-mess-wrapper"
      @click="canLogin"
    >
      <image
        :src="userInfo.avatarUrl || DEFAULT_AVATOR"
        class="usr-avator"
      />
      <view
        class="usr-login"
        v-if="!hasLogin"
      >
        微信登录
      </view>
      <view
        class="usr-mess"
        v-else
      >
        <view class="type-name"><text class="usr-name">{{userInfo.nickName || '未设置'}}
          </text>
          <image
            class="usr-type"
            :src="grade[gradeImg((profit &&profit.userType) || null).toUpperCase()]"
          />
        </view>
        <view
          class="usr-code"
          @click="copyCode"
        ><text>邀请码：{{profit.inviteCode||''}}</text>
          <view class="copy-btn">复制</view>
        </view>
      </view>
    </view>
    <view
      class="usr-momey-wrap"
      v-if="hasLogin"
    >
      <view class="withdraw-wrap">
        <text class="withdraw-txt">可提现余额(元)</text>
        <view class="withdraw">{{profit.availableAmt}}</view>
        <button @click="cashOutPoint">立即提现</button>
      </view>
      <view class="withdraw-estimate">
        <view class="estimate-item">
          <view>{{profit.todayIncomePre}}</view>
          <text>今日预估</text>
        </view>
        <view class="estimate-item">
          <view>{{profit.currMonthIncomePre}}</view>
          <text>本月预估</text>
        </view>
        <view class="estimate-item">
          <view>{{profit.lstMonthIncomePre}}</view>
          <text>上月预估</text>
        </view>
      </view>
    </view>
    <view class="usr-func-wrap">
      <view
        v-for="(func, idx) in usrFunc"
        :key="idx"
        class="func-item"
        @click="goPage(func.url)"
      >
        <icon
          class="func-icon"
          :class="func.icon"
        ></icon>
        <text class="func-name">{{func.name}}</text>
      </view>
    </view>
    <swiper
      v-if="advList.length>0"
      class="usr-swiper"
      :indicator-dots="false"
      :autoplay="true"
      :circular="true"
      :interval="3000"
      :duration="1000"
    >
      <swiper-item
        v-for="(item,index) in advList"
        :key="index"
      >
        <!-- <view
          class="swiper-item"
          @click="goPage('/pagesOther/web-view/web-view', `https://www.dmjvip.com/shop/order?userid=${appPubrep.userid}&isApp=0&merchantid=${appPubrep.merchantid}`)"
        > -->
        <view
          class="swiper-item"
          @click="onAdv(item)"
        >
          <image :src="item.imageUrl" />
        </view>
      </swiper-item>
    </swiper>
    <view class="usr-server">
      <view class="server-title">更多服务</view>
      <view class="server-list">
        <block
          v-for="(server, idx) in usrServer"
          :key="idx"
        >
          <view
            v-if="!server.isBtn"
            class="server-item"
            @click="goPage(server.url, server.webViewUrl,server.isAlert)"
          >
            <icon
              class="server-icon iconfont"
              :class="server.icon"
            ></icon>
            <text>{{server.name}}</text>
          </view>
          <button
            v-else
            class="server-item server-item-btn"
            :session-from="'weapp|nickName='+userInfo.nickName+'|avatarUrl='+userInfo.avatarUrl"
            open-type="contact"
          >
            <icon
              class="server-icon iconfont"
              :class="server.icon"
            ></icon>
            <text>{{server.name}}</text>
          </button>
        </block>
      </view>
    </view>
    <app-public :data="publicData"></app-public>
  </dmj-page>
</template>

<script>
import { USER_IMG, grade } from '../../config/imgUrl'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['hasLogin', 'userInfo', 'appPubrep']),
    gradeImg(userType) {
      return (userType) => {
        let grade = null
        switch (userType) {
          case '3':
            grade = 'partner'
            break
          case '2':
            grade = this.profit.isPartner ? 'partner' : 'owner'
            break
          default:
            grade = 'member'
        }
        return grade
      }
    }
  },
  data() {
    return {
      publicData: this.app.getPublicData(),
      // extensionId: '', // 邀请码
      grade: grade, // 等级图片
      DEFAULT_AVATOR: '../../static/logo-user.png', // 默认的用户头像
      USER_IMG: USER_IMG, // 个人中心用的背景图
      statusBarHeight: 0, // 时间栏高度
      profit: null,
      advList: [],
      usrFunc: [
        {
          name: '我的收益',
          icon: 'svg-wdsy',
          url: '/pagesUser/income/income'
        },
        {
          name: '我的订单',
          icon: 'svg-wddd',
          url: '/pagesUser/order/order'
        },
        {
          name: '我的粉丝',
          icon: 'svg-wdfs',
          url: '/pagesUser/myFans/myFans'
        },
        {
          name: '邀请粉丝',
          icon: 'svg-yqfs',
          url: '/pagesUser/share/share'
        }
      ],
      usrServer: [
        {
          name: '我的足迹',
          url: '/pagesUser/myTracks/myTracks',
          webViewUrl: '',
          icon: 'iconfootprint',
          isAlert: '',
          isBtn: false
        },
        {
          name: '我的收藏',
          url: '/pagesUser/myCollection/myCollection',
          webViewUrl: '',
          icon: 'iconcollect',
          isAlert: '',
          isBtn: false
        },
        {
          name: '帮助中心',
          url: '/pagesUser/helpCenter/helpCenter',
          webViewUrl: '',
          // url: '/pagesOther/web-view/web-view',
          // webViewUrl: 'https://www.dmjvip.com/shop/helpCenter?isApp=0',
          icon: 'iconhelp',
          isAlert: '',
          isBtn: false
        },
        {
          name: '官方客服',
          url: '/pages/index',
          webViewUrl: '',
          icon: 'iconservice',
          isAlert: '',
          isBtn: true
        },
        {
          name: '下载APP',
          url: '/pages/index',
          webViewUrl: '',
          icon: 'icondownload',
          isAlert: 'download',
          isBtn: false
        },
        {
          name: '意见反馈',
          url: '/pagesUser/feedback/feedback',
          webViewUrl: '',
          icon: 'iconfeedback',
          isAlert: '',
          isBtn: false
        }
      ]
    }
  },
  onLoad() {
    // 获取时间栏高度
    const res = uni.getSystemInfoSync()
    this.statusBarHeight = res.statusBarHeight
    this.getData()
  },
  onShow() {
    if (this.hasLogin) {
      this.getInfo()
    }
    this.$cli && this.app.productSearch()
  },
  //下拉刷新
  onPullDownRefresh() {
    if (this.hasLogin) {
      const promises = [this.getInfo(), this.getData()]
      Promise.all(promises)
        .then((posts) => {
          uni.stopPullDownRefresh()
        })
        .catch((reason) => {
          uni.stopPullDownRefresh()
        })
    }
  },
  methods: {
    getInfo() {
      this.app
        .request({
          api: 'userCenterData'
          // load: true
        })
        .then((res) => {
          //每次展示都重新获取用户信息（金额）
          const result = { ...res.data.data }
          const json = {
            availableAmt: result.availableAmt.toFixed(2),
            currMonthIncomePre: result.currMonthIncomePre.toFixed(2),
            lstMonthIncomePre: result.lstMonthIncomePre.toFixed(2),
            todayIncomePre: result.todayIncomePre.toFixed(2),
            userType: result.userType,
            isPartner: result.isPartner,
            inviteCode: result.inviteCode
          }
          this.profit = json
          // this.profit = res.data.data
          // uni.setStorageSync('profit', res.data.data.userType)
        })
    },
    getData() {
      const that = this
      this.app
        .request({
          url: `${this.app.api.advList}?site=05`,
          type: 'GET'
        })
        .then(async (res) => {
          this.advList = res.data.data
        })
        .catch((res) => {
          console.log(res)
        })
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
        case '10':
          uni.navigateTo({
            url: '/pagesUser/share/share'
          })
          break
      }
    },
    // 唤醒对应小程序
    goByGoods(item) {
      console.log(item)
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
    // //提现弹窗
    // cashOutcashOut() {
    //   this.app.open({
    //     title1: '为保证您的资金安全',
    //     title2: '请前往“呆萌价APP”提现',
    //     slot: 'point',
    //     skin: 'point',
    //     escBtn: false,
    //     yesBtn: '我知道了',
    //     methods: {}
    //   })
    // },
    // //提现弹窗
    cashOutPoint() {
      this.app.open({
        slot: 'cashOut',
        skin: 'cashOut',
        escBtn: false,
        yesBtn: false,
        methods: {
          copy() {
            // 此方法H5不支持
            uni.setClipboardData({
              data:
                'https://sj.qq.com/myapp/detail.htm?apkName=com.lxkj.dmhw&info=75120E586CAC016386B96AE0331C7C0D',
              success: (res) => {
                uni.setStorageSync(
                  'searchText',
                  'https://sj.qq.com/myapp/detail.htm?apkName=com.lxkj.dmhw&info=75120E586CAC016386B96AE0331C7C0D'
                )
                uni.hideToast()
                // _this.app.msg('邀请码复制成功！')
                uni.showToast({
                  title: '复制成功！',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          }
        }
      })
    },
    //下载app引导弹窗
    downloadApp() {
      this.app.open({
        slot: 'download',
        skin: 'download',
        escBtn: false,
        yesBtn: false,
        // backEsc: true,
        methods: {}
      })
    },
    // 复制邀请码
    copyCode() {
      const _this = this
      // 此方法H5不支持
      uni.setClipboardData({
        data: _this.profit.inviteCode,
        success: (res) => {
          uni.setStorageSync('searchText', _this.profit.inviteCode)
          uni.hideToast()
          // _this.app.msg('邀请码复制成功！')
          uni.showToast({
            title: '邀请码复制成功！',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    // 跳转
    goPage(url, webViewUrl = '', isAlert = '') {
      url = this.hasLogin ? url : '/pagesOther/login/login'
      if (webViewUrl !== '') {
        url += `?url=${encodeURIComponent(webViewUrl)}`
      }
      if (isAlert === 'download') {
        this.downloadApp()
      }
      uni.navigateTo({
        url: url
      })
    },
    // 是否可登录
    canLogin() {
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pagesOther/login/login'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$mg-top: 20rpx;
$hdBgRadius: $baseImgUrl + '/userIcon/bg.png'; // 头部的圆角背景图
// /deep/.openCon {
//   margin-top: 560rpx !important;
// }
.usr-wrap {
  // position: relative;
  .usr-login {
    font-size: $fontsize-large-xxx;
    line-height: 46rpx;
    font-weight: bold;
    color: $color-white;
  }
  .hd-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    /* height: 440upx; */
    height: 442rpx;
    z-index: -1;
    image {
      position: absolute;
      top: 0;
      right: 0;
      width: 398rpx;
      height: 215rpx;
      z-index: 1;
    }
  }
  .hd-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    /* height: 360upx; */
    height: 362rpx;
    background: linear-gradient(to right, #fa1766, #fb0434);
  }
  .hd-bg-radius {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 83rpx;
    width: 100%;
    background: url($hdBgRadius) no-repeat top;
    background-size: 100% 100%;
  }
  .usr-mess-wrapper {
    display: flex;
    margin-top: 110rpx;
    font-size: 0;
    align-items: center;
    .usr-avator {
      flex: 0 0 98rpx;
      margin: 0 20rpx 0 12rpx;
      width: 98rpx;
      height: 98rpx;
      border-radius: 50%;
    }
    .usr-mess {
      color: $color-white;
    }
    .usr-name {
      display: inline-block;
      margin-right: 10rpx;
      max-width: 264rpx;
      overflow: hidden;
      white-space: nowrap;
      vertical-align: middle;
      font-size: $fontsize-large-xx;
      line-height: 44rpx;
      text-overflow: ellipsis;
    }
    .usr-type {
      position: relative;
      top: 5rpx;
      display: inline-block;
      height: 30rpx;
      width: 128rpx;
      vertical-align: middle;
    }
    .usr-code {
      position: relative;
      margin-top: 14rpx;
      padding: 8rpx 0 11rpx 16rpx;
      width: 250rpx;
      overflow: unset;
      line-height: 1;
      background: $color-deep-red;
      border-radius: 42rpx;
      box-sizing: border-box;
      & > text {
        margin-right: 16rpx;
        font-size: $fontsize-small;
        color: $color-white;
        line-height: 1;
      }
    }
    .copy-btn {
      position: absolute;
      top: 0rpx;
      right: -36rpx;
      display: inline-block;
      padding: 8rpx 18rpx 11rpx;
      font-size: $fontsize-small-s;
      line-height: 1;
      color: $color-white;
      background: linear-gradient(
        0deg,
        rgba(250, 114, 110, 1) 0%,
        rgba(255, 94, 84, 1) 100%
      );
      border-radius: 42px;
    }
  }
  .usr-momey-wrap {
    margin-top: 46rpx;
    padding: 38rpx 38rpx 42rpx;
    background: $color-white;
    border-radius: $radius-size-medium;
  }
  .withdraw-wrap {
    position: relative;
    & > button {
      position: absolute;
      top: 10rpx;
      right: -10rpx;
      width: 152rpx;
      height: 56rpx;
      font-size: $fontsize-small;
      color: $color-white;
      text-align: center;
      line-height: 54rpx;
      border-radius: 50rpx;
      box-shadow: 6upx 5upx 7upx rgba(251, 126, 55, 0.4);
      background: linear-gradient(to right, #fda560, #fa6d27);
    }
    .withdraw-txt {
      color: #6e6e6e;
      font-size: $fontsize-small;
      line-height: 34rpx;
    }
    .withdraw {
      margin-top: 10rpx;
      font-size: 48rpx;
      color: $color-dark-grey;
      font-weight: bold;
      line-height: 58rpx;
    }
  }
  .withdraw-estimate {
    display: flex;
    margin-top: 40rpx;
    align-items: center;
    & > .estimate-item {
      flex: 1;
      &:first-child {
        text-align: left;
      }
      &:nth-child(2) {
        position: relative;
        text-align: center;
        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          width: 2rpx;
          height: 40rpx;
          background: #f2f2f2;
          transform: translateY(-50%);
          content: '';
        }
        &::after {
          position: absolute;
          top: 50%;
          right: 0;
          width: 2rpx;
          height: 40rpx;
          background: #f2f2f2;
          transform: translateY(-50%);
          content: '';
        }
      }
      &:last-child {
        text-align: right;
      }
      & > view {
        font-size: $fontsize-large-xxx;
        color: $color-dark-grey;
        line-height: 46rpx;
      }
      & > text {
        font-size: $fontsize-small-s;
        line-height: 32rpx;
        color: #6e6e6e;
      }
    }
  }
  .usr-func-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $mg-top;
    padding: 28rpx 38rpx 32rpx;
    background: $color-white;
    border-radius: $radius-size-medium;
  }
  .func-item {
    // flex: 0 0 100rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    width: 100rpx;
    .func-icon {
      margin: 0 0 2rpx;
      width: 96rpx;
      height: 96rpx;
    }
    .func-name {
      font-size: $fontsize-small;
      line-height: 34rpx;
      color: $color-grey;
    }
  }
  .usr-swiper {
    margin-top: $mg-top;
    width: 100%;
    height: 136rpx;
    .swiper-item {
      & > image {
        width: 702rpx;
        height: 136rpx;
      }
    }
  }
  .usr-server {
    padding: 34rpx 38rpx;
    margin-top: $mg-top;
    background: $color-white;
    border-radius: $radius-size-medium;
  }
  .server-title {
    font-size: $fontsize-medium;
    line-height: 36rpx;
    font-weight: bold;
    color: $color-dark-grey;
  }
  .server-item {
    display: inline-block;
    width: 15.25%;
    margin-top: 36rpx;
    text-align: center;
    &:nth-child(4n + 2) {
      margin: 0 13%;
    }
    &:nth-child(4n + 3) {
      margin-right: 13%;
    }
    .server-icon {
      margin: 0 auto 10rpx;
      width: 40rpx;
      height: 40rpx;
      font-size: 46rpx;
      color: $color-grey;
    }
    & > text {
      font-size: $fontsize-small;
      line-height: 34rpx;
      color: $color-grey;
      white-space: nowrap;
    }
  }
  .server-item-btn {
    // height: 80rpx;
    overflow: visible;
    padding: 0;
    background-color: transparent;
    line-height: 34rpx;
  }
}
</style>
