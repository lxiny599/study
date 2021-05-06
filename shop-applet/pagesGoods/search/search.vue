<template>
  <view class="main-container">
    <view class="toolbars">
      <view class="search-wrapper">
        <view class="search-bar">
          <icon class="iconfont iconsearch search-icon"></icon>
          <input
            v-model="queryWord"
            class="search-input"
            placeholder-style="color:#CCCCCC"
            placeholder="搜索商品名或黏贴宝贝标题"
            @confirm="searchGoods"
          />
          <view
            v-if="isShowClean"
            class="clean-box"
            @click="clean"
          >
            <image
              class="clean-icon"
              :src="CLEAN"
            />
          </view>
        </view>
        <view
          class="btn-search"
          @click="searchGoods"
        >搜索</view>
      </view>
      <view class="platform-list">
        <view
          v-for="item in platformList"
          :key="item.value"
          :class="{'current': item.value === currentPlatform}"
          class="platform"
          @click="changePlatform(item)"
        >{{item.name}}</view>
      </view>
    </view>
    <view class="keywords-tips">
      <view>
        <view class="title">热门搜索</view>
        <view class="items-wrapper">
          <view
            v-for="item in searchHotKeys"
            :key="item"
            @click="chooseKeyWord(item)"
            class="items-box"
          >
            <dmj-button
              round
              size="large"
              class="item-search"
            >{{item}}</dmj-button>
          </view>
        </view>
      </view>
      <view class="search-history">
        <view class="title">
          <view>
            历史搜索
          </view>
          <view
            class="icon-delete-wrapper"
            @click="clearSearchHistory"
          >
            <icon class="iconfont icon-delete icondelete"></icon>
          </view>
        </view>
        <view
          id="history"
          class="items-wrapper pt-18"
          :class="{'history-item':!isShowMore}"
        >
          <view
            v-for="item in searchHistory"
            :key="item"
            @click="chooseKeyWord(item)"
            class="items-box"
          >
            <dmj-button
              round
              size="large"
              class="item-search"
            >{{item}}</dmj-button>
          </view>
        </view>
        <view
          v-if="isShowDrop"
          class="drop-down"
          @click="showMore"
        >
          <icon
            class="iconfont icondrop ic-drop"
            :class="{'ic-top':isShowMore}"
          ></icon>
        </view>
      </view>
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
import { CLEAN } from '../../config/imgUrl'
export default {
  data() {
    return {
      CLEAN: CLEAN, // 清除按钮
      historyHeight: 0,
      publicData: this.app.getPublicData(),
      queryWord: '',
      searchHotKeys: [],
      searchHistory: [],
      currentPlatform: 'pdd',
      isShowMore: true,
      isShowDrop: false,
      platformList: [
        { name: '拼多多', value: 'pdd' },
        { name: '京东', value: 'jd' },
        { name: '唯品会', value: 'wph' },
        { name: '苏宁', value: 'sn' },
        { name: '考拉', value: 'kl' }
      ]
    }
  },
  onLoad(options) {
    if (options.type) {
      this.currentPlatform = options.type
    }
    this.getHotKeyWords()
  },
  onShow() {
    this.getSearchHistory()
    this.isShowMore = true
    this.getHistoryHeight()
    this.$cli && this.app.productSearch()
  },
  computed: {
    isShowClean() {
      return this.queryWord ? true : false
    }
  },
  methods: {
    getHistoryHeight() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        const id = '#history'
        const query = uni.createSelectorQuery().in(this)
        query
          .select(id)
          .boundingClientRect((res) => {
            if (res) {
              // this.historyHeight = res.height
              this.isShowDrop = res.height > 70 ? true : false
              this.isShowMore = this.isShowDrop ? false : true

              console.log(res.height)
              // if (res.top && res.top > 0) {
              //   this.navbarTop = res.top
              // }
            }
          })
          .exec()
      }, 0)
    },
    showMore() {
      this.isShowMore = !this.isShowMore
    },
    clean() {
      this.queryWord = ''
    },
    changePlatform(item) {
      if (this.currentPlatform === item.value) {
        return
      }
      this.currentPlatform = item.value
    },
    searchGoods() {
      this.queryWord = this.queryWord.trim()
      if (!this.queryWord) {
        this.app.msg('请输入商品名称')
        return
      }
      this.searchHistory.unshift(this.queryWord)
      this.searchHistory = [...new Set(this.searchHistory)].slice(0, 15)
      try {
        uni.setStorageSync('searchHistory', this.searchHistory)
      } catch (e) {
        console.log('searchHistory 本地存储失败')
      }
      uni.navigateTo({
        url: `../searchDetail/searchDetail?type=${this.currentPlatform}&keyWord=${this.queryWord}`
      })
    },
    // 获取热门搜索关键词
    getHotKeyWords() {
      return new Promise((resolve, reject) => {
        this.app
          .request({ url: this.app.api.fetchHotKeyWords, type: 'GET' })
          .then((res) => {
            let keysArr = []
            if (Array.isArray(res.data.data)) {
              keysArr = res.data.data
            }
            this.searchHotKeys = keysArr
            resolve(res)
          })
          .catch((err) => {
            console.log('获取热搜关键词失败', err)
            reject(err)
          })
      })
    },
    // 获取历史搜索关键词
    getSearchHistory() {
      try {
        const value = uni.getStorageSync('searchHistory')
        if (value) {
          this.searchHistory = value
        }
      } catch (e) {
        console.log('获取搜索历史失败')
      }
    },
    // 清空历史搜索关键词
    clearSearchHistory() {
      try {
        this.searchHistory = []
        // uni.setStorageSync('searchHistory', this.searchHistory)
        uni.removeStorageSync('searchHistory')
        this.isShowDrop = false
      } catch (e) {
        console.log('searchHistory 本地存储失败')
      }
    },
    chooseKeyWord(data) {
      console.log(data)
      this.queryWord = data
      this.searchGoods()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: 170rpx;
  background-color: #f2f2f2;
  -webkit-overflow-scrolling: touch;
  .toolbars {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 170rpx;
    z-index: 2000;
    box-shadow: 0 1rpx 2rpx #ddd;
    .search-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 74rpx;
      padding: 10rpx 29rpx 0rpx;
      background-color: #fff;
      box-sizing: border-box;
      .search-bar {
        display: flex;
        align-items: center;
        align-content: center;
        width: 604rpx;
        height: 100%;
        background-color: $color-bg-main;
        font-size: 28rpx;
        border-radius: 40rpx;
        box-sizing: border-box;
        .search-icon {
          width: 28rpx;
          height: 28rpx;
          margin: 0 15rpx 0 20rpx;
          font-size: 28rpx;
          line-height: 30rpx;
        }
        .search-input {
          width: 480rpx;
          height: 100%;
          // background-color: #fff;
          // margin-right: 20rpx;
          color: $color-dark-grey;
        }
        .clean-box {
          padding: 15rpx;
          .clean-icon {
            display: block;
            width: 28rpx;
            height: 28rpx;
          }
        }
      }
      .btn-search {
        font-size: 30rpx;
        color: $color-grey;
      }
    }
    .platform-list {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 96rpx;
      line-height: 96rpx;
      font-size: 30rpx;
      background: #fff;
      .platform {
        flex-grow: 1;
        position: relative;
        box-sizing: border-box;
        color: $color-dark-grey;
        text-align: center;
        &.current {
          font-weight: bold;
          color: #ef2533;
          &::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 35%;
            width: 30%;
            height: 4rpx;
            border-radius: 6rpx;
            background-color: #ef2533;
          }
        }
      }
    }
  }
  .keywords-tips {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 46rpx 30rpx;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      font-size: 30rpx;
      font-weight: bold;
      color: $color-dark-grey;
    }
    .items-wrapper {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: flex-end;
      padding: 26rpx 0;
      &.pt-18 {
        padding-top: 20rpx;
      }
      &.history-item {
        overflow: hidden;
        height: 90rpx;
        padding-bottom: 0rpx;
      }
      .items-box {
        margin-bottom: 10rpx;
      }
      .item-search {
        margin: 0 20rpx 15rpx 0;
        /deep/ .button-text {
          display: inline-block;
          max-width: 600rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .search-history {
      width: 100%;
      .icon-delete-wrapper {
        padding: 10rpx;
        .icon-delete {
          width: 36rpx;
          height: 36rpx;
          font-size: 34rpx;
          font-weight: 400;
          color: $color-light-grey;
        }
      }
    }
  }
  .drop-down {
    width: 60rpx;
    height: 32rpx;
    margin: 0 auto;
    line-height: 32rpx;
    text-align: center;
    .ic-drop {
      margin-top: 10rpx;
      font-size: 16rpx;
      color: $color-light-grey;
      &.ic-top {
        margin-top: -30rpx;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
