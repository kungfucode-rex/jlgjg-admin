<template>
  <div class="side-menu-out-wrapper">
    <div class="side-menu-container" ref="sideMenuContainer">
      <Menu theme="dark"
            ref="rootMenu"
            accordion width="auto"
            :open-names="openMenu.items"
            @on-select=""
            :active-name="activeMenu">
        <template v-for="menu1 in menus[activeRootMenuId]">
          <Submenu :name="menu1.text">
            <template slot="title">
              {{menu1.text}}
            </template>
            <template v-for="menu2 in menu1.subMenus">
              <!-- 如果没有菜单目录 -->
              <template v-if="!menu2.subMenus">
                <Menu-item :name="menu2.text"
                           @click.native="handleMenuClick(menu1, menu2)">
                  {{menu2.text}}
                </Menu-item>
              </template>
              <!-- 如果有菜单目录 -->
              <template v-else>
                <Menu theme="dark"
                      ref="subMenus"
                      accordion
                      width="auto"
                      @on-open-change="onOpenChange"
                      :active-name="activeMenu">
                  <Submenu :name="menu2.text" :ref="menu2.text">
                    <template slot="title">
                      {{menu2.text}}
                    </template>
                    <template v-for="menu3 in menu2.subMenus">
                      <Menu-item :name="menu3.text"
                                 @click.native="handleMenuClick(menu1, menu2, menu3)">
                        {{menu3.text}}
                      </Menu-item>
                    </template>
                  </Submenu>
                </Menu>
              </template>
            </template>
          </Submenu>
        </template>
      </Menu>
    </div>
  </div>
</template>
<script>
  // import Ps from 'perfect-scrollbar'
  import { mapGetters, mapActions } from 'vuex'
  import router from '../../router'
  export default {
    data () {
      return {
        currentPath: this.$route.path,
        openMenu: {
          items: []
        },
        activeMenu: '',
        needCloseMenuNames: [], // 需要闭合的二级菜单的集合
        activeClass: 'ivu-menu-item-active ivu-menu-item-selected'
      }
    },
    computed: {
      ...mapGetters([
        'menus', 'activeRootMenuId'
      ])
    },
    methods: {
      ...mapActions([
        'updateBreadcrumb', 'changeactiveRootMenuId'
      ]),
      handleMenuClick (menu1, menu2, menu3) {
        let routeName = menu3 ? menu3.name : menu2.name
        // 如果有routeName则项目内部跳转,否则使用菜单的link属性跳转到第三方项目
        if (routeName) {
          // 更新页面路劲信息
          this.updateBreadcrumb([menu1, menu2, menu3])
          // 跳转页面
          router.push({name: routeName})
          // this.activeClass = ''
          this.setActiveMenu(menu1, menu2, menu3)
        } else {
          window.location = menu3 ? menu3.link : menu2.link
        }
      },
      setActiveMenu (menu1, menu2, menu3) {
        if (menu3) {
          this.openMenu.items = [menu1.text, menu2.text]
          this.activeMenu = menu3.text
        } else {
          this.openMenu.items = [menu1.text]
          this.activeMenu = menu2.text
        }
        console.log('open:' + this.openMenu.items)
        console.log('active:' + this.activeMenu)
        return true
      },
      // 展开二级菜单时,需合并其它的二级菜单
      onOpenChange (openNames) {
        if (openNames.length > 0) {
          // 当前点击的菜单(二级菜单)
          let curentClickMenu = this.$refs[openNames[0]][0]
          // 记录下需要展开或闭合的状态
          const opened = curentClickMenu.opened
          // 遍历他的父组件(一级菜单)的二级菜单,全部闭合
          curentClickMenu.parent.$parent.$children.forEach(item => {
            // debugger
            if (item.$options.name === 'Menu') item.$children[0].opened = false
          })
          // 将刚点击的展开或闭合
          curentClickMenu.opened = opened
          curentClickMenu.parent.updateOpenKeys(curentClickMenu.name)
        }
      }
    },
    mounted () {
      let self = this
      let findMenu = false
      let checkSecondMenus = function (firstMenu, secondMenus) {
        secondMenus.forEach(secondMenu => {
          if (findMenu) {
            return false
          }
          if (self.$route.name === secondMenu.name) {
            self.setActiveMenu(firstMenu, secondMenu)
            // 更新页面路劲信息
            self.updateBreadcrumb([firstMenu, secondMenu])
            findMenu = true
          } else if (secondMenu.subMenus) {
            checkThirdMenus(firstMenu, secondMenu, secondMenu.subMenus)
          }
        })
      }
      let checkThirdMenus = function (firstMenu, secondMenu, thirdMenus) {
        thirdMenus.forEach(thirdMenu => {
          if (findMenu) {
            return false
          }
          if (self.$route.name === thirdMenu.name) {
            self.setActiveMenu(firstMenu, secondMenu, thirdMenu)
            // 更新页面路劲信息
            self.updateBreadcrumb([firstMenu, secondMenu, thirdMenu])
            findMenu = true
          }
        })
      }
      if (self.$route.name) {
        self.changeactiveRootMenuId(self.$route.name.split('_')[0])
        self.menus[self.activeRootMenuId].forEach(firstMenu => {
          if (findMenu) {
            return false
          }
          if (self.$route.name === firstMenu.name) {
            self.setActiveMenu(firstMenu)
            findMenu = true
          } else if (firstMenu.subMenus) {
            checkSecondMenus(firstMenu, firstMenu.subMenus)
          }
        })
      }
      this.$nextTick(function () {
        self.$refs['rootMenu'].updateOpened()
      })
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../styles/common.styl"
  .side-menu-out-wrapper
    width: G_SIDE_MENU_OUT_WRAPPER
    overflow: hidden
    position: relative
    background-color: #1c2438
    .side-menu-container
      flex-grow: 0
      flex-shrink: 0
      overflow-y: scroll
      width: G_SIDE_MENU_WIDTH
      background-color: #1c2438
      user-select: none
      height: 100%
      .ivu-menu-submenu // 一级菜单目录
        border-bottom: 1px solid rgba(255, 255, 255, 0.1)
        box-sizing: border-box
        .ivu-menu-submenu-title
          height: G_SIDE_MENU_ITEM_HEIGHT
          line-height: G_SIDE_MENU_ITEM_HEIGHT
          padding: 0 20px
          .ivu-menu-submenu-title-icon
            line-height: G_SIDE_MENU_ITEM_HEIGHT
            top: 0
        > .ivu-menu
          border-left: 20px solid #1c2438
          border-bottom: 10px solid #1c2438;
        .ivu-menu-item // 二级叶子菜单
          padding: 10px 15px 10px 20px
        .ivu-menu-submenu // 二级菜单目录
          background-color: #3f434c
          .ivu-menu-submenu-title
            padding-left: 20px;
            background-color: #313540
          .ivu-menu-item
            padding-left: 20px
          > .ivu-menu
            border-left: 20px solid #313540
            border-bottom: 10px solid #313540;
      .ivu-menu-item-selected
        &:after
          content: ' ';
          position: absolute;
          right: 0;
          height: 100%;
          width: 10px;
          top: 0;
          border-left: none;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          border-right: 10px solid G_BACK_GROUND_COLOR;
      .ivu-menu-opened
        .ivu-menu-submenu
          .ivu-menu-submenu-title-icon
            transform: rotate(0deg);
        .ivu-menu-opened
          .ivu-menu-submenu-title-icon
            transform: rotate(180deg);
          .ivu-menu-item-active
            background-color: #2c4e9e !important;

  .ivu-menu-dark
    background-color: #242f4a

  .ivu-menu-dark.ivu-menu-vertical
    .ivu-menu-submenu
      .ivu-menu-item-active, .ivu-menu-item-active:hover
        background-color: #3f434c !important;
    .ivu-menu-opened
      .ivu-menu-opened
        .ivu-menu-item-active
          background-color: #2c4e9e !important;

  .side-menu-container
    > .ivu-menu-dark.ivu-menu-vertical
      > .ivu-menu-opened
        > .ivu-menu-submenu-title
          background-color: #1c2438
</style>
