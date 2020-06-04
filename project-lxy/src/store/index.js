import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 9
  },
  mutations: {
    add(state,n){
      state.count+=n
    },
    reduce(state){
      state.count--
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
