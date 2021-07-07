import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import create from './assets/js/create.js'

import globalVariable from './api/global_variable.js'
import globalFunc from './api/global_func.js'

Vue.prototype.$create = create

Vue.prototype.GLOBAL = globalVariable

Vue.prototype.globalFunc_one = () => alert('11111')

Vue.prototype.globalFunc_tow = function() {
  return alert('22222')
}

Vue.use(globalFunc)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
