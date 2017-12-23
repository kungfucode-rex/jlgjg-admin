<template>
  <div class="login-page">
    <div class="logo-container">
      <div class="logo">鑫</div>
      <p class="login-title">金麟钢构后台管理</p>
    </div> 
    <div class="login-form">
      <mt-field label="用户名" 
        placeholder="请输入用户名" 
        v-model="username"></mt-field>
      <mt-field label="密码" 
        placeholder="请输入密码" 
        type="password" 
        v-model="password"></mt-field>
      <mt-field label="验证码" v-model="validateCode">
        <img class="validate-image" :src="validateCodeImgUrl" height="45px" width="100px">
      </mt-field>  
      <div class="err-msg-container">{{errMsg}}</div>
      <mt-button type="default" size="large"
        @click.native="loginSubmit">登录</mt-button>
    </div>
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
      handleClick () {
        let self = this
        this.$Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        setTimeout(function () {
          self.$Indicator.close()
        }, 1000)
      },
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
    display: flex
    height: 100%
    margin: auto
    align-items: center
    justify-content: center
    flex-direction: column
    .logo-container
      .logo
        width: 100px
        height: 100px
        background-size: contain
        margin: auto
        border-radius: 50px;
        box-shadow: 2px 5px 25px;
        display: flex
        justify-content: center
        align-items: center
        font-size: 48px
        background: linear-gradient(to bottom, #fff 0%, #d0D0D0 98%)
        color: #000;
      .login-title
        font-size: 28px
        color: #fff  
    .login-form
      .validate-image
        background-color: #ececed
        left: -90px;
        top: -22px;
        position absolute
      .err-msg-container  
        height: 40px  
        font-size: 14px
        line-height: 40px
        color: #bb3b3b
</style>
