/*存放需要渲染的图片的图片地址*/
export const BASE_IMG_URL =
  'https://dmjvip.oss-cn-shenzhen.aliyuncs.com/dmj/micro'

// export const BASE_IMG_URL_2 = '../static/order'

// 个人中心的相关图片
export const USER_IMG = `${BASE_IMG_URL}/userIcon/stripe.png` // 个人中心背景条纹图片

// 默认头像
export const DEFAULT_AVATOR = `${BASE_IMG_URL}/dai.png`

// 等级的相关图片
export const grade = {
  MEMBER: `${BASE_IMG_URL}/userIcon/huiyuan.png`, // VIP会员
  OWNER: `${BASE_IMG_URL}/userIcon/dianzhu.png`, // 店主
  PARTNER: `${BASE_IMG_URL}/userIcon/hehuoren.png`, // 合伙人
  OPERATOR: `${BASE_IMG_URL}/userIcon/yunyingshang.png` // 运营商
}

// 等级的相关图片
export const step = {
  STEP1: `${BASE_IMG_URL}/index/step1.png`, //步骤1
  STEP2: `${BASE_IMG_URL}/index/step2.png`, //步骤2
  STEP3: `${BASE_IMG_URL}/index/step3.png` //步骤3
}

// 分享好友图片
export const SHARE_IMG = `${BASE_IMG_URL}/images/bg_share_home.png`

// 我的订单各平台logo
export const logoOrder = {
  JDICON: `${BASE_IMG_URL}/order/jdIcon.png`, // 京东
  KLICON: `${BASE_IMG_URL}/order/klIcon.png`, // 考拉
  PDDICON: `${BASE_IMG_URL}/order/pddIcon.png`, // 拼多多
  SNICON: `${BASE_IMG_URL}/order/snIocn.png`, // 苏宁
  WPHICON: `${BASE_IMG_URL}/order/wphIcon.png` // 唯品会
}

export const CLEAN = `${BASE_IMG_URL}/search/clean.png`

// 弹窗各平台logo
export const logoPopup = {
  JDPOPUP: `${BASE_IMG_URL}/popup/popup-jd.png`, // 京东
  PDDPOPUP: `${BASE_IMG_URL}/popup/popup-pdd.png`, // 拼多多
  SNPOPUP: `${BASE_IMG_URL}/popup/popup-sn.png`, // 苏宁
  WPHPOPUP: `${BASE_IMG_URL}/popup/popup-wph.png` // 唯品会
}

// 拼多多授权、比价商品弹窗
export const authorize = {
  DMJLOGO: `${BASE_IMG_URL}/authorize/dmj-logo.png`, // 呆萌价图标
  PDDLOGO: `${BASE_IMG_URL}/authorize/pdd-logo.png`, // 拼多多图标
  ARROW: `${BASE_IMG_URL}/authorize/arrow.png`, // 箭头
  WARN: `${BASE_IMG_URL}/authorize/warn.png` // 警告
}
