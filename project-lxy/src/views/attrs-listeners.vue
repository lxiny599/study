<template>
    <div>
<child-com1 
:name="name" 
:age='age'
:gender="gender"
:height="height"
title="程序员成长指南"></child-com1>
    </div>
</template>

<script>
import childCom1 from '../components/child/childCom1'
export default {
    components:{
        childCom1
    },
    data(){
        return{
            name:"zhang",
            age:'18',
            gender:"nv",
            height:"158"
        }
    }
}
</script>