<template>
 <div>
 {{demo}}
 </div>
</template>
 
<script>
 export default {
 name: "C",
 inject: ['for'],
 data() {
  return {
  demo: this.for
  }
 }
 }
</script>