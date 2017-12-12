/**
 * Created by user on 17/6/2.
 */
// 导入菜单内容
import menus from './modules/menuData'
// 导入全局配置信息
import config from '../../config/config'
export default {
  user: null,
  getUserFinished: false,
  selectedMenus: [], // 选中的菜单数组
  activeRootMenuId: 'oss', // 选中的主菜单
  menus: menus, // 所有菜单
  rootMenus: { // 主菜单
    'oss': {
      name: '后台管理',
      routerPath: 'oss'
    }
  },
  ...config
}
