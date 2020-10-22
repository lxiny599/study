<template>
    <div>
        <p>name:{{name}}</p>
        <p>childCom1的$attrs:{{$attrs}}</p>
        <child-com2 v-bind="$attrs"></child-com2>
    </div>
</template>

<script>
import childCom2 from './childCom2'
export default {
    components:{
        childCom2
    },
    inheritAttrs:false,
    props:{
        name:String
    },
    created(){
        console.log(this.$attrs)
    }
}
</script>