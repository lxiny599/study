import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    hasLogin: uni.getStorageSync('hasLogin'),
    Authorization: uni.getStorageSync('Authorization'),
    userInfo: uni.getStorageSync('userInfo'),
    referId: uni.getStorageSync('referId'),
    nickName: uni.getStorageSync('nickName'),
    avatarUrl: uni.getStorageSync('avatarUrl')
  },
  mutations: {
    login(state, provider) {
      state.hasLogin = !!provider.Authorization
      state.Authorization = provider.Authorization
      state.userInfo = provider
      state.referId = provider.referId
      state.referId = provider.nickName
      state.referId = provider.avatarUrl

      uni.setStorageSync('hasLogin', !!provider.Authorization)
      uni.setStorageSync('Authorization', provider.Authorization)
      uni.setStorageSync('userInfo', provider)
      uni.setStorageSync('referId', provider.referId)
      uni.setStorageSync('nickName', provider.nickName)
      uni.setStorageSync('avatarUrl', provider.avatarUrl)
    },
    logout(state) {
      state.hasLogin = false
      state.Authorization = null
      state.userInfo = null
      state.referId = null
      state.nickName = null
      state.avatarUrl = null

      uni.removeStorageSync('hasLogin')
    }
  }
})

export default store
