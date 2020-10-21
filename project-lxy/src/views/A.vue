/ A.vue
 
<template>
 <div>
    <comB></comB>
 </div>
</template>
 
<script>
 import comB from '../components/inject/comB.vue'
 export default {
 name: "A",
 provide: {
  for: "demo1"
 },
 components:{
  comB
 }
 }
</script>