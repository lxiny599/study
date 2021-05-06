import uniApiRoot from './uniApiRoot'

var UniApiRoot = uniApiRoot.UniApiRoot

module.exports = {
  userCenterData: UniApiRoot + 'user/center/data', // 个人中心用户数据
  AuthLoginByWeixin: UniApiRoot + 'login', // 微信登陆

  wxaGetImage: UniApiRoot + 'wxa/getImage', // cps小程序码
  downloadImage: UniApiRoot + 'wxa/downloadImage', // 下载小程序码

  // CpsAdvInitMain: UniApiRoot + 'cps/business/adv/initMain', // 首页
  homePageAdv: UniApiRoot + 'cps/business/adv/homePageAdv', // 首页
  advList: UniApiRoot + 'cps/business/adv/list', // 广告列表
  CpsUserGetProfitViewInfo: UniApiRoot + 'cps/user/getProfitViewInfo', // 获取收益总览信息
  CpsUserGetProfitCpsInfo: UniApiRoot + 'cps/user/getProfitCpsInfo?cpsType=', // 收益明细信息
  CpsAdvList: UniApiRoot + 'cps/business/adv/list', // CPS广告
  getCpsGoodsFootprint: UniApiRoot + 'cps/user/getCpsGoodsFootprint', // 我的足迹
  getMyFansCount: UniApiRoot + 'cps/user/getMyFansCount', // 我的粉丝数量
  getMyTeamHistoryDetail: UniApiRoot + 'cps/user/getMyTeamHistoryDetail', // 我的粉丝列表
  getCpsGoodsCollect: UniApiRoot + '/cps/user/getCpsGoodsCollect', // 我的收藏
  delCpsGoodsCollect: UniApiRoot + '/cps/user/delCpsGoodsCollect', // 批量取消收藏
  inviteFans: UniApiRoot + 'cps/user/inviteFans', // 获取分享图
  getHelpList: UniApiRoot + 'cps/user/getHelpList', // 获取帮助中心列表
  getHelpListByProblemType: UniApiRoot + 'cps/user/getHelpListByProblemType', // 获取帮助中心问题列表
  getHelpDetail: UniApiRoot + 'cps/user/getHelpDetail', // 获取帮助中心问题详情
  insertFeedBack: UniApiRoot + 'cps/user/insertFeedBack', // 我的反馈
  convertTextToGoods: UniApiRoot + 'cps/goods/convert/convertTextToGoods', // 商品转链

  // 搜索页面
  fetchHotKeyWords: UniApiRoot + 'cps/business/app/getKeyWordList', // 获取商品热搜关键词

  channelJD: UniApiRoot + 'cps/business/jd/channel', // 京东频道商品查询
  getByGoodsIdJD: UniApiRoot + 'cps/business/jd/getByGoodsId', // 京东根据商品id查询
  queryGoodsJD: UniApiRoot + 'cps/business/jd/query', // 京东关键字商品搜索
  collectGoodsByIdJD: UniApiRoot + 'cps/business/jd/collectGoodsById', // 京东收藏商品
  unCollectGoodsByIdJD: UniApiRoot + 'cps/business/jd/unCollectGoodsById', // 京东取消收藏商品
  genByGoodsIdJD: UniApiRoot + 'cps/business/jd/genByGoodsId?genWechatApp=true', // 京东推广信息
  getSelfOrderListJD: UniApiRoot + 'cps/business/jd/getSelfOrderList', // 京东获取我的订单
  getTeamOrderListJD: UniApiRoot + 'cps/business/jd/getTeamOrderList', // 京东获取团队订单
  getCatListJD: UniApiRoot + 'cps/business/jd/getCatList', // 京东获取一级类目
  catJD: UniApiRoot + 'cps/business/jd/cat', // 京东类目商品查询
  genAdvUrlJD: UniApiRoot + 'cps/business/jd/genAdvUrl', // 京东广告图片链接处理
  themeJD: UniApiRoot + 'cps/business/jd/theme', //京东主题商品查询

  channelPDD: UniApiRoot + 'cps/business/pdd/channel', // 拼多多频道商品查询
  getByGoodsIdPDD: UniApiRoot + 'cps/business/pdd/getByGoodsId', // 拼多多根据商品id查询
  queryGoodsPDD: UniApiRoot + 'cps/business/pdd/query', // 拼多多关键字商品搜索
  collectGoodsByIdPDD: UniApiRoot + 'cps/business/pdd/collectGoodsById', // 拼多多收藏商品
  unCollectGoodsByIdPDD: UniApiRoot + 'cps/business/pdd/unCollectGoodsById', // 拼多多取消收藏商品
  genByGoodsIdPDD:
    UniApiRoot + 'cps/business/pdd/genByGoodsId?genWechatApp=true', // 拼多多推广信息
  getSelfOrderListPDD: UniApiRoot + 'cps/business/pdd/getSelfOrderList', // 拼多多获取我的订单
  getTeamOrderListPDD: UniApiRoot + 'cps/business/pdd/getTeamOrderList', // 拼多多获取团队订单
  getCatListPDD: UniApiRoot + 'cps/business/pdd/getCatList', // 拼多多获取一级类目
  catPDD: UniApiRoot + 'cps/business/pdd/cat', // 拼多多类目商品查询
  genAdvUrlPDD: UniApiRoot + 'cps/business/pdd/genAdvUrl', // 拼多多广告图片链接处理
  themePDD: UniApiRoot + 'cps/business/pdd/theme', // 拼多多主题商品查询
  genPDD:
    UniApiRoot +
    'cps/business/pdd/gen?clickValue=genRpUrl&genWechatApp=true&sysParam=10', // 拼多多推广信息

  channelWPH: UniApiRoot + 'cps/business/wph/channel', // 唯品会频道商品查询
  getByGoodsIdWPH: UniApiRoot + 'cps/business/wph/getByGoodsId', // 唯品会根据商品id查询
  queryGoodsWPH: UniApiRoot + 'cps/business/wph/query', // 唯品会关键字商品搜索
  collectGoodsByIdWPH: UniApiRoot + 'cps/business/wph/collectGoodsById', // 唯品会收藏商品
  unCollectGoodsByIdWPH: UniApiRoot + 'cps/business/wph/unCollectGoodsById', // 唯品会取消收藏商品
  genByGoodsIdWPH:
    UniApiRoot + 'cps/business/wph/genByGoodsId?genWechatApp=true', // 唯品会推广信息
  getSelfOrderListWPH: UniApiRoot + 'cps/business/wph/getSelfOrderList', // 唯品会获取我的订单
  getTeamOrderListWPH: UniApiRoot + 'cps/business/wph/getTeamOrderList', // 唯品会获取团队订单
  getCatListWPH: UniApiRoot + 'cps/business/wph/getCatList', // 唯品会获取一级类目
  catWPH: UniApiRoot + 'cps/business/wph/cat', // 唯品会类目商品查询
  genAdvUrlWPH: UniApiRoot + 'cps/business/wph/genAdvUrl', // 唯品会广告图片链接处理
  themeWPH: UniApiRoot + 'cps/business/wph/theme', // 唯品会主题商品查询

  channelKL: UniApiRoot + 'cps/business/kl/channel', // 考拉频道商品查询
  getByGoodsIdKL: UniApiRoot + 'cps/business/kl/getByGoodsId', // 考拉根据商品id查询
  queryGoodsKL: UniApiRoot + 'cps/business/kl/query', // 考拉关键字商品搜索
  collectGoodsByIdKL: UniApiRoot + 'cps/business/kl/collectGoodsById', // 考拉收藏商品
  unCollectGoodsByIdKL: UniApiRoot + 'cps/business/kl/unCollectGoodsById', // 考拉取消收藏商品
  genByGoodsIdKL: UniApiRoot + 'cps/business/kl/genByGoodsId?genWechatApp=true', // 考拉推广信息
  getSelfOrderListKL: UniApiRoot + 'cps/business/kl/getSelfOrderList', // 考拉获取我的订单
  getTeamOrderListKL: UniApiRoot + 'cps/business/kl/getTeamOrderList', // 考拉获取团队订单
  getCatListKL: UniApiRoot + 'cps/business/kl/getCatList', // 考拉获取一级类目
  catKL: UniApiRoot + 'cps/business/kl/cat', // 考拉类目商品查询
  genAdvUrlKL: UniApiRoot + 'cps/business/kl/genAdvUrl', // 考拉广告图片链接处理
  themeKL: UniApiRoot + 'cps/business/kl/theme', // 考拉主题商品查询

  channelSN: UniApiRoot + 'cps/business/sn/channel', // 苏宁频道商品查询
  getByGoodsIdSN: UniApiRoot + 'cps/business/sn/getByGoodsId', // 苏宁根据商品id查询
  queryGoodsSN: UniApiRoot + 'cps/business/sn/query', // 苏宁关键字商品搜索
  collectGoodsByIdSN: UniApiRoot + 'cps/business/sn/collectGoodsById', // 苏宁收藏商品
  unCollectGoodsByIdSN: UniApiRoot + 'cps/business/sn/unCollectGoodsById', // 苏宁取消收藏商品
  genByGoodsIdSN: UniApiRoot + 'cps/business/sn/genByGoodsId?genWechatApp=true', // 苏宁推广信息
  getSelfOrderListSN: UniApiRoot + 'cps/business/sn/getSelfOrderList', // 苏宁获取我的订单
  getTeamOrderListSN: UniApiRoot + 'cps/business/sn/getTeamOrderList', // 苏宁获取团队订单
  getCatListSN: UniApiRoot + 'cps/business/sn/getCatList', // 苏宁获取一级类目
  catSN: UniApiRoot + 'cps/business/sn/cat', // 苏宁类目商品查询
  genAdvUrlSN: UniApiRoot + 'cps/business/sn/genAdvUrl', // 苏宁广告图片链接处理
  themeSN: UniApiRoot + 'cps/business/sn/theme', // 苏宁主题商品查询

  genAdvUrlMT: UniApiRoot + 'cps/business/mt/genAdvUrl', // 美团广告图片链接处理
  getWechatAppMT: UniApiRoot + 'cps/business/mt/getWechatAppletInfo', // 美团外卖信息
  getSelfOrderListMT: UniApiRoot + 'cps/business/mt/getSelfOrderList', // 美团获取我的订单
  getTeamOrderListMT: UniApiRoot + 'cps/business/mt/getTeamOrderList', // 美团获取团队订单

  genAdvUrlEL: UniApiRoot + 'cps/business/el/genAdvUrl', // 饿了么广告图片链接处理
  getWechatAppEL: UniApiRoot + 'cps/business/el/getWechatAppletInfo', // 饿了么外卖信息
  getSelfOrderListEL: UniApiRoot + 'cps/business/el/getSelfOrderList', // 饿了么获取我的订单
  getTeamOrderListEL: UniApiRoot + 'cps/business/el/getTeamOrderList' // 饿了么获取团队订单
}
