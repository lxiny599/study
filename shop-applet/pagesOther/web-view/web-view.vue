<template>
  <block>
    <web-view :src="url"></web-view>
  </block>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  onLoad(val) {
    this.url = decodeURIComponent(val.url) //解码网址
  }
}
</script>
