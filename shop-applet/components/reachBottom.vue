<template>
  <view
    v-if="reachBottom"
    class="end-tips"
  >
    <view
      :class="{'show': reachBottom === 'more'}"
      class="tip-loading"
    >加载中...</view>
    <view
      :class="{'show': reachBottom === 'end'}"
      class="tip-noMore"
    >{{reachText}}</view>
  </view>
</template>

<script>
export default {
  props: {
    reachBottom: {
      // 是否到达底部 以及到达底部时候的状态 null: 还没到达底部   more: 到达底部此时状态是 加载中  end: 到达底部  此时状态是 没有更多商品
      type: String,
      default: null
    },
    reachText: {
      type: String,
      default: '没有更多商品'
    }
  },
  data() {
    return {}
  }
}
</script>

<style  scoped lang="scss">
.end-tips {
  width: 100%;
  font-size: 28rpx;
  color: #666;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  .tip-loading,
  .tip-noMore {
    display: none;
    width: 100%;
    padding-bottom: 30rpx;
    text-align: center;
    &.show {
      display: block;
    }
  }
}
</style>
