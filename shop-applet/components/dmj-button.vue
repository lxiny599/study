<template>
  <button
    type="primary"
    class="dmj-button"
    :class="[`dmj-button-${size}`, {'is-round': round}]"
    :style="{'backgroundColor': bgColor}"
  >
    <text class="button-text">
      <slot></slot>
    </text>
  </button>
</template>

<script>
export default {
  props: {
    bgColor: {
      // 按钮的背景色
      type: String
    },
    // 是否为两端圆角
    round: {
      type: Boolean,
      default: false
    },
    /* 按钮的尺寸
     * mini mini型按钮
     * small 小型按钮
     * default 普通按钮
     * medium 中等按钮
     * large 大型按钮
     * large-x X大型按钮
     * large-xx XX大型按钮
     */
    size: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.dmj-button {
  display: inline-block;
  margin: 0;
  padding: 13rpx 22rpx;
  cursor: pointer;
  background: $color-white;
  // color: $color-dark-grey;
  color: $color-grey;
  text-align: center;
  outline: none;
  @include border(1rpx, $color-border-main, solid, $radius-size-small);
  font-size: 24rpx;
  // font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  box-sizing: border-box;
}

// 按钮尺寸相关样式
.dmj-button-mini {
  // height: 32
  padding: 6rpx 16rpx;
  font-size: 18rpx;
  border-radius: 4rpx;
  &.is-round {
    border-radius: 32rpx;
  }
}
.dmj-button-small {
  // height: 34
  padding: 7rpx 18rpx;
  font-size: 20rpx;
  border-radius: 6rpx;
  &.is-round {
    border-radius: 34rpx;
  }
}
.dmj-button-medium {
  // heihgt: 56
  padding: 15rpx 20rpx;
  font-size: 26rpx;
  &.is-round {
    border-radius: 56rpx;
  }
}
.dmj-button-large {
  // height: 64
  padding: 19rpx 24rpx;
  font-size: 26rpx;
  &.is-round {
    border-radius: 64rpx;
  }
}
.dmj-button-large-x {
  // height: 68
  padding: 21rpx 26rpx;
  font-size: 26rpx;
  &.is-round {
    border-radius: 68rpx;
  }
}
.dmj-button-large-xx {
  // height: 80
  padding: 26rpx 28rpx;
  font-size: 28rpx;
  &.is-round {
    border-radius: 80rpx;
  }
}
</style>
