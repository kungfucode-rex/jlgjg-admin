// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/vuex'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import axios from 'axios'
import VueAxios from 'vue-axios'
import GlobalPlugin from '@/scripts/globalPlugin'
import Mint from 'mint-ui'
// 导入全局样式
import 'normalize.css'
import 'font-awesome/css/font-awesome.min.css'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = true
Vue.use(VueMomentJS, moment)
Vue.use(VueAxios, axios)
Vue.use(GlobalPlugin, Vue)
Vue.use(Mint)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
