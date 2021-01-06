<!--
<script>

this.app//为全局公共接口

//open全局弹窗使用
this.app.open({
    title:'标题，不传默认无标题',
    content:'内容，不传默认无，不可传入html代码，小程序限制',
    slot:'使用对应html模板',
    yes(){return false},//点击确定事件,返回false则弹窗不关闭
    esc(){},//点击取消事件，同yes事件
    yesBtn:'确定吧',//修改确定按钮名称，false则不显示确定按钮
    escBtn:'取消吧',//同确定按钮修改一致
    backEsc:false,//点击背景是否可以关闭弹窗，默认false
    titleEsc:false,//显示标题右边关闭按钮，默认不显示
    autoEsc:2000,//代表2000好秒后自动关闭，默认不自动关闭
    skin:'class名称',//自定义样式名-皮肤（公用皮肤有：shadeFalse不显示黑色背景、full铺满整个屏幕）
    style:{'margin-top':'100rpx'},//弹窗样式设置，同css样式一致
    align:'t',//位置设置为出现在顶部
    methods:{事件一(){}},//自定义事件，对应slot模板 @click="slot(index,'事件一')"
});

//加载中
this.app.loading()//打开加载中
this.app.loading(false)//关闭加载中

//全屏加载中
this.app.fullLoading()//打开加载中
this.app.fullLoading(false)//关闭加载中

//消息弹窗
this.app.msg('加载出错了',{/*对应open中的参数,可以不写*/});

//询问弹窗
this.app.confirm({
    content:'确定删除记录？',
    yes(){/*执行确定事件*/}
})

弹窗均返回错误id，如
let openId=this.app.open({});
this.app.openEsc(openId);//关闭指定弹窗
this.app.openEsc();//关闭全部弹窗

</script>
-->
<!-- 全局弹窗模板 -->
<template>
  <view>
    <app-open v-for="(t,index) in data.openList" :key="index" :data='t' :index='index'>

      <view v-if="t">
        <!-- 加载中提示 -->
        <view v-if="t.slot=='loading'">
          <view class="loading">
            <view>
              <!-- <view class="i"></view>
              <view class="i"></view>
              <view class="i"></view> -->
              <image class="loadong-img" src="../static/loading.gif" mode='widthFix'></image>
            </view>
          </view>
        </view>

        <!-- 满屏加载中提示 -->
        <view v-else-if="t.slot=='fullLoading'">
          <view class="loading full">
            <view>
              <!-- <view class="i"></view>
              <view class="i"></view>
              <view class="i"></view> -->
              <image class="loadong-img" src="../static/loading.gif" mode='widthFix'></image>
            </view>
          </view>
        </view>

        <!-- 加载出错重新加载 -->
        <view v-else-if="t.slot=='again'" class="againCon" @click="yes">
          <view class='iconbiaoqing smile'>
            <view class="d"></view>
          </view>
          <view>{{t.content}}</view>
        </view>

        <!-- 分享底部弹窗 -->
        <view v-else-if="t.slot=='shareBottom'" class="flex">
          <button class="li av" open-type="share">
            <icon class="svg-py"></icon>
            <text>分享给朋友</text>
          </button>
          <view class="li av" @click="slot(index,'pyq')">
            <icon class="svg-pyq"></icon>
            <text>分享到朋友圈</text>
          </view>
        </view>

        <!-- 分享到朋友圈 -->
        <view v-else-if="t.slot=='sharePyq'" @touchmove.stop="true" @mousemove.stop="true">
          <view class="close-box" @click="app.openEsc()">
            <icon class="iconfont iconclose ic-close"></icon>
          </view>
          <view class="img">
            <image :src="t.imgUrl" mode="widthFix"></image>
          </view>
          <view class="btn save" @click="slot(index,'saveImg')">保存图片</view>
          <!-- <text>保存图片后，您可分享该商品图片到朋友圈</text> -->
        </view>

        <!-- 提醒用户弹窗 -->
        <view v-else-if="t.slot=='point'">
          <text class="title">{{t.title1}}\n{{t.title2}}</text>
          <image src="static/logo-user.png" />
          <text class="note">注意：如果没有呆萌价App软件，请到应用市场/App Store下载安装哦。</text>
        </view>

        <!-- 用户下载app提示 -->
        <view v-else-if="t.slot=='download'">
          <image class="logo" src="static/logo-user.png" />
          <image class="gif-img" src="static/download.gif" />
          <button class="download-btn" :session-from="'weapp|nickName='+userInfo.nickName+'|avatarUrl='+userInfo.avatarUrl" open-type="contact" @click="app.openEsc()">立即前往</button>
          <view class="close-box" @click="app.openEsc()">
            <icon class="iconfont iconshut ic-shut"></icon>
          </view>
        </view>

        <!-- 商品搜索弹窗 -->
        <view v-else-if="t.slot=='productSearch'">
          <view class="title">搜索以下商品优惠券</view>
          <view class="text">{{t.text}}</view>
          <view class="logo-wrapper">
            <view class="logo" v-for="(item,idx) in searchList" :key="idx" @click="slot(index,'search',idx)">
              <image class="logo-img" :src="item" />
            </view>
          </view>
          <view class="close-box" @click="slot(index,'close')">
            <icon class="iconfont iconshut ic-shut"></icon>
          </view>
        </view>

        <!-- 智能搜索优惠券 -->
        <view v-else-if="t.slot=='intellectSearch'">
          <view class="goods">
            <image class="goods-img" :src="t.imageUrl" />
            <view class="goods-info">
              <view class="goods-name">{{t.name}}</view>
              <view class="coupon-info">
                <view class="coupon">{{t.coupon}}</view>
                <view class="prize">补贴￥{{t.normalCommission}}</view>
              </view>
              <view class="price">券后<text class="sign">¥</text><text class="num">{{t.price}}</text></view>
            </view>
          </view>
          <view class="btn-wrapper">
            <view class="btn1" @click="slot(index,'goDetail')">查看商品</view>
            <view class="btn2" @click="slot(index,'discount')">立即购买</view>
          </view>
          <view class="close-box" @click="slot(index,'close')">
            <icon class="iconfont iconshut ic-shut"></icon>
          </view>
        </view>

        <!-- 拼多多授权框 -->
        <view v-else-if="t.slot=='pddAuthorize'">
          <view class="title">申请拼多多授权</view>
          <view class="logo-wrapper">
            <image class="logo" :src="authorize.DMJLOGO" />
            <image class="arrow" :src="authorize.ARROW" />
            <image class="logo" :src="authorize.PDDLOGO" />
          </view>
          <view class="desc">拼多多账号授权后，自己下单和分享商品都能获得佣金哦！</view>
          <view class="authorize-btn" @click="slot(index,'goAuthorize')">前往拼多多授权</view>
        </view>

        <!-- 低佣提醒弹窗 -->
        <view v-else-if="t.slot=='warning'">
          <image class="logo" :src="authorize.WARN" />
          <view class="title">该商品有低佣风险</view>
          <view class="advise">建议先收藏，10分钟后再下单</view>
          <view class="desc"> 本提示已拼多多比价订单调整新规相关，如规避低佣风险。具体详见<text @click="slot(index,'goRule')">《拼多多新规说明》</text></view>
          <view class="btn" @click="app.openEsc()">我知道了</view>
        </view>

        <!-- 提醒功能暂时未开放弹窗 -->
        <view v-else-if="t.slot=='warn'">
          <image src="static/logo-user.png" />
        </view>

      </view>

    </app-open>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { logoPopup, authorize } from '../config/imgUrl'
export default {
  computed: mapState(['userInfo']),
  data() {
    return {
      searchList: [
        logoPopup.PDDPOPUP,
        logoPopup.JDPOPUP,
        logoPopup.WPHPOPUP,
        logoPopup.SNPOPUP
      ],
      authorize: authorize
    }
  },
  updated() {},
  methods: {
    slot(index, funName, data = {}) {
      //open slot事件调用
      let openData = this.data.openList[index], //获取弹窗数据
        sourceData = this.app.cacheData[openData.openId], //获取弹窗原始数据
        fun = sourceData.methods[funName] //获取要执行的函数

      if (!fun) {
        console.log(
          '无' + funName + '事件，请在open methods:{}中添加',
          openData
        )
      } else {
        fun(openData, index, data) //执行
      }
    }
  },
  props: ['data']
}
</script>