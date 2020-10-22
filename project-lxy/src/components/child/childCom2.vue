<template>
    <div>
        <p>age:{{age}}</p>
        <p>childCom2:{{$attrs}}</p>
    </div>
</template>

<script>
export default {
    inheritAttrs:false,
    props:{
        age:String
    },
    created(){
        console.log(this.$attrs)
    }
}
</script>