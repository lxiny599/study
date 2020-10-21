<template>
 <div class="hello_world">
 <div>{{msg}}</div>
 <com-a ref="comA"></com-a>
 <button @click="changeA">点击改变子组件值</button>
 </div>
</template>
 
<script>
import ComA from '../components/children/children.vue'
export default {
 name: 'HelloWorld',
 components: { ComA },
 data() {
 return {
  msg: 'Welcome',
  num:1
 }
 },
 mounted(){
     console.log(this.$refs.comA.messageA)     
 }, 
 methods: {
 changeA() {
  // 获取到子组件A
  this.$children[0].messageA = `this is new value${this.num++}`
     console.log(this.$refs.comA.messageA)  
 }
 }
}
</script>