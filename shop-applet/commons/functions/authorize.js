/**
 * 获取授权、验证
 * @param scopeName 需要获取的权限
 * @param url 需要保存的图片地址
 */

function authorize(scopeName, url = '') {
  //获取授权、验证，返回结果直接获取数据，否则不返回
  return new Promise((rev, err) => {
    uni.getSetting({
      //获取授权信息
      success(res) {
        if (res.authSetting['scope.' + scopeName] === false) {
          //授权被用户拒绝了
          uni.openSetting({
            //执行授权弹窗
            success(sres) {
              if (sres.authSetting['scope.' + scopeName] === true) {
                //用户授权通过，递归获取数据
                authorize(scopeName, url).then(rev).catch(err) //递归
              }
            }
          })
        } else {
          //已经拥有权限，直接获取数据
          switch (scopeName) {
            case 'address': //获取地址
              uni.chooseAddress({
                success: rev,
                fail: err
              })
              break
            case 'writePhotosAlbum': //保存图片
              uni.saveImageToPhotosAlbum({
                filePath: url,
                success: rev,
                fail: err
              })
              break
          }
        }
      }
    })
  })
}

export default authorize
