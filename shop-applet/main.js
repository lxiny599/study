import Vue from 'vue'
import api from './config/api'
import store from './store'
import App from './App'
import { version } from './config'
import uView from 'uview-ui'
Vue.use(uView)
//公共组件
import dmjButton from './components/dmj-button.vue'
import appLoading from './components/loading.vue'
import appOpen from './components/open.vue'
import reachBottom from './components/reachBottom.vue'
import appPublic from './public'
import dmjPage from './components/page'

Vue.component('dmj-page', dmjPage) // page
Vue.component('dmj-button', dmjButton) // button
Vue.component('app-loading', appLoading) //加载中
Vue.component('app-open', appOpen) //弹窗
Vue.component('app-public', appPublic) //公共组件（包含弹窗）
Vue.component('reach-bottom', reachBottom) //加载更多
Vue.prototype.$cli = false
const cacheData = {} //当前生命周期缓存数据
Object.defineProperty(Vue.prototype, 'app', {
  get: function () {
    //加入原型属性函数事件

    const that = this.$root || this //获取调用vue实例

    const app = {
      //公共函数定义
      api,
      getPublicData() {
        //page公共数据
        return {
          openList: []
        }
      },
      request({
        //统一请求接口
        url,
        api = false,
        load = false,
        again = true,
        /*加载出错出现重新加载按钮*/
        data = {},
        params = {},
        cache = false,
        type = 'post',
        prohibit = '',
        /*是否取消遮罩*/
        cancelShade = true
      }) {
        url = api ? this.api[api] : url //解析api路径
        if (Object.keys(params).length !== 0) {
          let queryStr = ''
          Object.keys(params).forEach((key) => {
            queryStr += `&${key}=${params[key]}`
          })
          url += url.includes('?') ? '' : '?'
          url += queryStr
        }
        const args = arguments
        if (!url) return console.log('请传入api或者url')
        if (load) app.fullLoading()
        return new Promise((resolve, reject) => {
          if (
            cache &&
            app.getCache({
              url,
              formData: data,
              rev: resolve
            })
          )
            return //存在缓存数据,不在请求
          uni.request({
            url,
            data: data,
            method: type,
            header: {
              Authorization: uni.getStorageSync('Authorization'),
              version: version
            },
            success: function (res) {
              // console.log(res)
              if (res.data.result == true) {
                if (cache)
                  app.setCache({
                    //插入缓存数据
                    url,
                    formData: data,
                    cacheData: res
                  })
                resolve(res)
              } else if (res.data.code === 501 || res.data.code === 507) {
                store.commit('logout')
                //登入过期，重新登入
                // app.login().catch((err) => {
                //登入失败，进入登入页面
                wx.navigateTo({
                  url: '/pagesOther/login/login'
                })
                // })
              } else {
                //提示错误信息
                if (
                  res.data.code == 508 &&
                  !uni.getStorageSync('code508count')
                ) {
                  store.commit('logout')
                  uni.setStorageSync('code508count', 1)
                  // app.login().catch((err) => {
                  //登入失败，进入登入页面
                  wx.navigateTo({
                    url: '/pagesOther/login/login'
                  })
                  // })
                } else {
                  reject(res)
                  if (res.data.code !== 601) {
                    app.msg(res.data.message)
                  }
                }
              }
              load && app.fullLoading(false)
              //是否取消遮罩
              if (cancelShade) {
                app.loading(false)
              }
              prohibit
            },
            fail: function (res) {
              app.loading(false)
              console.log('接口请求出错：' + url, data, res)
              load && app.fullLoading(false)
              prohibit
              if (again) {
                //弹出重新加载提醒
                app.again({
                  arg: args[0],
                  rev: resolve,
                  err: reject
                })
              } else {
                reject(res)
              }
            }
          })
        })
      },
      login() {
        //用户登入
        return new Promise((resolve, reject) => {
          uni.getUserProfile({
            desc: '登录',
            success: (res) => {
              //获取用户信息
              const userInfo = res.userInfo
              uni.login({
                success: (res2) => {
                  //获取登入信息
                  const authVo = {
                    code: res2.code,
                    referId: uni.getStorageSync('superiorId') || '',
                    iv: res.iv,
                    encryptedData: res.encryptedData
                  }
                  that.app
                    .request({
                      //请求登入接口
                      api: 'AuthLoginByWeixin',
                      data: authVo,
                      load: true,
                      method: 'post'
                    })
                    .then((loginRes) => {
                      const loginData = loginRes.data.data
                      userInfo.Authorization = loginData.slice(
                        loginData.indexOf('-') + 1,
                        loginData.length
                      )
                      userInfo.referId = loginData.slice(
                        0,
                        loginData.indexOf('-')
                      )
                      that.login(userInfo) // 此处更新用户信息
                      uni.navigateBack()
                      try {
                        // console.log(
                        //   `referId: ${uni.getStorageSync('superiorId')}`
                        // )
                        uni.setStorageSync('hasLogin', true)
                        uni.setStorageSync('firstLogin', true)
                        uni.removeStorageSync('superiorId')
                        uni.removeStorageSync('code508count')
                      } catch (error) {
                        console.log(error)
                      }
                      resolve()
                    })
                    .catch((err) => {
                      reject(err)
                    })
                },
                fail() {
                  //获取授权失败
                  app.msg('授权信息，才能登录哦')
                  reject('获取登录信息失败')
                }
              })
            },
            fail: (err) => {
              console.log('uni.getUserInfo fail', err)
              reject(err)
            }
          })
        })
      },
      showLoginPage() {
        uni.navigateTo({
          url: '/pagesOther/login/login'
        })
      },
      cacheData, //缓存数据，不放入本地存储，以免缓存过久
      setCache({ url, formData, cacheData }) {
        //插入缓存
        let list = this.cacheData[url] || []
        list.push({
          formData,
          cacheData
        })
        this.cacheData[url] = list
      },
      getCache({ url, formData, rev }) {
        //获取缓存数据,减少请求次数
        let list = this.cacheData[url],
          isCache = false,
          that = this
        that.each(list, function (th, i) {
          let is = true
          that.each(th.formData, function (t1, i) {
            //仅判断第一层，如第二层存在obj，视为不缓存数据
            if (t1 !== formData[i]) return (is = false)
          })

          if (is) {
            isCache = true
            rev(th.cacheData)
            return false
          }
        })
        return isCache
      },
      countJson: {},
      count(name, num = 0) {
        //计数
        if (!cacheData.countJson) cacheData.countJson = {}
        let countJson = cacheData.countJson

        if (!name) return alert('请传入count name')
        if (!countJson[name]) countJson[name] = 0
        countJson[name] += num
        if (countJson[name] < 0) countJson[name] = 0
        return countJson[name]
      },
      getData(e, name) {
        return e.currentTarget.dataset[name]
      },
      each(list, fun) {
        for (let x in list) {
          if (fun(list[x], x) === false) return
        }
      },
      getOneTemp(url) {
        //获取单张缓存数据
        if (!cacheData.tempFileList) cacheData.tempFileList = {}

        let temp = cacheData.tempFileList

        return new Promise((rev, err) => {
          if (typeof temp[url] == 'string') return rev(temp[url])
          //已经存在本地缓存数据
          else if (temp[url] !== undefined) return false //已经在请求中，堆载成功回调数据

          temp[url] = 1

          if (url.indexOf('//tmp') != -1) {
            //已经缓存过了
            go(url)
          } //还未缓存
          else {
            uni.downloadFile({
              url,
              header: { Authorization: uni.getStorageSync('Authorization') },
              success(res) {
                go(res.tempFilePath)
              },
              fail() {
                app.loading(false)
                // app.msg('图片url可能已经下载到本地了：' + URL)
                app.msg('获取图片失败请稍后重试')
                err('图片url可能已经下载到本地了：' + URL)
              }
            })
          }

          function go(tempFilePath) {
            uni.saveFile({
              tempFilePath,
              success(e) {
                temp[url] = e.savedFilePath //插入图片缓存
                rev(e.savedFilePath)
              },
              fail(e) {
                temp[url] = undefined

                if (e.errMsg.indexOf('maximum size') != -1) {
                  //内存超出，清除数据后重新运行

                  uni.getSavedFileList({
                    // 获取文件列表
                    success(res) {
                      res.fileList.forEach((val, key) => {
                        // 遍历文件列表里的数据
                        if (key < res.fileList.length - 2)
                          // 删除存储的垃圾数据,保留最后两张图片，避免前台使用出错
                          uni.removeSavedFile({
                            filePath: val.filePath
                          })
                      })
                      app.getOneTemp(url).then(rev).catch(err) //递归
                    }
                  })
                } else {
                  //爆出错误信息
                  console.log('缓存远程图片到本地失败', e, url)
                  err('缓存远程图片到本地失败')
                }
              }
            })
          }
        })
      },
      getTemp(urlList = []) {
        //获取多张缓存数据
        let tempList = [],
          num = 0
        return new Promise((rev, err) => {
          app.each(urlList, (url, index) => {
            app
              .getOneTemp(url)
              .then((tempUrl) => {
                num++ //计数
                tempList[index] = tempUrl
                if (num >= urlList.length) rev(tempList) //全部加载结束
              })
              .catch((e) => {
                num++ //计数
                if (num >= urlList.length) rev(tempList) //全部加载结束
              })
          })
        })
      },
      unit(val) {
        //单位px计算
        return typeof val == 'number' ? val + 'upx' : val
      },
      loading(is = true) {
        //加载中
        if (is) {
          if (that.loadingIndex === undefined) {
            that.loadingNum = 1
            that.loadingIndex = app.open({
              //打开弹窗
              slot: 'loading',
              yesBtn: false,
              escBtn: false,
              skin: 'loading'
            })
          } else that.loadingNum++ //已经打开，只做满屏弹窗计数
        } else if (that.loadingIndex !== undefined) {
          //关闭弹窗
          that.loadingNum-- //扣除计数
          if (that.loadingNum <= 0) {
            //最终关闭
            app.openEsc(that.loadingIndex)
            that.loadingIndex = undefined
          }
        }
      },
      fullLoading(is = true) {
        //满屏加载中,整个页面只能会出现一个加载中
        if (is) {
          if (that.fullLoadIndex === undefined) {
            that.fullLoadNum = 1
            that.fullLoadIndex = app.open({
              //打开弹窗
              slot: 'fullLoading',
              yesBtn: false,
              escBtn: false,
              skin: 'fullLoading'
            })
          } else that.fullLoadNum++ //已经打开，只做满屏弹窗计数
        } else if (that.fullLoadIndex !== undefined) {
          //关闭弹窗
          that.fullLoadNum-- //扣除计数
          if (that.fullLoadNum <= 0) {
            //最终关闭
            app.openEsc(that.fullLoadIndex)
            that.fullLoadIndex = undefined
          }
        }
      },
      msg(text = '', data = {}) {
        if (that.appMsgIndex !== undefined) app.openEsc(that.appMsgIndex) //关闭之前的消息

        let d = {
          skin: 'msg',
          content: text,
          title: false,
          btn: false,
          shade: false,
          autoEsc: 3000, //3秒自动关闭
          align: 't', //顶部弹出
          style: {}
        }
        if (!data.align) {
          uni.getSystemInfo({
            success(res) {
              let rem = res.screenWidth / 750, //相对比例
                top = res.windowHeight - res.windowHeight //负值顶部高度

              d.style['margin-top'] = 100 + top / rem + 'px'
            }
          })
        }
        app.jsonPush(d, data)

        return (that.appMsgIndex = app.open(d))
      },
      confirm(data = {}) {
        data.skin = data.skin ? data.skin + ' confirm' : 'confirm'
        return app.open(data)
      },
      again(
        data = {
          arg,
          rev,
          err
        }
      ) {
        //加载出错重试,arg为原始请求参数
        if (!that.againList) that.againList = []

        that.againList.push(data) //加入堆载

        if (that.againList.length == 1) {
          return app.open({
            slot: 'again',
            content: '加载出错了，重新加载吧',
            skin: 'full again',
            yes() {
              app.each(that.againList, (d, index) => {
                //发起全部错误请求
                app.request(d.arg).then(d.rev).catch(d.err) //重新发出请求
              })
              that.againList = [] //清空错误堆载
            },
            yesBtn: '重新加载',
            escBtn: false
          })
        }
      },
      fullMsg(data = {}) {
        //加载出错重试,arg为原始请求参数
        return app.open(
          this.jsonPush(
            {
              slot: 'again',
              skin: 'full again',
              yesBtn: '确定',
              escBtn: false
            },
            data
          )
        )
      },
      open(data) {
        //全局弹窗，加入字段field:{}为表单弹窗
        if (!that.publicData) {
          console.log(
            '请在data中设置公用数据publicData:this.app.getPublicData()，并引入<app-public :data="publicData"></app-public>组件'
          )
          return false
        }
        let openList = that.publicData.openList
        // console.log('openList', openList);
        // console.log('cacheData', cacheData);
        let index = openList.length

        data.autoEsc &&
          setTimeout(function () {
            //自动关闭
            app.openEsc(index)
          }, data.autoEsc)

        //标记为弹窗打开
        data.isOpenType = true

        //宽高单位计算
        data.width = app.unit(data.width)
        data.height = app.unit(data.height)
        data.maxheight = data.maxheight ? app.unit(data.maxheight) : '90%'
        data.content = data.content ? data.content.toString() : data.content

        //加入公共事件
        app.jsonPush(data, this.VueMethods)

        if (data.isOpen === false) return data //不打开弹窗，只获取弹窗数据

        if (typeof data.data == 'function') {
          //表单回填数据为函数事件
          let funData = data.data()
          if (typeof funData.then == 'function') {
            //异步函数请求Promise
            funData.then((funData) => {
              data.data = funData //使用异步回调数据
              app.vue.openList.push(data) //打开弹窗
            })
            return index
          } else data.data = funData //使用事件执行回调的数据
        }

        if (data.data) {
          //数据回填
          if (data.data._id)
            data.field._id = {
              //默认添加ID，并且隐藏
              type: 'hidden'
            }
          data.field = form.formData({
            field: data.field,
            data: data.data,
            backFill: true
          }).fieldVal //数据回填
        }

        if (!data.style) data.style = {}
        switch (data.align) {
          case 't':
            data.style = app.jsonPush(
              {
                'margin-top': '50rpx'
              },
              data.style
            )
            break
        }

        let openId = app.addId('open') //open数据标记
        data.openId = openId
        cacheData[openId] = data //存储原始数据（出入组件事件会被删除，这里可以存储事件）

        openList.push(data) //打开弹窗
        return index
      },
      openEsc(index = false) {
        //弹窗关闭
        let openList = that.publicData.openList
        if (index === false) {
          //关闭全部
          for (let x in openList) {
            let th = openList[x]
            if (th.esc && th.esc(th.vue) === false) return false //弹窗关闭失败
            app.openEsc(x) //关闭单个
          }
        } else {
          //关闭单个,单个关闭不验证合法性
          index = parseInt(index)

          let data = openList[index]
          if (!data) return false

          if (data === false || data.show === false) return true //已经被关闭

          that.$set(data, 'show', false) //隐藏弹窗动画
          setTimeout(function () {
            that.$set(openList, index, false) // 移除
            delete cacheData[data.openId] // cacheData保存每一次的弹窗数据  弹窗关闭 则弹窗数据也应该关闭
          }, 400)
        }
        return true
      },
      addId(prefix) {
        //获取当前唯一增量id，只为了关联使用
        if (prefix === undefined) prefix = 'addid'

        if (!cacheData.addId) cacheData.addId = {}
        if (!cacheData.addId[prefix]) {
          cacheData.addId[prefix] = 1
        } else {
          cacheData.addId[prefix]++
        }

        return prefix + cacheData.addId[prefix]
      },
      onlyValue(str, floor = false) {
        //获取唯一值，当前自增量加时间戳加随机数
        if (str == undefined) str = 'only'
        return (
          this.addId(str) +
          parseInt(new Date().getTime() / 1000) +
          (floor ? Math.floor(Math.random() * 100000) : '')
        )
      },
      copyJson(json) {
        //深度拷贝json
        // return JSON.parse(JSON.stringify(json));//粗暴无效率

        //递归拷贝
        let newJson
        if (typeof json == 'object') {
          if (typeof json.concat == 'function') newJson = []
          //数组
          else newJson = {} //json
        } else return json

        app.each(json, (t, i) => {
          newJson[i] = app.copyJson(t) //执行递归
        })
        return newJson
      },
      each(list, fun) {
        //遍历
        for (let x in list) if (fun(list[x], x) === false) return false
      },
      setMpOn(onName, fun) {
        //设置当前页面小程序监听事件，如（onLoad\onShow\onHide\onUnload等）；
        let on = that.$mp.page[onName]
        that.$mp.page[onName] = (e) => {
          on && on(e)
          fun(e)
        }
      },
      timeSub({ endTime, format = false, duration, every }) {
        //倒计时，endTime设置结束时间、duration设置时长（秒），两者只能选一
        let end = endTime
          ? endTime.getTime()
          : new Date().getTime() + duration * 1000 //获取结束时间戳
        {
        }
        if (!end) {
          console.log('请传入正确的endTime时间格式')
          return new Promise((rev, err) => {})
        }

        if (!that.timeSubList) that.timeSubList = []

        //计时器，为避免性能问题，当前页面只出现一次计时器
        if (that.timeSubIndex === undefined) {
          app.setMpOn('onUnload', function () {
            //页面关闭后停止执行计时器
            clearInterval(that.timeSubIndex)
            that.timeSubIndex = undefined
          })

          that.timeSubIndex = setInterval(function () {
            let newTime = new Date().getTime(),
              isEnd = true //当前时间戳

            that.timeSubList.forEach((d, index) => {
              //遍历所有倒计时
              if (d.isEnd) return
              else isEnd = false

              let long = parseInt((d.end - newTime) / 1000),
                time = {} //剩余时长 秒

              if (long <= 0) {
                //结束倒计时
                time.s = time.m = time.h = format ? '00' : 0
                d.every(time)
                d.rev(time)
                d.isEnd = true //标记结束
              } else {
                ;(time.s = long % 60), //秒
                  (time.m = parseInt(long / 60) % 60), //分
                  (time.h = parseInt(long / (60 * 60))) //小时，超过24小时也按小时算

                if (format) {
                  time.s = time.s < 10 ? '0' + time.s : time.s
                  time.m = time.m < 10 ? '0' + time.m : time.m
                  time.h = time.h < 10 ? '0' + time.h : time.h
                }
                d.every(time)
              }
            })

            if (isEnd) {
              //全部倒计时结束，结束计时器
              clearInterval(that.timeSubIndex)
              that.timeSubIndex = undefined
            }
          }, 1000)
        }

        return new Promise((rev, err) => {
          //加入回调堆载中
          that.timeSubList.push({
            end,
            rev,
            err,
            every
          })
        })
      },
      jsonPush(j1, j2) {
        //json相加
        app.each(j2, function (t, n) {
          j1[n] = t
        })
        return j1
      },
      back(num = 1, url = '/pages/home/home') {
        //后退页面
        if (typeof num == 'object') num = 1
        uni.navigateBack({
          delta: num
        })
        // console.log(getCurrentPages().length)
        if (getCurrentPages().length === 1) {
          //返回失败,一般已经是最后一层，则跳转到首页
          uni.switchTab({
            url: url
          })
        }
      },
      // 剪切板全局弹窗
      productSearch() {
        uni.getClipboardData({
          success: function (res1) {
            // uni.hideToast()
            Vue.prototype.$cli = false
            if (
              res1.data &&
              res1.data != ' ' &&
              res1.data != uni.getStorageSync('searchText')
            ) {
              uni.setStorageSync('searchText', res1.data)
              const textInfo = { text: res1.data }
              that.app
                .request({
                  api: 'convertTextToGoods',
                  type: 'GET',
                  data: textInfo
                })
                .then((res2) => {
                  if (res2.data.message === '成功') {
                    const goods = res2.data.data.goodsList[0].goods
                    const coupon = goods.hasCoupon ? goods.couponInfo.price : 0
                    const save =
                      goods.cpsType.code === 'wph' ||
                      goods.cpsType.code === 'kl'
                        ? goods.save
                        : coupon
                    app.open({
                      imageUrl: goods.imageUrl,
                      name: goods.name,
                      coupon: save,
                      normalCommission: goods.normalCommission,
                      price: goods.price,
                      slot: 'intellectSearch',
                      skin: 'intellectSearch',
                      escBtn: false,
                      yesBtn: false,
                      // backEsc: true,
                      methods: {
                        goDetail() {
                          uni.navigateTo({
                            url: `/pagesGoods/detail/detail?id=${goods.id}&type=${goods.cpsType.code}`
                          })
                          uni.setClipboardData({
                            data: ' ',
                            success: function () {
                              uni.hideToast()
                              // that.app.msg('成功')
                            }
                          })
                          uni.removeStorageSync('searchText')
                          app.openEsc()
                        },
                        discount() {
                          app.openEsc()
                          const apiName =
                            'genByGoodsId' + goods.cpsType.code.toUpperCase()
                          const data = { goodsId: goods.id }
                          if (
                            goods.cpsType.code === 'jd' ||
                            goods.cpsType.code === 'sn'
                          ) {
                            if (goods.couponInfo) {
                              data.link = encodeURIComponent(
                                goods.couponInfo.link
                              )
                            }
                          }
                          if (goods.cpsType.code === 'pdd') {
                            data.needAuth = true
                          } else {
                            data.needAuth = false
                          }
                          that.app
                            .request({
                              url: that.app.api[apiName],
                              type: 'GET',
                              data: data
                            })
                            .then((res) => {
                              uni.navigateToMiniProgram({
                                appId: res.data.data.wechatApp.appId,
                                path: res.data.data.wechatApp.path,
                                success(res) {
                                  console.log('成功')
                                }
                              })
                            })
                            .catch((err) => {
                              // reject(err)
                              console.log(err)
                              if (err.data.code === 601) {
                                app.open({
                                  slot: 'pddAuthorize',
                                  skin: 'pddAuthorize',
                                  backEsc: true,
                                  escBtn: false,
                                  yesBtn: false,
                                  methods: {
                                    goAuthorize() {
                                      app.openEsc()
                                      uni.navigateToMiniProgram({
                                        appId: err.data.data.wechatApp.appId,
                                        path: err.data.data.wechatApp.path,
                                        success(res) {
                                          console.log('成功')
                                        }
                                      })
                                    }
                                  }
                                })
                              }
                            })
                          uni.setClipboardData({
                            data: ' ',
                            success: function () {
                              uni.hideToast()
                              // that.app.msg('成功')
                            }
                          })
                          uni.removeStorageSync('searchText')
                        },
                        close() {
                          uni.setStorageSync('searchText', res1.data)
                          // cacheData.text = res1.data
                          app.openEsc()
                        }
                      }
                    })
                  } else {
                    uni.setStorageSync('searchText', res1.data)
                    app.open({
                      slot: 'productSearch',
                      skin: 'productSearch',
                      escBtn: false,
                      yesBtn: false,
                      text: res1.data,
                      // backEsc: true,
                      methods: {
                        search(data, index, idx) {
                          switch (idx) {
                            case 0:
                              uni.navigateTo({
                                url: `../../pagesGoods/searchDetail/searchDetail?type=pdd&keyWord=${res1.data}`
                              })
                              break
                            case 1:
                              uni.navigateTo({
                                url: `../../pagesGoods/searchDetail/searchDetail?type=jd&keyWord=${res1.data}`
                              })
                              break
                            case 2:
                              uni.navigateTo({
                                url: `../../pagesGoods/searchDetail/searchDetail?type=wph&keyWord=${res1.data}`
                              })
                              break
                            case 3:
                              uni.navigateTo({
                                url: `../../pagesGoods/searchDetail/searchDetail?type=sn&keyWord=${res1.data}`
                              })
                              break
                          }
                          app.openEsc()
                          uni.setClipboardData({
                            data: ' ',
                            success: function () {
                              uni.hideToast()
                              // that.app.msg('成功')
                            }
                          })
                          uni.removeStorageSync('searchText')
                        },
                        close() {
                          uni.setStorageSync('searchText', res1.data)
                          // cacheData.text = res1.data
                          app.openEsc()
                        }
                      }
                    })
                  }
                })
                .catch((err) => {})
            }
          }
        })
      }
    }
    return app
  }
})

// canvas 绘制图形
import canvas from './commons/functions/canvas.js'
// 格式化为小程序通用形式的富文本
import formatRich from './commons/functions/formatRich.js'
// 获取授权、验证
import authorize from './commons/functions/authorize.js'
// 检测更新小程序版本
import updateManager from './commons/functions/updateManager.js'

const $app = { canvas, formatRich, authorize, updateManager }

Vue.prototype.$app = $app

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

new Vue({
  store,
  ...App
}).$mount()
