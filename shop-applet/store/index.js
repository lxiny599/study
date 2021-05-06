import Vue from 'vue'
import Vuex from 'vuex'
import { loadFromLocal } from '../commons/utils'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appPubrep: loadFromLocal('appPubrep'),
    hasLogin: loadFromLocal('hasLogin'),
    userInfo: loadFromLocal('userInfo'),
    Authorization: loadFromLocal('Authorization'),
    referId: loadFromLocal('referId'),
    nickName: loadFromLocal('nickName'),
    avatarUrl: loadFromLocal('avatarUrl'),
  },
  mutations: {
    login(state, provider) {
      const pubrep = {
        userid: '3769', // userId
        merchantid: '2', // 代理商编号
      }
      state.appPubrep = pubrep
      state.hasLogin = !!provider.Authorization
      state.userInfo = provider
      state.Authorization = provider.Authorization
      state.referId = provider.referId
      state.nickName = provider.nickName
      state.avatarUrl = provider.avatarUrl

      uni.setStorageSync('hasLogin', !!provider.Authorization)
      uni.setStorageSync('userInfo', provider)
      uni.setStorageSync('appPubrep', pubrep)
      uni.setStorageSync('Authorization', provider.Authorization)
      uni.setStorageSync('referId', provider.referId)
      uni.setStorageSync('nickName', provider.nickName)
      uni.setStorageSync('avatarUrl', provider.avatarUrl)
    },
    logout(state) {
      state.hasLogin = false
      state.userInfo = null
      state.Authorization = null
      state.referId = null
      state.nickName = null
      state.avatarUrl = null
      state.appPubrep = null

      uni.removeStorageSync('hasLogin')
      uni.removeStorageSync('appPubrep')
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('Authorization')
      uni.removeStorageSync('referId')
      uni.removeStorageSync('nickName')
      uni.removeStorageSync('avatarUrl')
    },
  },
})

export default store
