<template>
  <div class="login-page">
    <Card style="width:350px">
      <div slot="title">
        <div class="login-logo"></div>
        <p class="login-title">龙哥测试项目</p>
      </div>
      <iInput v-model="username" autofocus size="large" style="margin-top: 10px" @on-change="refreshErrMsg" @on-keyup.enter="loginSubmit">
        <span slot="prepend">
          <Icon type="person"></Icon>
        </span>
      </iInput>
      <iInput v-model="password" size="large" type="password" :maxlength="16" @on-change="refreshErrMsg" @on-keyup.enter="loginSubmit">
        <span slot="prepend">
          <Icon type="key"></Icon>
        </span>
      </iInput>
      <iInput v-model="validateCode" size="large" class="valid-input" :maxlength="4" @on-change="refreshErrMsg" @on-keyup.enter="loginSubmit">
        <span slot="prepend">
          <div class="valid-code-label"> </div>
        </span>
        <span slot="append">
          <div class="valid-code-img">
            <img :src="validateCodeImgUrl" @click="refreshValidateCode()">
          </div>
        </span>
      </iInput>
      <p class="error-msg">{{errMsg}}</p>
      <Button type="primary" size="large" long
              :disabled="!!errMsg || submitting"
              @click="loginSubmit">登录</Button>
      <div class="tip-msg">注：如忘记密码，请联系管理员申请找回</div>
    </Card>
    <div class="login-mark-div"></div>
  </div>
</template>
<script type="text/javascript">
  import {mapActions} from 'vuex'
  import MD5 from 'crypto-js/md5'
  export default {
    data () {
      return {
        username: '',
        password: '',
        validateCode: '',
        validateCodeImgUrl: apiGetValidateCode,
        neverSubmitted: true, // 从来没有提交过
        submitting: false, // 正在提交
        errMsg: ''
      }
    },
    methods: {
      ...mapActions([
        'login'
      ]),
      refreshValidateCode () {
        this.validateCodeImgUrl = this.validateCodeImgUrl.split('?')[0] + '?time=' + this.$moment()._d.getTime()
      },
      loginSubmit () {
        this.neverSubmitted = false // 标识已经执行过提交方法
        this.refreshErrMsg() // 去校验是否有空项
        if (this.errMsg) {
          return false // 如果有错误，返回不提交
        }
        this.submitting = true // 标识正在提交中
        let self = this
        // 假登录处理
        let instance = this.$http.create()
        instance.interceptors.response.use(function () {
          return {
            user: {
              username: 'zhangsan',
              cnname: '张三'
            }
          }
        }, function (error) {
          let user = JSON.parse(error.config.data)
          if (user.username === 'admin' && user.password === 'admin') {
            return {
              data: {
                code: 200,
                user: user
              }
            }
          } else {
            return {
              data: {
                code: 400,
                errMsg: '用户名或密码错误'
              }
            }
          }
        })
        this.$http.post(`${apiLogin}`, {
          username: self.username,
          password: MD5(self.password).toString(),
          validateCode: self.validateCode
        }).then(response => {
          if (response.data.code === 200) {
            console.log('submit success...')
            // 登录成功
            self.login(response.data.data)
            console.log(response.data.data)
            this.submitting = false
          } else {
            console.log('submit failed...')
            // 登录失败
            self.refreshErrMsg(response.data.msg)
            this.submitting = false
          }
        }).catch(e => {
          console.log('submit catch...')
          this.submitting = false
        })
      },
      refreshErrMsg (errMsg) {
        console.log('refreshErrMsg')
        // 如果没有点过提交按钮，直接返回
        if (this.neverSubmitted) {
          return
        }
        // 如果传进来错误信息，直接使用
        if (typeof errMsg === 'string' && errMsg.trim() !== '') {
          this.errMsg = errMsg
        } else {
          let emptyStrArr = []
          if (this.username.trim() === '') {
            emptyStrArr.push('用户名')
          }
          if (this.password.trim() === '') {
            emptyStrArr.push('密码')
          }
          if (this.validateCode.trim() === '') {
            emptyStrArr.push('验证码')
          }
          if (emptyStrArr.length > 0) {
            this.errMsg = emptyStrArr.join('、') + ' 不能为空'
          } else {
            this.errMsg = ''
          }
        }
      }
    }
  }
</script>
<style lang="stylus" ref="stylesheet/stylus">
  @import "styles/common.styl"
  .login-page
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    display: flex
    flex-direction: row
    justify-content: center
    align-content: center
    align-items: center
    background-color: #0086b3
    background-image: url(../static/images/login-bg.jpg)
    background-position: center
    background-repeat: no-repeat
    background-size: cover
    .login-logo
      background-image: url(../static/images/x2-logo-hd.png)
      width: 100px
      height: 100px
      background-size: contain
      margin: auto
      border-radius: 50px;
      box-shadow: 2px 5px 25px;
    .ivu-icon
      font-size: 20px
    .login-title
      text-align: center
      font-weight: normal
      font-size: 20px
      padding-top: 25px
      padding-bottom: 10px
      height: 55px
    .ivu-input-wrapper
      margin-top: 24px
      .ivu-input-group-prepend
        width: 50px
    .valid-input
      .valid-code-label
        height: 20px
        background-image: url(../static/images/valid.png)
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      .ivu-input-group-append
        padding: 0px
      .valid-code-img
        width: 50px
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        img
          background: #eee
          width: 50px
    .error-msg
      color: red
      font-size: 12px
      margin: 5px 0
      padding-left: 50px
      line-height: 24px
      height: 24px
    .tip-msg
      font-size: 12px
      color: #ccc
      margin-top: 24px
      text-align: center
    .login-mark-div
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      filter: blur(25px)
      background: inherit
      z-index: -1
</style>
