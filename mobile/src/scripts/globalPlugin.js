/**
 * Created by user on 17/6/8.
 */
// import Vue from 'vue'
import router from '@/router'
import qs from 'qs'
import store from '../vuex'
import { Toast, Indicator, InfiniteScroll } from 'mint-ui'
var constConfig = require('config/constConfig')     // 获取全局常量配置

export default {
  install (Vue) {
    /**
     * 为跨域请求提供凭据, 参考文档如下
     * http://wiki.95071222.net/pages/viewpage.action?pageId=7438668
     */
    Vue.axios.defaults.withCredentials = true;
    // 注册全局组件
    Vue.use(InfiniteScroll)
    // 注册全局方法
    Vue.prototype.$Toast = Toast
    Vue.prototype.$Indicator = Indicator
    // 设置全局请求拦截器
    // 如果response的code是400401, 则跳到登录页面
    Vue.axios.interceptors.response.use(
      function (response) {
        if (response.data.code === 401) {
          store.commit('loginout')
        } else if (response.data.code && response.data.code !== 200) {
          let errorInfo = {
            title: '请求错误',
            desc: '原因未知'
          }
          errorInfo.title = response.data.name ||
            response.data.code ||
            response.data.status_code
          errorInfo.desc = response.data.message ||
            response.data.msg
          console.log(errorInfo)
          // Vue.prototype.$Notice.error(errorInfo)
        }
        return response
      },
      function (error) {
        // debugger
        if ((error.response && error.response.data && error.response.data.code === 401001) ||
          (error.response && error.response.data && error.response.data.status_code === 4000)) {
          // const oldUrl = window.location.href;
          // eslint-disable-next-line no-undef
          // window.location.href = apiLoginURL + oldUrl;
          router.push('/')
        } else {
          let errorInfo = {
            title: '请求错误',
            desc: '原因未知'
          }
          if (error.response) {
            errorInfo.title = error.response.data.name ||
              error.response.data.code ||
              error.response.data.status_code
            errorInfo.desc = error.response.data.message ||
              error.response.data.msg
          }
          // Vue.prototype.$Notice.error(errorInfo)
        }
      }
    );
    // 刚进入项目就发请求拉取用户信息
    // eslint-disable-next-line no-undef
    Vue.axios.get(apiGetUser)
      .then(function (response) {
        if (response && response.data.code === 200) {
          store.commit('login', response.data.data)
          Vue.prototype.$loginUser = response.data.data
        }
        store.commit('finishedGetUser')
      })
    // 加载进度条开始
    router.beforeEach((to, from, next) => {
      next()
    })
    // 加载进度条结束
    router.afterEach((to, from, next) => {
    })
    /**
     * 封装页面跳转，使之更为简洁易用
     * @param page 目标页面ID
     * @param params 需要传递到目标页面的参数
     */
    Vue.prototype.$load = function loadPage (page, params) {
      let url = this.$route.path.substr(0, this.$route.path.lastIndexOf('/') + 1) + page
      router.push({path: url, query: params || {}})
    };
    /**
     * A querystring parsing and stringifying library with some added security.
     */
    Vue.prototype.$qs = qs;
    /**
     * 将字典表挂载到全局， 可以用this.$SysCode[codeGroup]访问，
     * 使用this.$SysCode.translate(value, codeGroup)来转义字段
     */
    // eslint-disable-next-line wrap-iife
    Vue.prototype.$SysCode = function () {
      // 遍历状态码，计算并返回最终可用的数组
      for (let codeName in constConfig.SysCode) {
        // 如果是数组，则不用处理
        if (codeName === '__globalConfig') {
        } else if (constConfig.SysCode[codeName].constructor === String) {
          // 如果不是dev环境, 以TEST_开头的状态码不予处理
          if (process.env.NODE_ENV !== 'development' && codeName.startsWith('MOCK_')) {
            continue
          }
          // 如果是字符串，则当作url去处理
          let config = Object.assign(
            {},
            constConfig.SysCode.__globalConfig,
            {url: constConfig.SysCode[codeName]}
          )
          // 封装ajax配置对象
          let ajaxConfig = {}
          ajaxConfig.url = config.url
          ajaxConfig.method = config.actionType || 'get'
          if ('putpostpatch'.indexOf(config.actionType) !== -1) {
            // 如果是put,post,patch
            ajaxConfig.data = config.params || {}
          } else {
            // 如果不是put,post,patch
            ajaxConfig.params = config.params || {}
            ajaxConfig.paramsSerializer = function (params) {
              return qs.stringify(params)
            }
          }
          Vue.axios(ajaxConfig)
            .then(function (response) {
              let arr = config.responseConfig.data ? response.data[config.responseConfig.data] : response.data
              let result = []
              arr.forEach(function (item) {
                result.push({
                  value: item[config.responseConfig.value || 'value'],
                  label: item[config.responseConfig.label || 'label']
                })
              })
              constConfig.SysCode[codeName] = result
            })
            .catch(function (e) {
              console.log(`状态码【${codeName}】请求失败：`)
              console.log(e)
            })
          // 先设置成下面的对象给控件传过去,这样的话,控件就知道它用的是哪一个状态码
          constConfig.SysCode[codeName] = {
            codeName: codeName
          }
        } else if (constConfig.SysCode[codeName].constructor === Object) {
          // 如果不是dev环境, 以TEST_开头的状态码不予处理
          if (process.env.NODE_ENV !== 'development' && codeName.startsWith('MOCK_')) {
            continue
          }
          // 如果配置的是对象，则按配置发请求拉取数据
          let config = Object.assign(
            {},
            constConfig.SysCode.__globalConfig,
            constConfig.SysCode[codeName]
          )
          // 封装ajax配置对象
          let ajaxConfig = {}
          ajaxConfig.url = config.url
          ajaxConfig.method = config.actionType || 'get'
          if ('putpostpatch'.indexOf(config.actionType) !== -1) {
            // 如果是put,post,patch
            ajaxConfig.data = config.params || {}
          } else {
            // 如果不是put,post,patch
            ajaxConfig.params = config.params || {}
            ajaxConfig.paramsSerializer = function (params) {
              return qs.stringify(params)
            }
          }
          Vue.axios(ajaxConfig)
            .then(function (response) {
              let arr = config.responseConfig.data ? response.data[config.responseConfig.data] : response.data
              let result = []
              arr.forEach(function (item) {
                result.push({
                  value: item[config.responseConfig.value || 'value'],
                  label: item[config.responseConfig.label || 'label']
                })
              })
              constConfig.SysCode[codeName] = result
            })
            .catch(function (e) {
              console.log(`状态码【${codeName}】请求失败：`)
              console.log(e)
            })
          // 先设置成下面的对象给控件传过去,这样的话,控件就知道它用的是哪一个状态码
          constConfig.SysCode[codeName] = {
            codeName: codeName
          }
        } else if (constConfig.SysCode[codeName].constructor === Function) {
          // 如果配置的是字符串，则执行并使用其返回值
          constConfig.SysCode[codeName] = constConfig.SysCode[codeName]()
        }
      }
      constConfig.SysCode.translate = function (value, codeName) {
        let obj = this[codeName].filter(function (item) {
          return item.value === value
        })[0]
        return obj && obj.label
      }
      return constConfig.SysCode
    }()

    /**
     * 简化列表操作按钮
     * @param h createElement
     * @param params 行参数
     * @param btns  操作按钮数组
     * @returns {*}
     */
    Vue.prototype.$getListOperationBtns = function (h, params, btns) {
      let buttons = [];
      btns.forEach(btn => {
        buttons.push(h('Button', {
          props: {
            type: btn.type || 'primary',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              btn.handler(params)
            }
          }
        }, btn.label))
      })
      return h('div', buttons)
    }
  }
}
