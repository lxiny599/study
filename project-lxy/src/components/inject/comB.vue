<template>
 <div>
 {{demo}}
 <comC></comC>
 </div>
</template>
 
<script>
 import comC from './comC.vue'
 export default {
 name: "B",
 inject: ['for'],
 data() {
  return {
  demo: this.for
  }
 },
 components: {
  comC
 }
 }
</script>