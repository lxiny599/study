<template>
  <view>
    <view class="income-top">
      <view class="money-box">
        <image
          class="divide"
          :src="`${BASEIMGURL}/shouyi-bj.png`"
        />
        <view class="cash-out">
          <view>
            <view class="cash-out-price">{{earnings.availableAmt}}</view>
            <view>可提现(元)</view>
          </view>
          <view
            class="cash-out-btn"
            @click="cashOutPoint"
          >立即提现</view>
        </view>
        <view class="income-price">
          <view>
            <view class="price-note">{{earnings.accumulatedAmt}}</view>
            <view>累计到账</view>
          </view>
          <view class="middle">
            <view class="price-note">{{earnings.extractedAmt}}</view>
            <view>已提现</view>
          </view>
          <view class="final">
            <view class="price-note">{{earnings.unsettledAmt}}</view>
            <view>未结算</view>
          </view>
        </view>
      </view>
    </view>
    <view class='platform-nav'>
      <view
        v-for="(item,index) in cpsTypeList"
        :key="index"
        class="platform-nav-box"
        @click="navTap(index,item.code)"
      >
        <text :class="{'active':currentType==index}">{{item.name}}</text>
      </view>
    </view>
    <view class='time-nav'>
      <view
        class="time-box"
        v-for="(item,index) in record"
        :key="index"
        :class="{'time-active':currentTime==index}"
        @click="navTapDetails(index)"
      >{{item.title}}</view>
    </view>
    <view class="details-wrapper">
      <view class="details-box">
        <view class="settlement">
          <text>结算收入：</text>
          <text class="settlement-price">{{getFixed2(record[currentTime]&&record[currentTime].settled.mny)}}</text>
        </view>
        <view class="extend-box">
          <view class="box-title">我的推广</view>
          <view class="box-body">
            <view class="box-child tiao">
              <view>付款笔数(笔)</view>
              <view class="body-note">{{record[currentTime]&&record[currentTime].self.cnt}}</view>
            </view>
            <view class="box-child">
              <view>预估收入</view>
              <view class="body-note">{{record[currentTime]&&record[currentTime].self.mny}}</view>
            </view>
          </view>
        </view>
        <view class="extend-box">
          <view class="box-title">团队推广</view>
          <view class="box-body">
            <view class="box-child tiao">
              <view>付款笔数(笔)</view>
              <view class="body-note">{{record[currentTime] && record[currentTime].team.cnt}}</view>
            </view>
            <view class="box-child">
              <view>预估收入</view>
              <view class="body-note">{{record[currentTime] && record[currentTime].team.mny}}</view>
            </view>
          </view>
        </view>
        <view></view>
      </view>
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
import { BASE_IMG_URL } from '@/config/imgUrl'
export default {
  data() {
    return {
      publicData: this.app.getPublicData(),
      BASEIMGURL: BASE_IMG_URL, // 图片的公共前缀
      // navItem: ["自营", "拼多多", "京东", "唯品会"],
      // timeNav: ["今日", "昨日", "近7日", "本月", "上月"],
      currentType: 0, //平台选项信息
      currentTime: 0, //时间选项信息
      earnings: [], //收益总览信息
      cpsTypeList: [],
      record: [], //收益明细
      code: 'dmj' //CPS类型
    }
  },
  onLoad() {
    var that = this
    this.app
      .request({
        api: 'CpsUserGetProfitViewInfo',
        type: 'GET'
      })
      .then((res) => {
        // console.log(res)
        var earnings = res.data.data
        earnings.cpsTypeList.forEach((item, index) => {
          if (item.code !== 'dmj') {
            that.cpsTypeList.push(item)
          }
        })
        that.cpsTypeList.push({ code: 'el', name: '饿了么' })
        that.swapArr(that.cpsTypeList, 4, 5)
        that.earnings = earnings
      })
    this.navTap(0, 'pdd')
  },
  onShow() {
    this.$cli && this.app.productSearch()
  },
  methods: {
    // 交换两个元素的位置
    swapArr(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    //下载app引导弹窗
    // downloadApp() {
    //   this.app.open({
    //     slot: 'download',
    //     skin: 'download',
    //     escBtn: false,
    //     yesBtn: false,
    //     // backEsc: true,
    //     methods: {}
    //   })
    // },
    // //提现弹窗
    // cashOutPoint() {
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
    navTap: function (index, code) {
      var that = this
      this.currentType = index
      var code = code
      this.code = code
      this.app
        .request({
          url: that.app.api.CpsUserGetProfitCpsInfo + that.code,
          type: 'GET'
        })
        .then((res) => {
          //   console.log(res)
          //   console.log(res.data.data)
          var record = res.data.data
          that.record = record
          that.navTapDetails(0)
        })
    },
    navTapDetails(index) {
      this.currentTime = index
      this.$forceUpdate()
    },
    getFixed2(value) {
      let num
      if (!value) {
        num = 0
      } else {
        num = parseInt(value)
      }
      return num.toFixed(2)
    }
  }
}
</script>

<style scoped lang="scss">
.income-top {
  width: 100%;
  height: 360upx;
  padding: 10rpx 24rpx 0;
  box-sizing: border-box;
  font-size: 24rpx;
  background: #fff;
  .money-box {
    position: relative;
    width: 100%;
    height: 320rpx;
    padding: 40rpx 38rpx 0;
    box-sizing: border-box;
    border-radius: 14rpx;
    color: #fff;
    background: linear-gradient(to top right, #fd2e77, #fb0527);
    .divide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 320rpx;
    }
    .cash-out {
      position: relative;
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      z-index: 10;
      .cash-out-price {
        margin-bottom: 2rpx;
        font-size: 48rpx;
        font-weight: 700;
      }
      .cash-out-btn {
        width: 148upx;
        height: 56rpx;
        line-height: 56upx;
        margin-top: 30rpx;
        border-radius: 28upx;
        font-size: 24rpx;
        text-align: center;
        color: #8b3e0b;
        background: linear-gradient(to bottom, #fceead, #ffd060);
      }
    }
    .income-price {
      position: relative;
      display: flex;
      margin-top: 50upx;
      justify-content: space-between;
      font-size: 22rpx;
      z-index: 10;
      .middle {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .final {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .price-note {
        margin-bottom: 3upx;
        font-size: 36rpx;
        font-weight: 500;
      }
    }
  }
}
.platform-nav {
  display: flex;
  align-items: baseline;
  width: 100%;
  height: 80upx;
  padding: 4rpx 20upx 0;
  box-sizing: border-box;
  border-bottom: 2upx solid #f2f2f2;
  font-size: 30upx;
  color: #333;
  background-color: #fff;
  .platform-nav-box {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: baseline;
    padding-bottom: 34rpx;
    .active {
      position: relative;
      font-size: 32upx;
      font-weight: 600;
      color: #fc2628;
      &:after {
        content: ' ';
        position: absolute;
        right: 10rpx;
        bottom: -34rpx;
        left: 10rpx;
        width: auto;
        height: 6rpx;
        border-radius: 6rpx;
        background-color: #fc2628;
      }
    }
  }
}
.time-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 104rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  .time-box {
    padding: 10rpx 0 0;
    text-align: center;
    width: 122rpx;
    height: 48rpx;
    border: 2rpx solid #ddd;
    border-radius: 48rpx;
    font-size: 26rpx;
    line-height: 26rpx;
    font-weight: 500;
    color: #666;
    background-color: #fff;
    box-sizing: border-box;
    &.time-active {
      border: 2rpx solid #fc2628;
      color: #fc2628;
    }
  }
}
.details-wrapper {
  padding: 0 24rpx;
  .details-box {
    width: 100%;
    // height: 518rpx;
    border-radius: 8rpx;
    background-color: #fff;
    .settlement {
      line-height: 104upx;
      // border-bottom: 1rpx solid #eee;
      font-size: 30upx;
      font-weight: 500;
      text-align: center;
      color: #333;
      .settlement-price {
        vertical-align: -3%;
        font-size: 36upx;
        color: #fc2628;
      }
    }
    .extend-box {
      border-top: 1rpx solid #eee;
      font-size: 28rpx;
      color: #333;
      .box-title {
        padding: 30rpx 36upx 0;
      }
      .box-body {
        display: flex;
        margin-top: 14rpx;
        padding-bottom: 24rpx;
        font-size: 24rpx;
        color: #999;
        .box-child {
          position: relative;
          flex: 1;
          margin-left: 36rpx;
          &.tiao::after {
            content: ' ';
            position: absolute;
            right: 0rpx;
            bottom: 16rpx;
            width: 1rpx;
            height: 72rpx;
            background-color: #e4e4e4;
          }
          .body-note {
            margin-top: 14rpx;
            font-size: 36rpx;
            font-weight: 500;
            color: #333;
          }
        }
      }
    }
  }
}
</style>
