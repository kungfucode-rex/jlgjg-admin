/**
 * Created by user on 17/6/2.
 */
/**
 * 更改主菜单
 * @param commit
 * @param menu 主菜单id
 */
export const changeactiveRootMenuId = ({commit}, menu) => {
  commit('changeactiveRootMenuId', menu)
}
/**
 * 退出
 * @param commit
 */
export const logout = ({commit}) => {
  commit('logout')
}
/**
 * 登录
 * @param commit
 */
export const login = ({commit}, user) => {
  commit('login', user)
}
/**
 * 更新页面路劲
 * @param commit
 * @param menus 选中的菜单路劲
 */
export const updateBreadcrumb = ({commit}, menus) => {
  commit('updateBreadcrumb', menus)
}
/**
 * 完成拉取用户的动作, 再拉取之前不现实登录页面, 也不显示首页
 * @param commit
 */
export const finishedGetUser = ({commit}) => {
  commit('finishedGetUser')
}
