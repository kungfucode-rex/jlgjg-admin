/**
 * Created by user on 17/6/2.
 */
export default {
  /**
   * 用户登录
   * @param state
   * @param user
   */
  login (state, user) {
    state.user = user
  },
  /**
   * 用户注销
   * @param state
   */
  logout (state) {
    state.user = null
  },
  /**
   * 跟新页面路劲
   * @param state
   * @param menus
   */
  updateBreadcrumb (state, menus) {
    // debugger
    state.selectedMenus = menus
  },
  /**
   * 改变主菜单
   * @param state
   * @param menu 主菜单id
   */
  changeactiveRootMenuId (state, menu) {
    state.activeRootMenuId = menu
  }
}
