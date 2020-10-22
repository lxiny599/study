import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 9,
    AMsg:'',
    BMsg:''
  },
  mutations: {
    add(state,n){
      state.count+=n
    },
    reduce(state){
      state.count--
    },
    receiveAMsg(state,payload){
      state.AMsg = payload.AMsg
    },
    receiveBMsg(state,payload){
      state.BMsg = payload.BMsg
    }
  },
  getters:{
    count:state=>state.count+=0
  },
  actions: {
    addAction(context){
      context.commit('add',10)
      setTimeout(()=>{
        context.commit('reduce')
      },2000)
      console.log('我是先执行的')
    },
    reduceAction({commit}){
      commit('reduce')
    }
  },
  modules: {
  }
})
