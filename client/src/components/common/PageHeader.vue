<template>
  <div class="page-header">
    <div class="header-logo">金麟钢构</div>
    <div class="header-center-menu">
      <ul>
        <template v-for="(value, menuId) in menus">
          <li :class="activeRootMenuId === menuId ? 'active' : ''"
              @click="changeactiveRootMenuId(menuId)">{{rootMenus[menuId].name}}
          </li>
        </template>
      </ul>
    </div>
    <div class="header-right-menu">
      <Menu mode="horizontal" theme="dark" active-name="1">
        <Submenu name="1">
          <template slot="title">
            <Icon type="stats-bars"></Icon>
            {{this.$store.state.user.cnname}}
          </template>
          <Menu-item name="1-1" @click.native="exit">退出登录</Menu-item>
          <Menu-item name="1-2" @click.native="openChangePwdModal">修改密码</Menu-item>
        </Submenu>
      </Menu>
    </div>
    <Modal
      v-model="showPwdModal"
      title="修改密码"
      :loading="pwdModalLoading"
      :mask-closable="false"
      @on-ok="this.changePwd">
      <FormPage ref="pwdModalForm"
                :form-config="pwdModalFormConfig">
      </FormPage>
    </Modal>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import MD5 from 'crypto-js/md5'
  export default {
    data () {
      return {
        showPwdModal: false,
        pwdModalLoading: true,
        pwdModalFormConfig: {
          formStyle: {
            width: '100%'
          },
          justFormItems: true,
          formModel: {},
          formItems: {
            password: {
              type: 'text',
              config: {
                isPassword: true
              },
              label: '旧密码'
            },
            newPassword: {
              type: 'text',
              config: {
                isPassword: true
              },
              maxlength: 20,
              label: '新密码'
            },
            confirmPassword: {
              type: 'text',
              config: {
                isPassword: true
              },
              label: '确认密码'
            }
          },
          formRules: {
            password: [
              {required: true, message: '不能为空'}
            ],
            newPassword: [
              {required: true, message: '不能为空'},
              {type: 'string', min: 6, max: 20, message: '6~20位'}
            ],
            confirmPassword: [
              {required: true, message: '不能为空'},
              {
                validator: (rule, value, callback, source, options) => {
                  if (value !== this.pwdModalFormConfig.formModel.newPassword) {
                    callback(new Error('两次密码输入不一致'))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ]
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'menus', 'activeRootMenuId', 'rootMenus'
      ])
    },
    methods: {
      ...mapActions([
        'changeactiveRootMenuId',
        'logout'
      ]),
      exit () {
        // eslint-disable-next-line no-undef
        this.$http.get(apiLogout).then(response => {
          if (response.data.code === 200) {
            this.logout()
          }
        })
      },
      openChangePwdModal () {
        this.$refs['pwdModalForm'].resetFields()
        this.showPwdModal = true
      },
      changePwd () {
        this.pwdModalLoading = false
        this.$refs['pwdModalForm'].validate((valid, formData) => {
          if (valid) {
            let url = `${apiChangePwd}`
            formData.password = MD5(formData.password).toString()
            formData.newPassword = MD5(formData.newPassword).toString()
            formData.id = this.$loginUser.id
            this.$http.post(url, formData).then(response => {
              if (response.data.code === 200) {
                this.$Message.success('操作成功')
                this.$refs['pwdModalForm'].resetFields()
                this.showPwdModal = false
              }
            })
          }
        })
        this.$nextTick(() => {
          this.pwdModalLoading = true
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../styles/common.styl"
  .page-header
    display: flex
    justify-content: space-between
    height: G_PAGE_HEADER_HEIGHT
    min-height: G_PAGE_HEADER_HEIGHT
    background: #2553a0
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.24)
    z-index: 1
    .header-logo
      width: G_SIDE_MENU_OUT_WRAPPER
      // background-image: url(../../../static/images/logo.png)
      // background-repeat: no-repeat
      // background-position: center
      display:flex
      padding-left:20px
      justify-content: flex-start
      align-items : center
      font-size: 26px
      color: #fff
      font-family: '微软雅黑'
      font-weight: 100
    .header-center-menu
      flex-grow: 1
      ul
        height: G_PAGE_HEADER_HEIGHT
        line-height: G_PAGE_HEADER_HEIGHT
        li
          float: left
          padding: 0 30px
          color: #ddd
          font-size: 18px
          cursor: pointer
          border-left: 1px solid rgba(255, 255, 255, 0.1)
          &:hover, &.active
            background-color: rgba(0, 0, 0, 0.3)
    .header-right-menu
      .ivu-menu-horizontal
        background-color: rgba(0, 0, 0, 0.2);
        height: G_PAGE_HEADER_HEIGHT
        line-height: G_PAGE_HEADER_HEIGHT
</style>
