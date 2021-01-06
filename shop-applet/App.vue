<script>
import { mapMutations } from 'vuex'
export default {
  onLaunch: function () {
    // 小程序检查更新
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
  methods: {
    ...mapMutations(['login'])
  }
}
</script>

<style>
/*每个页面公共css */
page {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
}
</style>
