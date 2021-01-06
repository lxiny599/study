
<!-- 加载中显示，如果加载完无数据也可以显示 -->
<template>
  <view
    class="loading"
    v-if="data.load!==false"
  >
    <view>
      <view v-if="!data||data.load===true">
        <view class="i"></view>
        <view class="i"></view>
        <view class="i"></view>
        <!-- <image
          class="loadong-img"
          src="../static/loading.gif"
          mode='widthFix'
        ></image> -->
      </view>
      <view
        v-else
        class="appNotData"
      >
        <view class="notContent">
          <view class="iconempty iconfont"></view>
          <text>{{data.content||data.load||'暂无数据哦~'}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {}
  },
  methods: {}
}
</script>