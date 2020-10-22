<template>
  <div>
    <show-num></show-num>
    <addition-num></addition-num>
  </div>
</template>

<script>
import showNum from '../components/eventBus/showNum.vue'
import additionNum from '../components/eventBus/additionNum.vue'
export default {
  components: {
    showNum,
    additionNum
  }
}
</script>