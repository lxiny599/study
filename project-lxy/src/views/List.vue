<template>
    <div>
        <list :list="list"></list>
        <button @click="isShow()">弹窗</button>
    </div>
</template>

<script>
import list from "../components/list/list"

import Notice from '../components/Notice.vue'
export default {
    name: "Parent",
    components: { list },
    data() {
        return {
            list:[{
                name: "经济",
                children: [{
                    name: "如家",
                    children: [{
                        name: "上江路-如家"
                    },
                    {
                        name: "望江路-如家"
                    }]
                },
                {
                    name: "7天",
                    children: [{
                        name: "上江路-7天"
                    },
                    {
                        name: "望江路-7天"
                    }]
                }]
            }]
        }
    },
    methods:{
        isShow(){
            this.$create(Notice, {
            title: '测试',
            message: '提示信息'
            }).show()
        }
    }    
}
</script>