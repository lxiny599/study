
<script>
import { mapMutations } from 'vuex'
import Vue from 'vue'
/* import { persistVuex } from './commons/utils'
let stopSubscribeMutation */
export default {
  data() {
    return {
      baseimgurl: '',
      navigateToLogin: false
    }
  },
  onLaunch() {
    // stopSubscribeMutation = persistVuex()
    const that = this
    const updateManager = uni.getUpdateManager()
    if (updateManager) {
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate);
      })
      updateManager.onUpdateReady((res) => {
        uni.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed((res) => {
        // 新的版本下载失败
      })
    }
    try {
      const userInfo = uni.getStorageSync('userInfo')
      this.login(userInfo)
    } catch (error) {
      console.log('App onLaunch 获取缓存信息失败', error)
    }
  },
  onShow(res) {
    Vue.prototype.$cli = true
    // uni.getClipboardData({
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
    // uni.setClipboardData({
    //   data: '',
    //   success: function () {
    //     console.log('success')
    //   }
    // })
  },
  methods: {
    ...mapMutations(['login']),
    goLoginPageTimeOut() {
      if (this.navigateToLogin) {
        return
      }
      this.navigateToLogin = true
      setTimeout(() => {
        uni.navigateTo({
          url: '/pagesOther/login/login'
        })
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uview-ui/index.scss';
</style>
