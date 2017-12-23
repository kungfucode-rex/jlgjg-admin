
import Vue from 'vue'
import Router from 'vue-router'
import autoRoutes from './autoRoutes'
// import customRoutes from './customRoutes'
Vue.use(Router)
export default new Router({
  routes: [
    // ...customRoutes,
    ...autoRoutes
  ]
})
