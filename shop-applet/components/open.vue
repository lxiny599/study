<!-- 全局弹窗模板 -->
<template>
  <view
    :class="classStr"
    v-if="data"
  >
    <view
      class="openBack"
      @click="backEsc"
    ></view>
    <view
      class="openCon"
      :style="styleStr"
    >
      <view
        class="tit"
        v-if="data.title"
      >
        <view class="t">{{data.title}}</view>
        <view
          v-if="data.titleEsc"
          class="titleEsc av ic-guanbi-fill"
          @click="esc"
        ></view>
      </view>
      <view
        v-if="data.closeBtn"
        class="closeBtn av ic-guanbi-fill"
        @click="esc"
      ></view>
      <view
        class="appForm"
        v-if="data.type=='form'"
      >
        <app-form
          :field="data.field"
          :sourcename="''"
          :openvue="this"
        ></app-form>
      </view>
      <view
        v-else-if="data.slot"
        class="content"
      >
        <slot></slot>
      </view>
      <view
        v-else
        class="content"
        v-html="data.content"
      ></view>
      <view
        class="a"
        v-if="data.btn!==false"
      >
        <view class="c">
          <view
            class="btn yes"
            v-if="data.yesBtn!==false"
            @click="yes"
          >{{data.yesBtn||'确定'}}</view>
          <view
            class="btn not"
            v-if="data.escBtn!==false"
            @click="esc"
          >{{data.escBtn||'取消'}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
let dataFun
export default {
  data() {
    return {}
  },
  created(e) {
    //渲染数据前执行
    dataFun = this.app.cacheData[this.data.openId] //获取事件列表
  },
  methods: {
    getFormData({ data = {}, backFill = false, isDelNotSubmit = false } = {}) {
      //获取表单数据或者回填数据，backFill则回填数据,格式转换，仅保留name与val，isDelNotSubmit是否删除不提交数据
      return form.formData({
        field: this.data.field,
        data,
        backFill,
        isDelNotSubmit
      }).data
    },
    yes(e) {
      let that = this
      if (this.data.type == 'form') {
        //表单
        let formData = this.getFormData()
        if (
          formData == false || //提交验证未通过
          (this.data.beforeForm &&
            this.data.beforeForm(this, formData) == false) //提交前事件阻止提交
        )
          return false

        formData = this.getFormData({ isDelNotSubmit: true }) //过滤不提交数据

        this.app
          .request({
            url: this.data.antion,
            data: { formData },
            page: this.data.skin == 'page' ? true : false,
            type: 'post'
          })
          .then(function(d) {
            if (that.data.updateId !== false) {
              if (that.data.field._id === undefined) {
                if (!d.data._id) return console.log('新增记录后请返回_id')
                else
                  that.$set(that.data.field, '_id', {
                    type: 'hidden',
                    val: d.data._id
                  })
              }
            }
            end(that, formData, d)
          })
          .catch(function(d) {
            //只要请求出错，必须重置验证码
            that.errorForm && that.errorForm(that, d, formData)
            that.$el.querySelector('.codeImg').click() //提交出错，更新验证码
          })
      } else end(that)

      function end(that, formData, d) {
        //触发确定事件
        if (!dataFun.yes || dataFun.yes(that, formData, d) !== false) {
          that.app.openEsc(that.index)
          return true
        }
        return false
      }
    },
    esc(e) {
      //关闭弹窗
      if (!dataFun.esc || dataFun.esc(this) != false) {
        this.app.openEsc(this.index)
      }
    },
    backEsc(e) {
      if (this.data.backEsc) {
        this.esc(e)
      }
    },
    change(info) {
      //改变事件
      dataFun.change && dataFun.change(info)
    }
  },
  computed: {
    classStr() {
      let data = this.data
      return `appOpen ${data.move === false ? 'notMove' : ''} ${
        data.shade == false ? 'shadeFalse' : ''
      } ${data.skin} ${data.event} ${data.show}`
    },
    styleStr() {
      let str = '',
        data = this.data
      this.app.each(this.data.style, function(val, name) {
        str += name + ':' + val + ';'
      })

      str = `width:${data.width};height:${data.height};max-height:${
        data.maxheight
      };transform:translate3d(${data.tx || 0}px,${data.ty || 0}px,0) ${
        data.show == false ? 'scale(1.1)' : ''
      };${str}`

      return str
    }
  },
  // mounted(){
  //     this.data.vue=this;//保存实例
  //     this.data.success&&this.data.success(this);
  // },
  props: ['data', 'index']
}
</script>