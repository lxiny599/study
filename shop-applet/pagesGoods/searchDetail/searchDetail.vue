<template>
  <view
    class="main-container"
    :class="{'main-container-other':currentPlatform === 'wph'||currentPlatform === 'kl'}"
  >
    <view
      class="toolbars"
      :class="{'toolbars1':levels}"
    >
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
          :class="{'platform-active': item.value === currentPlatform}"
          class="platform"
          @click="changePlatform(item)"
        >{{item.name}}</view>
      </view>
      <view
        v-if=" currentPlatform !== 'wph'&&currentPlatform !== 'kl'"
        class="filter-list"
      >
        <view
          v-for="item in filterList"
          :key="item.value"
          :class="{'filter-active': item.value === currentFilter}"
          class="filter-item"
          @click="chooseFilter(item)"
        >
          <view class="text-wrapper">
            {{item.name}}
          </view>
          <view
            class="icon-wrapper"
            v-if="item.sort && item.sort.length ===2"
          >
            <view
              class="arrow top"
              :class="{'active': item.value === currentFilter && currentSortRule==='asc'}"
            ></view>
            <view
              class="arrow bottom"
              :class="{'active': item.value === currentFilter && currentSortRule==='desc'}"
            ></view>
          </view>
          <view
            class="icon-wrapper onlyOneChild"
            v-if="item.sort && item.sort.length ===1"
          >
            <view
              class="arrow bottom"
              :class="{'active': item.value === currentFilter}"
            ></view>
          </view>
          <view
            class="icon-wrapper onlyOneChild1"
            v-else-if="item.dropDown"
          >
            <!-- v-if="item.value === currentFilter" -->
            <icon
              class="iconfont iconshaixuan"
              :class="{'iconfont-active':item.value === currentFilter}"
            ></icon>
          </view>
        </view>
        <view
          v-if="currentFilter === 'average' && isMaskShow"
          class="average-wrapper"
        >
          <view
            v-for="item in averageList"
            :key="item.value"
            :class="{'active':currentAverageSortRule === item.value}"
            class="average-item"
            @click="chooseAverageSortRule(item)"
          >
            {{item.name}}
          </view>
        </view>
      </view>
      <view
        v-if="currentPlatform === 'wph'||currentPlatform === 'kl'"
        class="filter-list"
        clearfix
      >
        <view
          v-for="item in filterListWPH"
          :key="item.value"
          :class="{'filter-active': item.value === currentFilter}"
          class="filter-item"
          @click="chooseFilter(item)"
        >
          <view class="text-wrapper">
            {{item.name}}
          </view>
          <view
            class="icon-wrapper"
            v-if="item.sort && item.sort.length ===2"
          >
            <view
              class="arrow top"
              :class="{'active': item.value === currentFilter && currentSortRule==='asc'}"
            ></view>
            <view
              class="arrow bottom"
              :class="{'active': item.value === currentFilter && currentSortRule==='desc'}"
            ></view>
          </view>
        </view>
      </view>
      <view
        v-if="currentFilter==='custom' && isMaskShow"
        class="filter-form"
        data-ref="filterForm"
      >
        <view class="label-name">价格区间</view>
        <view class="form-row">
          <input
            v-model="minPrice"
            class="price-input"
            placeholder="填写最低价格(元)"
            placeholder-style="color:#ccc"
            type="number"
            @blur="onMinPriceChange"
          />
          <view class="line"></view>
          <input
            v-model="maxPrice"
            class="price-input"
            placeholder="填写最高价格(元)"
            placeholder-style="color:#ccc"
            type="number"
            @blur="onMaxPriceChange"
          />
        </view>
        <view class="form-row">
          <button
            class="btn-reset"
            @click="resetFilterForm"
          >重置</button>
          <button
            class="btn-confirm"
            @click="searchLimited"
          >确认</button>
        </view>
      </view>
      <view
        v-if="isMaskShow"
        class="mask"
        @click="closeFilterForm"
      ></view>
      <view
        v-if="currentPlatform !== 'wph'&&currentPlatform !== 'kl'"
        :class="{hidden: couponWarnHide}"
        class="ticket-warn"
      >
        <view class="text-warn">
          <icon class="iconfont iconcoupon"></icon>
          <text>仅显示优惠券商品</text>
        </view>
        <switch
          :checked="couponChecked"
          color="#FF2942"
          style="transform:scale(0.7)"
          class="ticket-switch"
          @change="switchChange"
        />
      </view>
    </view>
    <view
      v-if="currentPlatform === 'wph'||currentPlatform === 'kl'"
      class="ticket-warn-other"
    ></view>
    <view class="goods-list">
      <view
        class="goods-item"
        :key="index"
        v-for="(goods,index) in goodsList"
      >
        <goods-list
          :item='goods'
          :showBtn="goods.cpsType.code === 'wph'||goods.cpsType.code === 'kl'"
        ></goods-list>
      </view>
      <reach-bottom :reachBottom="reachBottom"></reach-bottom>
    </view>
    <view
      v-if="noResult"
      class="empty-result-tips"
    >
      没有搜索到相关商品，请换个关键词试试
    </view>
    <app-public :data="publicData"></app-public>
  </view>
</template>

<script>
import { CLEAN } from '../../config/imgUrl'
import goodsList from '../../components/goods'
export default {
  components: {
    goodsList
  },
  data() {
    return {
      publicData: this.app.getPublicData(),
      CLEAN: CLEAN, // 清除按钮
      noMore: false, // 没有更多
      queryWord: '',
      searchHistory: [],
      currentPlatform: 'pdd',
      currentFilter: 'average',
      prevFilter: '',
      currentSortRule: 'desc', // 默认降序
      currentAverageSortRule: 'average',
      levels: false,
      minPrice: null,
      maxPrice: null,
      isMaskShow: false, // 是否显示综合排序弹窗
      couponChecked: false,
      reachBottom: null, // null: 还没到达底部  more: 加载中  end: 没有更多商品
      hasCoupon: false, // 是否只显示优惠券  0  否  1 是
      goodsList: [],
      noResult: false,
      platformList: [
        { name: '拼多多', value: 'pdd' },
        { name: '京东', value: 'jd' },
        { name: '唯品会', value: 'wph' },
        { name: '苏宁', value: 'sn' },
        { name: '考拉', value: 'kl' }
      ],
      filterList: [
        { name: '综合', value: 'average', sort: ['desc'] },
        { name: '销量', value: 'sales', sort: ['asc', 'desc'] },
        { name: '价格', value: 'price', sort: ['asc', 'desc'] },
        { name: '筛选', value: 'custom', sort: [], dropDown: true }
      ],
      filterListWPH: [
        { name: '精选', value: 'average', sort: [] },
        { name: '折扣', value: 'coupon', sort: ['asc', 'desc'] },
        { name: '价格', value: 'price', sort: ['asc', 'desc'] }
      ],
      averageList: [
        { name: '综合排序', value: 'average' },
        { name: '补贴比例从高到低', value: 'commissionRate' },
        { name: '补贴从高到低', value: 'commission' }
      ],
      pageRecord: {
        // 页码记录
        pdd: {
          page: 1,
          pageSize: 10
        },
        jd: {
          page: 1,
          pageSize: 10
        },
        wph: {
          page: 1,
          pageSize: 10
        },
        sn: {
          page: 1,
          pageSize: 10
        },
        kl: {
          page: 1,
          pageSize: 10
        }
      },
      cacheData: {
        jd: {
          currentFilter: '',
          currentSortRule: '',
          currentAverageSortRule: ''
        },
        pdd: {
          currentFilter: '',
          currentSortRule: '',
          currentAverageSortRule: ''
        },
        wph: {
          currentFilter: '',
          currentSortRule: '',
          currentAverageSortRule: ''
        },
        sn: {
          currentFilter: '',
          currentSortRule: '',
          currentAverageSortRule: ''
        },
        kl: {
          currentFilter: '',
          currentSortRule: '',
          currentAverageSortRule: ''
        }
      }
    }
  },
  onLoad(option) {
    // console.log(option)
    const that = this
    this.currentPlatform = option.type
    this.queryWord = option.keyWord
    this.searchHistory = uni.getStorageSync('searchHistory')
    this.search()
  },
  onShow() {
    this.$cli && this.app.productSearch()
    this.levels = true
  },
  onReachBottom() {
    if (this.noMore) {
      return false
    }
    if (this.reachBottom === 'end') {
      return
    }
    this.reachBottom = 'more'
    if (this.queryWord) {
      this.search(true)
    }
  },
  computed: {
    isShowClean() {
      return this.queryWord ? true : false
    }
  },
  methods: {
    clean() {
      this.queryWord = ''
    },
    changePlatform(item) {
      this.levels = false
      if (this.currentPlatform === item.value) {
        return
      }
      this.saveToCacheData(this.currentPlatform) // #1
      this.closeFilterForm() // #2  注意 #1 和 #2 这两行代码顺序不能变 #2涉及到对currentFilter的操作
      this.currentPlatform = item.value
      this.pageRecord[this.currentPlatform].page = 1
      if (this.queryWord.trim().length) {
        this.reachBottom = null
        this.couponChecked = false
        this.hasCoupon = 0
        this.search(false, item.value).then((res) => {
          this.currentPlatform = item.value
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 200
          })
        })
      }
    },
    searchGoods() {
      this.queryWord = this.queryWord.trim()
      if (!this.queryWord) {
        this.app.msg('请输入商品名称')
        return
      }
      this.couponChecked = false
      this.hasCoupon = 0
      this.reachBottom = null
      this.pageRecord[this.currentPlatform].page = 1
      this.search().then((res) => {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 200
        })
        this.searchHistory.unshift(this.queryWord)
        this.searchHistory = [...new Set(this.searchHistory)].slice(0, 15)
        try {
          uni.setStorageSync('searchHistory', this.searchHistory)
        } catch (e) {
          console.log('searchHistory 本地存储失败')
        }
      })
    },
    search(more = false, newPlatform = false) {
      // more 是否加载更多   true  加载更多  false  第一次搜索
      if (!this.queryWord) {
        this.app.msg('请输入商品名称')
        return
      }
      if (newPlatform) {
        this.getFromCacheData(newPlatform)
        if (!this.currentFilter) {
          this.currentFilter = 'average'
        }
      }
      if (more) {
        this.pageRecord[this.currentPlatform].page++
      } else {
        // console.log(Object.values)
        if (!Object.values) {
          Object.values = function (obj) {
            let values = []
            for (let key in obj) {
              values.push(obj[key])
            }
            return values
          }
        }
        for (let value in Object.values(this.pageRecord)) {
          value = {
            page: 1,
            pageSize: 10
          }
        }
      }
      this.sortType = null
      this.noResult = false
      // if (!more) {
      //   this.app.loading()
      // }
      const apiName = 'queryGoods' + this.currentPlatform.toUpperCase()
      const page = this.pageRecord[this.currentPlatform].page
      const pageSize = this.pageRecord[this.currentPlatform].pageSize
      const systemInfo = uni.getSystemInfoSync()
      let microDevice = ''
      if (systemInfo.platform === 'ios') {
        microDevice = '01'
      } else if (systemInfo.platform === 'android') {
        microDevice = '02'
      } else if (systemInfo.platform === 'devtools') {
        microDevice = '03'
      }
      const data = {
        keyword: decodeURIComponent(this.queryWord),
        microDevice,
        page,
        pageSize
      }
      if (this.currentFilter === 'custom') {
        if (this.minPrice) {
          data.priceStart = this.minPrice
        }
        if (this.maxPrice) {
          data.priceEnd = this.maxPrice
        }
      } else if (this.currentFilter === 'price') {
        this.sortType = this.currentSortRule === 'asc' ? '01' : '02'
      } else if (this.currentFilter === 'sales') {
        this.sortType = this.currentSortRule === 'asc' ? '03' : '04'
      } else if (this.currentFilter === 'coupon') {
        this.sortType = this.currentSortRule === 'asc' ? '07' : '08'
      } else if (this.currentFilter === 'average') {
        if (this.currentPlatform !== 'wph' && this.currentPlatform !== 'kl') {
          this.sortType =
            this.currentAverageSortRule === 'commissionRate'
              ? '10'
              : this.currentAverageSortRule === 'commission'
              ? '06'
              : null
        }
        if (this.currentPlatform === 'wph' || this.currentPlatform === 'kl') {
          this.sortType = null
        }
      }
      if (this.sortType) {
        data.sortType = this.sortType
      }
      if (this.currentPlatform !== 'wph' && this.currentPlatform !== 'kl') {
        data.hasCoupon = this.hasCoupon
      }
      // console.log(data)
      return new Promise((resolve, reject) => {
        this.app
          .request({
            url: this.app.api[apiName],
            type: 'GET',
            data: data,
            load: !more
          })
          .then((res) => {
            if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
              this.noMore = true
            } else {
              this.noMore = false
            }
            // console.log(res)
            let goodsArr = []
            if (Array.isArray(res.data.data)) {
              goodsArr = res.data.data
            }
            if (more) {
              // console.log('搜索更多')
              this.goodsList.push(...goodsArr)
            } else {
              // console.log('第一次搜搜')
              this.goodsList = goodsArr
            }
            this.noResult = !more && !this.goodsList.length
            this.reachBottom =
              this.goodsList.length !== 0 && goodsArr.length === 0
                ? 'end'
                : null
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    saveToCacheData(platform) {
      this.cacheData[platform].currentFilter = this.currentFilter
      this.cacheData[platform].currentSortRule = this.currentSortRule
      this.cacheData[
        platform
      ].currentAverageSortRule = this.currentAverageSortRule
    },
    getFromCacheData(platform) {
      this.currentFilter = this.cacheData[platform].currentFilter
      this.currentSortRule = this.cacheData[platform].currentSortRule
      this.currentAverageSortRule = this.cacheData[
        platform
      ].currentAverageSortRule
    },
    chooseFilter(item) {
      this.levels = false
      this.prevFilter = this.currentFilter
      this.reachBottom = null
      let refresh = false
      if (item.value === this.currentFilter) {
        // 重复点击
        if (
          item.value === 'price' ||
          item.value === 'sales' ||
          item.value === 'coupon'
        ) {
          this.currentSortRule = this.currentSortRule === 'asc' ? 'desc' : 'asc'
          refresh = true
        }
        if (item.value === 'average') {
          this.isMaskShow =
            this.currentPlatform !== 'wph' && this.currentPlatform !== 'kl'
          refresh =
            this.currentPlatform === 'wph' || this.currentPlatform === 'kl'
        }
        if (item.value === 'custom') {
          this.isMaskShow = true
        }
      } else {
        if (
          item.value === 'price' ||
          item.value === 'sales' ||
          item.value === 'coupon'
        ) {
          // 切换  默认降序
          this.currentSortRule = 'desc'
          // this.currentAverageSortRule = 'average'
          this.isMaskShow = false
          refresh = true
        }
        if (item.value === 'average') {
          this.currentAverageSortRule = 'average'
          this.isMaskShow =
            this.currentPlatform !== 'wph' && this.currentPlatform !== 'kl'
          refresh =
            this.currentPlatform === 'wph' || this.currentPlatform === 'kl'
        }
        if (item.value === 'custom') {
          this.isMaskShow = true
        }
      }
      this.currentFilter = item.value
      if (refresh) {
        this.pageRecord[this.currentPlatform].page = 1
        this.search().then((res) => {
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 200
          })
        })
      }
    },
    chooseAverageSortRule(item) {
      this.currentAverageSortRule = item.value
      this.reachBottom = null
      this.pageRecord[this.currentPlatform].page = 1
      this.search()
        .then(() => {
          this.isMaskShow = false
        })
        .catch((err) => {
          this.isMaskShow = false
          this.app.msg(err.data.message)
        })
    },
    closeFilterForm() {
      this.isMaskShow = false
      if (!this.minPrice && !this.maxPrice) {
        this.currentFilter = this.prevFilter
      }
    },
    onMaxPriceChange(event) {
      if (/^[0-9]+\.?[0-9]*$/.test(event.detail.value)) {
        this.maxPrice = Math.abs(event.detail.value).toFixed(0)
        // console.log('成功')
      } else {
        this.maxPrice = null
        this.app.msg('请输入正确的价格')
      }
    },
    onMinPriceChange(event) {
      if (/^[0-9]+\.?[0-9]*$/.test(event.detail.value)) {
        this.minPrice = Math.abs(event.detail.value).toFixed(0)
        // console.log('成功')
      } else {
        this.minPrice = null
        this.app.msg('请输入正确的价格')
      }
    },
    resetFilterForm() {
      this.minPrice = null
      this.maxPrice = null
      setTimeout(() => {
        // 解决手机上无法先失去焦点 再清空的bug
        this.minPrice = null
        this.maxPrice = null
      }, 500)
    },
    searchLimited() {
      if (!this.minPrice || !this.maxPrice) {
        this.app.msg('请输入价格')
        return false
      }
      this.isMaskShow = false
      this.reachBottom = null
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 200
      })
      this.search()
    },
    switchChange(event) {
      this.hasCoupon = event.target.value ? 1 : 0
      this.couponChecked = event.target.value
      this.pageRecord[this.currentPlatform].page = 1
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: 320rpx;
  background-color: #fff;
  -webkit-overflow-scrolling: touch;
  &.main-container-other {
    padding-top: 250rpx;
  }
  .toolbars {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 248rpx;
    z-index: 999999999;
    box-shadow: 0 1rpx 2rpx #ddd;
    &.toolbars1 {
      z-index: 999999 !important;
    }
    .search-wrapper {
      position: relative;
      z-index: 999999;
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
          display: inline-block;
          width: 28rpx;
          height: 28rpx;
          margin: 0 15rpx 0 20rpx;
          font-size: 28rpx;
          vertical-align: 10%;
        }
        .search-input {
          width: 480rpx;
          height: 100%;
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
      position: relative;
      z-index: 99999;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 96rpx;
      background: #fff;
      border-bottom: 1rpx solid #eee;
      line-height: 96rpx;
      font-size: 30rpx;
      .platform {
        flex-grow: 1;
        position: relative;
        box-sizing: border-box;
        color: $color-dark-grey;
        text-align: center;
        &.platform-active {
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
    .filter-list {
      position: relative;
      z-index: 100;
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      height: 78rpx;
      font-size: 28rpx;
      background: #fff;
      .filter-item {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        height: 100%;
        color: $color-grey;
        &.filter-active {
          color: #ff2741;
        }
        .icon-wrapper {
          position: relative;
          height: 28rpx;
          width: 20rpx;
          margin-left: 14rpx;
          &.onlyOneChild {
            top: 0rpx;
          }
          &.onlyOneChild1 {
            margin-top: -12rpx;
          }
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
                border-top-color: #ef2533;
                border-right-color: #ef2533;
              }
            }
            &.bottom {
              bottom: 7rpx;
              position: absolute;
              border-color: transparent transparent #ccc #ccc;
              transform: rotate(-45deg);
              &.active {
                border-bottom-color: #ef2533;
                border-left-color: #ef2533;
              }
            }
          }
          .iconfont {
            font-size: 20rpx;
            color: #ccc;
            &.iconfont-active {
              color: #ff2741;
            }
          }
        }
        .text-wrapper {
          display: flex;
          flex-direction: column;
          align-content: center;
          align-items: center;
          line-height: 86rpx;
        }
      }
      .average-wrapper {
        position: absolute;
        left: 16rpx;
        top: 78rpx;
        z-index: 100;
        max-width: 300rpx;
        border-radius: 10rpx;
        padding: 20rpx 0;
        background-color: #fff;
        .average-item {
          line-height: 80rpx;
          font-size: 26rpx;
          color: #333;
          padding: 0 30rpx;
          &.active {
            color: #ef2533;
          }
        }
      }
    }
    .filter-form {
      position: fixed;
      top: 248rpx;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 30rpx 30rpx 0;
      background-color: #f2f2f2;
      font-size: 26rpx;
      .label-name {
        color: $color-grey;
        margin-bottom: 24rpx;
      }
      .form-row {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        margin-bottom: 40rpx;
        .price-input {
          width: 321rpx;
          height: 68rpx;
          padding: 0 20rpx;
          box-sizing: border-box;
          background: #fff;
          border: 1rpx solid #dcdcdc;
          font-size: 24rpx;
          border-radius: 40rpx;
        }

        .line {
          width: 16rpx;
          height: 2rpx;
          margin: 0 16rpx;
          background-color: #ddd;
        }
        .btn-reset {
          width: 250rpx;
          height: 80rpx;
          background: #fff;
          border: 1rpx solid #f82f23;
          border-radius: 50rpx;
          font-size: 28rpx;
          font-weight: 500;
          color: #f93428;
          line-height: 76rpx;
          text-align: center;
          margin-right: 30rpx;
        }
        .btn-confirm {
          width: 411rpx;
          height: 80rpx;
          background: linear-gradient(-90deg, #f82e22 0%, #fc4e45 100%);
          border-radius: 40rpx;
          color: #fff;
          font-size: 28rpx;
          line-height: 76rpx;
        }
      }
    }
    .mask {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
    .ticket-warn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 72rpx;
      padding: 0 26rpx;
      background-color: #f2f2f2;
      box-sizing: border-box;
      &.hidden {
        display: none;
      }
      .text-warn {
        // display: flex;
        // align-items: center;
        // align-content: center;
        color: $color-dark-grey;
        font-size: 26rpx;
        .iconfont {
          vertical-align: -2%;
          margin-right: 12rpx;
          font-size: 32rpx;
          color: $color-light-grey;
        }
      }
      .ticket-switch {
        position: relative;
        right: -28rpx;
      }
    }
  }
  .ticket-warn-other {
    width: 100%;
    height: 18rpx;
    background-color: #f2f2f2;
  }
  .goods-list {
    // padding: 0 18rpx;
    // margin-top: 6rpx;
    .goods-item {
      padding: 20rpx 20rpx 0;
      // margin-bottom: 10rpx;
      background-color: #fff;
      // border-radius: 16rpx;
    }
  }
  .empty-result-tips {
    padding: 30rpx;
    color: #777;
    font-size: 26rpx;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
}
</style>
