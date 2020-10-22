<template>
  <div id="app">
    <ChildA/>
    <ChildB/>
  </div>
</template>

<script>
import ChildA from '../components/child/childA'
import ChildB from '../components/child/childB'
export default {
  name:'APP',
  components:{
    ChildA,
    ChildB
  }
}
</script>