<template>
  <div class="page-header">
    <div class="header-logo"></div>
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
        </Submenu>
      </Menu>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {}
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
      background-image: url(../../../static/images/logo.png)
      background-repeat: no-repeat
      background-position: center
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
