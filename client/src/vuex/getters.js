/**
 * Created by kungfucode on 2017/6/4.
 */
/**
 * 获取菜单
 * @param state
 * @returns {*}
 */
export const menus = state => {
  return state.menus
}
/**
 * 获取选中状态的主菜单id
 * @param state
 * @returns {string|*}
 */
export const activeRootMenuId = state => {
  return state.activeRootMenuId
}
/**
 * 获取主菜单
 * @param state
 * @returns {rootMenus|{oss, charge, energy}}
 */
export const rootMenus = state => {
  return state.rootMenus
}
/**
 * 获取全局分页配置
 * @param state
 * @returns {pagerConfig|{pageSize, Index, offset, transfer}}
 */
export const pagerConfig = state => {
  return state.pagerConfig
}
/**
 * 获取登录用户信息
 * @param state
 * @returns {user}
 */
export const user = state => {
  return state.user
}
