<template>
  <view
    class="page-wrap"
    :style="pagePdTop"
  >
    <!-- 置顶的头部 -->
    <view
      class="page-hd"
      :style="hdClass"
      v-if="hasFixHd"
    >
      <slot name="hd"></slot>
    </view>
    <!-- page 组件 -->
    <slot></slot>
  </view>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    hdClass: {
      type: String,
      default: ''
    },
    hasFixHd: {
      // 是否有固定头部
      type: Boolean,
      default: false
    },
    timerHeight: {
      // 时间栏的高度， 当有值时，即表示不要默认头部
      type: String,
      default: ''
    }
  },
  data() {
    return {
      publicData: this.app.getPublicData(),
      pagePdTop: null,
      hdHeight: 0 // 头部高度
    }
  },
  computed: {},
  created() {},
  mounted() {
    const that = this
    if (this.hasFixHd) {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('.page-hd')
        .boundingClientRect(data => {
          that.hdHeight = data.height
          that.pagePdTop = that.pageTop()
        })
        .exec()
    } else {
      this.pagePdTop = this.pageTop()
    }
    // 获取页面的paddingTop
  },
  methods: {
    ...mapMutations(['setAppPubrep']),
    pageTop() {
      // 计算page的paddingTop
      // 默认导航，固定头部
      const defaultTimer = this.timerHeight === ''
      let style = null
      if (defaultTimer && this.hasFixHd) {
        style = `padding-top: ${this.hdHeight}px`
      } else if (!defaultTimer && !this.hasFixHd) {
        // 无固定头，非默认导航
        style = `padding-top: ${this.timerHeight}px`
      } else if (defaultTimer && !this.hasFixHd) {
        // 默认导航， 无固定头
        style = ''
      } else if (!defaultTimer && this.hasFixHd) {
        //非默认导航，固定头
        style = `padding-top: ${defaultTimer + hdHeight}px`
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  position: relative;
  padding: 0 24rpx 30rpx;
  // height: 100%;
  box-sizing: border-box;
}
.page-hd {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10
}
</style>