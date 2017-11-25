/**
 * Created by user on 17/6/2.
 */
// 导入菜单内容
import menus from './modules/menuData'
// 导入全局配置信息
import config from '../../config/config'
export default {
  user: null,
  selectedMenus: [], // 选中的菜单数组
  activeRootMenuId: 'enterprise', // 选中的主菜单
  menus: menus, // 所有菜单
  rootMenus: { // 主菜单
    'enterprise': {
      name: '企业后台',
      routerPath: 'enterprise'
    }
  },
  ...config
}
