<template>
  <div>
    <button @click="additionHandle">++</button>
  </div>
</template>

<script>
import { EventBus } from '../../plugin/event-bus.js'
console.log(EventBus)
export default {
  data() {
    return {
      num: 1
    }
  },
  methods: {
    additionHandle() {
      EventBus.$emit('addition', {
        num: this.num++
      })
    }
  }
}
</script>