<template>
    <div id="childB">
        <h1>我是组件B</h1>
        <button @click="transform">点我让A组件接收数据</button>
        <p>因为你点了A，所以我的信息发生了变化：{{AMessage}}</p>
    </div>
</template>

<script>
export default {
    data(){
        return{
            BMessage:'Hello,组件A，我是组件B'
        }
    },
    computed:{
        AMessage(){
            return this.$store.state.AMsg
        }
    },
    methods:{
        transform(){
            this.$store.commit('receiveBMsg',{
                BMsg:this.BMessage
            })
        }
    }
}
</script>