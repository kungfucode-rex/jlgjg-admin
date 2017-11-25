// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/vuex'
import iView from 'iview'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import axios from 'axios'
import VueAxios from 'vue-axios'
import AMap from 'vue-amap'
import GlobalPlugin from '@/scripts/globalPlugin'
import VueQuillEditor from 'vue-quill-editor'
// 导入全局样式
import 'normalize.css'
import 'iview/dist/styles/iview.css'
import '../plugins/kalendae/kalendae.css'
import 'font-awesome/css/font-awesome.min.css'
require('../plugins/kalendae/kalendae.min')

Vue.config.productionTip = true
Vue.use(iView)
Vue.use(VueMomentJS, moment)
Vue.use(VueAxios, axios)
Vue.use(GlobalPlugin, Vue)
Vue.use(AMap)
Vue.use(VueQuillEditor)
// moment 精确时间段插件
require('./scripts/x2-moment-precise-range')

// 初始化地图插件
AMap.initAMapApiLoader({
  key: '8dccda3b5cde082c52f3a5fb7325673f',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MouseTool']
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
